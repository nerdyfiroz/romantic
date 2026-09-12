const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;
const HOST = '0.0.0.0';

app.use(express.json());

// Proposals persistence storage (supports writable /tmp when running on Vercel Serverless)
const DATA_DIR = process.env.VERCEL ? path.join('/tmp', 'data') : path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'proposals.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

let proposals = {};
if (fs.existsSync(DATA_FILE)) {
  try {
    proposals = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  } catch (err) {
    console.error('Error reading proposals.json, starting fresh', err);
    proposals = {};
  }
}

function saveProposals() {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(proposals, null, 2), 'utf8');
  } catch (err) {
    console.error('Error saving proposals.json', err);
  }
}

// Active Server-Sent Events subscribers for real-time acceptance notification
const sseClients = new Map(); // proposalId -> Set of res objects

function broadcastProposalUpdate(proposalId, data) {
  if (sseClients.has(proposalId)) {
    const clients = sseClients.get(proposalId);
    const payload = `data: ${JSON.stringify(data)}\n\n`;
    for (const client of clients) {
      try {
        client.write(payload);
      } catch (e) {
        // client closed
      }
    }
  }
}

// Proposals API Router - mounted at both /api and root / for seamless Vercel / serverless routing
const apiRouter = express.Router();

// API: Create new romantic proposal
apiRouter.post('/proposals', (req, res) => {
  const {
    sender,
    partner,
    dynamic = 'girl_to_boy', // 'girl_to_boy' | 'boy_to_girl' | 'soulmates'
    emotion = 'rose',
    motionMode = 'pulse',
    animSpeed = 1.0,
    particleDensity = 'medium',
    touchFx = 'sparkles',
    customNote = '',
    customVow = ''
  } = req.body || {};

  if (!sender || !partner) {
    return res.status(400).json({ error: 'Both sender and partner names are required' });
  }

  // Generate a cute readable ID
  const shortId = 'love-' + Math.random().toString(36).substring(2, 8);
  const newProposal = {
    id: shortId,
    sender: sender.trim(),
    partner: partner.trim(),
    dynamic,
    emotion,
    motionMode,
    animSpeed,
    particleDensity,
    touchFx,
    customNote: customNote ? customNote.trim() : '',
    customVow: customVow ? customVow.trim() : '',
    status: 'pending', // 'pending' | 'accepted'
    createdAt: new Date().toISOString(),
    acceptedAt: null,
    replyNote: ''
  };

  proposals[shortId] = newProposal;
  saveProposals();

  res.json({
    success: true,
    id: shortId,
    proposal: newProposal
  });
});

// API: Get proposal by ID
apiRouter.get('/proposals/:id', (req, res) => {
  const proposal = proposals[req.params.id];
  if (!proposal) {
    return res.status(404).json({ error: 'Proposal not found' });
  }
  res.json({ success: true, proposal, ...proposal });
});

// API: Accept proposal (called when recipient says YES)
apiRouter.post('/proposals/:id/accept', (req, res) => {
  const proposalId = req.params.id;
  const proposal = proposals[proposalId];
  if (!proposal) {
    return res.status(404).json({ error: 'Proposal not found' });
  }

  const { replyNote = '' } = req.body || {};
  proposal.status = 'accepted';
  proposal.acceptedAt = new Date().toISOString();
  proposal.replyNote = replyNote ? replyNote.trim() : '';

  saveProposals();

  // Notify any active SSE listeners (sender tab)
  broadcastProposalUpdate(proposalId, {
    type: 'ACCEPTED',
    proposalId,
    acceptedAt: proposal.acceptedAt,
    replyNote: proposal.replyNote,
    proposal
  });

  res.json({
    success: true,
    message: 'Proposal accepted!',
    proposal
  });
});

// API: Real-time SSE stream for sender notification
apiRouter.get('/proposals/:id/events', (req, res) => {
  const proposalId = req.params.id;
  const proposal = proposals[proposalId];

  if (!proposal) {
    return res.status(404).end();
  }

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders?.();

  if (!sseClients.has(proposalId)) {
    sseClients.set(proposalId, new Set());
  }
  sseClients.get(proposalId).add(res);

  // Send initial ping
  res.write(`data: ${JSON.stringify({ type: 'CONNECTED', proposal })}\n\n`);

  req.on('close', () => {
    const clients = sseClients.get(proposalId);
    if (clients) {
      clients.delete(res);
      if (clients.size === 0) {
        sseClients.delete(proposalId);
      }
    }
  });
});

// Mount router under both /api and root
app.use('/api', apiRouter);
app.use(apiRouter);

// Serve static frontend files with explicit no-cache for scripts/styles/html
app.use(express.static(__dirname, {
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.html') || filePath.endsWith('.js') || filePath.endsWith('.css') || filePath.endsWith('sw.js')) {
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    }
  }
}));

// Route non-asset URLs to index.html (never serve index.html for static assets)
app.get('*', (req, res) => {
  if (/\.(css|js|png|jpg|jpeg|svg|ico|json|webm|mp4|webp)$/i.test(req.path)) {
    return res.status(404).send('Asset not found');
  }
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.sendFile(path.join(__dirname, 'index.html'));
});

module.exports = app;

if (require.main === module || !process.env.VERCEL) {
  app.listen(PORT, HOST, () => {
    console.log(`Server running at http://${HOST}:${PORT}`);
  });
}
