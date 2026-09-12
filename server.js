const express = require('express');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

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

// Helper to persist a new proposal to Supabase
async function saveProposalToSupabase(proposal) {
  const supabase = getSupabase();
  if (!supabase) return;
  try {
    const { error } = await supabase.from('proposals').upsert({
      id: proposal.id,
      sender: proposal.sender,
      partner: proposal.partner,
      status: proposal.status || 'pending',
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

// Helper to strictly update acceptance fields in Supabase (cannot modify sender/partner/vows)
async function updateProposalAcceptanceInSupabase(proposalId, acceptedAt, replyNote) {
  const supabase = getSupabase();
  if (!supabase) return;
  try {
    const { error } = await supabase
      .from('proposals')
      .update({
        status: 'accepted',
        accepted_at: acceptedAt,
        reply_note: replyNote || ''
      })
      .eq('id', proposalId);

    if (error) {
      // If RLS blocked standard update, try safe RPC function
      const rpcResult = await supabase.rpc('accept_proposal', {
        p_id: proposalId,
        p_reply_note: replyNote || ''
      });
      if (rpcResult.error) {
        console.warn('Supabase acceptance RPC warning:', rpcResult.error.message);
      }
    }
  } catch (err) {
    console.warn('Supabase update acceptance error:', err.message);
  }
}

// Helper to fetch a proposal from Supabase
async function fetchProposalFromSupabase(id) {
  const supabase = getSupabase();
  if (!supabase) return null;
  try {
    let data = null;
    const { data: directData, error } = await supabase
      .from('proposals')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (!error && directData) {
      data = directData;
    } else {
      // Fallback to secure single-lookup RPC function if direct SELECT was restricted by RLS
      const { data: rpcData, error: rpcError } = await supabase.rpc('get_proposal', { p_id: id });
      if (!rpcError && Array.isArray(rpcData) && rpcData.length > 0) {
        data = rpcData[0];
      }
    }

    if (!data) return null;

    if (data.payload && typeof data.payload === 'object' && data.payload.id) {
      return {
        ...data.payload,
        status: data.status || data.payload.status,
        replyNote: data.reply_note !== undefined ? data.reply_note : data.payload.replyNote,
        acceptedAt: data.accepted_at || data.payload.acceptedAt
      };
    }

    return {
      id: data.id,
      sender: data.sender,
      partner: data.partner,
      status: data.status,
      replyNote: data.reply_note || '',
      createdAt: data.created_at,
      acceptedAt: data.accepted_at,
      dynamic: data.dynamic || 'boy_to_girl',
      emotion: data.emotion || 'rose',
      motionMode: data.motion_mode || 'pulse',
      animSpeed: data.anim_speed ? parseFloat(data.anim_speed) : 1.0,
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

// API: Restricted listing (Prevents public enumeration of lovers' proposals)
apiRouter.get('/proposals', (req, res) => {
  const adminSecret = process.env.ADMIN_SECRET;
  const providedAuth = req.headers['x-admin-token'] || req.query.admin_token;
  if (adminSecret && providedAuth && providedAuth === adminSecret) {
    const list = Object.values(proposals).map((p) => ({
      id: p.id,
      sender: p.sender,
      partner: p.partner,
      status: p.status,
      createdAt: p.createdAt,
      acceptedAt: p.acceptedAt,
      replyNote: p.replyNote
    }));
    return res.json({ success: true, count: list.length, proposals: list });
  }

  // Security: Forbid anonymous enumeration of database proposals
  return res.status(403).json({
    error: 'Direct enumeration of proposals is restricted for privacy and security. Proposals are accessible only via their unique private links.'
  });
});

// API: Create new romantic proposal with cryptographically secure ID
apiRouter.post('/proposals', async (req, res) => {
  const {
    sender,
    partner,
    dynamic = 'boy_to_girl',
    emotion = 'rose',
    motionMode = 'pulse',
    animSpeed = 1.0,
    particleDensity = 'medium',
    touchFx = 'sparkles',
    customNote = '',
    customVow = ''
  } = req.body || {};

  if (!sender || typeof sender !== 'string' || !sender.trim()) {
    return res.status(400).json({ error: 'Proposer name (sender) is required' });
  }
  if (!partner || typeof partner !== 'string' || !partner.trim()) {
    return res.status(400).json({ error: 'Partner name is required' });
  }

  const cleanSender = sender.trim().slice(0, 80);
  const cleanPartner = partner.trim().slice(0, 80);
  const allowedDynamics = ['girl_to_boy', 'boy_to_girl', 'soulmates'];
  const cleanDynamic = allowedDynamics.includes(dynamic) ? dynamic : 'boy_to_girl';
  const cleanEmotion = typeof emotion === 'string' ? emotion.slice(0, 40) : 'rose';
  const allowedMotions = ['pulse', 'vortex', 'wave', 'shimmer', 'wings'];
  const cleanMotion = allowedMotions.includes(motionMode) ? motionMode : 'pulse';
  const numSpeed = parseFloat(animSpeed);
  const cleanSpeed = (!isNaN(numSpeed) && numSpeed >= 0.2 && numSpeed <= 5.0) ? numSpeed : 1.0;
  const allowedDensities = ['light', 'medium', 'high'];
  const cleanDensity = allowedDensities.includes(particleDensity) ? particleDensity : 'medium';
  const allowedTouch = ['sparkles', 'hearts', 'petals', 'embers', 'rainbow'];
  const cleanTouch = allowedTouch.includes(touchFx) ? touchFx : 'sparkles';
  const cleanNote = typeof customNote === 'string' ? customNote.trim().slice(0, 1000) : '';
  const cleanVow = typeof customVow === 'string' ? customVow.trim().slice(0, 1000) : '';

  // Cryptographically secure, unpredictable 128-bit proposal token (32 hex chars)
  const secureId = 'love-' + crypto.randomBytes(16).toString('hex');

  const newProposal = {
    id: secureId,
    sender: cleanSender,
    partner: cleanPartner,
    dynamic: cleanDynamic,
    emotion: cleanEmotion,
    motionMode: cleanMotion,
    animSpeed: cleanSpeed,
    particleDensity: cleanDensity,
    touchFx: cleanTouch,
    customNote: cleanNote,
    customVow: cleanVow,
    status: 'pending',
    createdAt: new Date().toISOString(),
    acceptedAt: null,
    replyNote: ''
  };

  proposals[secureId] = newProposal;
  saveProposals();

  // Asynchronously persist to Supabase if connected
  await saveProposalToSupabase(newProposal);

  res.status(201).json({
    success: true,
    id: secureId,
    proposal: newProposal
  });
});

// API: Get proposal by ID
apiRouter.get('/proposals/:id', async (req, res) => {
  const proposalId = req.params.id;
  if (!proposalId || typeof proposalId !== 'string' || !/^[a-zA-Z0-9_-]{8,64}$/.test(proposalId)) {
    return res.status(400).json({ error: 'Invalid proposal ID format' });
  }

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
  res.json({ success: true, proposal, ...proposal });
});

// API: Accept proposal (called when recipient says YES)
apiRouter.post('/proposals/:id/accept', async (req, res) => {
  const proposalId = req.params.id;
  if (!proposalId || typeof proposalId !== 'string' || !/^[a-zA-Z0-9_-]{8,64}$/.test(proposalId)) {
    return res.status(400).json({ error: 'Invalid proposal ID format' });
  }

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
  const cleanReply = typeof replyNote === 'string' ? replyNote.trim().slice(0, 500) : '';

  // If already accepted, return current status idempotently without overwriting
  if (proposal.status === 'accepted') {
    return res.json({
      success: true,
      message: 'Proposal has already been accepted',
      alreadyAccepted: true,
      proposal
    });
  }

  proposal.status = 'accepted';
  proposal.acceptedAt = new Date().toISOString();
  proposal.replyNote = cleanReply;

  saveProposals();

  // Strictly update acceptance fields in Supabase
  await updateProposalAcceptanceInSupabase(proposalId, proposal.acceptedAt, proposal.replyNote);

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
