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

// Supabase integration (lazy-loaded with fallback to local storage)
let supabaseClient = null;

function getSupabase() {
  if (supabaseClient) return supabaseClient;
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (url && key) {
    try {
      const { createClient } = require('@supabase/supabase-js');
      supabaseClient = createClient(url, key);
      return supabaseClient;
    } catch (err) {
      console.error('Failed to initialize Supabase client:', err.message);
    }
  }
  return null;
}

// Helper to persist a proposal to Supabase
async function saveProposalToSupabase(proposal) {
  const supabase = getSupabase();
  if (!supabase) return;
  try {
    const { error } = await supabase.from('proposals').upsert({
      id: proposal.id,
      sender: proposal.sender,
      partner: proposal.partner,
      status: proposal.status,
      reply_note: proposal.replyNote || '',
      created_at: proposal.createdAt,
      accepted_at: proposal.acceptedAt,
      dynamic: proposal.dynamic,
      emotion: proposal.emotion,
      motion_mode: proposal.motionMode,
      anim_speed: proposal.animSpeed,
      particle_density: proposal.particleDensity,
      touch_fx: proposal.touchFx,
      custom_note: proposal.customNote || '',
      custom_vow: proposal.customVow || '',
      payload: proposal
    });
    if (error) {
      console.warn('Supabase upsert warning:', error.message);
    }
  } catch (err) {
    console.warn('Supabase save error:', err.message);
  }
}

// Helper to fetch a proposal from Supabase
async function fetchProposalFromSupabase(id) {
  const supabase = getSupabase();
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from('proposals')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error || !data) return null;

    if (data.payload && typeof data.payload === 'object') {
      return data.payload;
    }

    return {
      id: data.id,
      sender: data.sender,
      partner: data.partner,
      status: data.status,
      replyNote: data.reply_note || '',
      createdAt: data.created_at,
      acceptedAt: data.accepted_at,
      dynamic: data.dynamic || 'girl_to_boy',
      emotion: data.emotion || 'rose',
      motionMode: data.motion_mode || 'pulse',
      animSpeed: data.anim_speed || 1.0,
      particleDensity: data.particle_density || 'medium',
      touchFx: data.touch_fx || 'sparkles',
      customNote: data.custom_note || '',
      customVow: data.custom_vow || ''
    };
  } catch (err) {
    console.warn('Supabase fetch error:', err.message);
    return null;
  }
}

// Proposals API Router - mounted at both /api and root / for seamless Vercel / serverless routing
const apiRouter = express.Router();

// API: Health and Storage Check
apiRouter.get('/health', (req, res) => {
  const hasSupabase = !!getSupabase();
  res.json({
    status: 'healthy',
    storage: hasSupabase ? 'supabase' : 'local_storage',
    supabaseConnected: hasSupabase,
    cachedProposals: Object.keys(proposals).length
  });
});

// API: List all proposals (for tracking who used the app, names, and status)
apiRouter.get('/proposals', async (req, res) => {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('proposals')
        .select('id, sender, partner, status, created_at, accepted_at, reply_note')
        .order('created_at', { ascending: false })
        .limit(100);

      if (!error && Array.isArray(data)) {
        const mapped = data.map((item) => ({
          id: item.id,
          sender: item.sender,
          partner: item.partner,
          status: item.status, // 'pending' (waiting) or 'accepted'
          createdAt: item.created_at,
          acceptedAt: item.accepted_at,
          replyNote: item.reply_note
        }));
        return res.json({ success: true, count: mapped.length, storage: 'supabase', proposals: mapped });
      }
    } catch (e) {
      console.warn('Failed to query proposals from Supabase:', e.message);
    }
  }

  // Fallback to in-memory/file proposals
  const list = Object.values(proposals).map((p) => ({
    id: p.id,
    sender: p.sender,
    partner: p.partner,
    status: p.status,
    createdAt: p.createdAt,
    acceptedAt: p.acceptedAt,
    replyNote: p.replyNote
  }));
  res.json({ success: true, count: list.length, storage: 'local', proposals: list });
});

// API: Create new romantic proposal
apiRouter.post('/proposals', async (req, res) => {
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

  // Asynchronously persist to Supabase if connected
  await saveProposalToSupabase(newProposal);

  res.json({
    success: true,
    id: shortId,
    proposal: newProposal
  });
});

// API: Get proposal by ID
apiRouter.get('/proposals/:id', async (req, res) => {
  let proposal = proposals[req.params.id];
  if (!proposal) {
    proposal = await fetchProposalFromSupabase(req.params.id);
    if (proposal) {
      proposals[req.params.id] = proposal;
    }
  }

  if (!proposal) {
    return res.status(404).json({ error: 'Proposal not found' });
  }
  res.json({ success: true, proposal, ...proposal });
});

// API: Accept proposal (called when recipient says YES)
apiRouter.post('/proposals/:id/accept', async (req, res) => {
  const proposalId = req.params.id;
  let proposal = proposals[proposalId];
  if (!proposal) {
    proposal = await fetchProposalFromSupabase(proposalId);
    if (proposal) {
      proposals[proposalId] = proposal;
    }
  }

  if (!proposal) {
    return res.status(404).json({ error: 'Proposal not found' });
  }

  const { replyNote = '' } = req.body || {};
  proposal.status = 'accepted';
  proposal.acceptedAt = new Date().toISOString();
  proposal.replyNote = replyNote ? replyNote.trim() : '';

  saveProposals();

  // Update in Supabase
  await saveProposalToSupabase(proposal);

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

// Serve static frontend files from public (and root fallback) with explicit no-cache
const staticOptions = {
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.html') || filePath.endsWith('.js') || filePath.endsWith('.css') || filePath.endsWith('sw.js')) {
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    }
  }
};
app.use(express.static(path.join(__dirname, 'public'), staticOptions));
app.use(express.static(__dirname, staticOptions));

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
