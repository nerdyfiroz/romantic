const canvas = document.getElementById("heartCanvas");
const ctx = canvas.getContext("2d");
const message = document.getElementById("heartMessage");
const yesBtn = document.getElementById("yesBtn");
const againBtn = document.getElementById("againBtn");
const success = document.getElementById("success");

let particles = [];
let animationId;
let startTime = performance.now();
let heartReady = false;

function resize() {
  const rect = canvas.getBoundingClientRect();
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.floor(rect.width * dpr);
  canvas.height = Math.floor(rect.height * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  createParticles();
}

function heartPoint(t, scale = 1) {
  // Parametric heart curve.
  const x = 16 * Math.pow(Math.sin(t), 3);
  const y = -(13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t));
  return { x: x * scale, y: y * scale };
}

function createParticles() {
  const w = canvas.clientWidth;
  const h = canvas.clientHeight;
  const scale = Math.min(w, h) / 42;
  const cx = w / 2;
  const cy = h / 2 + 4;

  particles = [];

  // Heart particles.
  const heartCount = Math.max(700, Math.floor((w * h) / 210));
  for (let i = 0; i < heartCount; i++) {
    const t = Math.random() * Math.PI * 2;
    const p = heartPoint(t, scale);

    // Give the heart a soft thickness so it looks like glowing dust.
    const normalJitter = (Math.random() - .5) * scale * (0.8 + Math.random() * 1.8);

    particles.push({
      x: cx + p.x + normalJitter,
      y: cy + p.y + normalJitter,
      baseX: cx + p.x + normalJitter,
      baseY: cy + p.y + normalJitter,
      size: Math.random() * 1.25 + .25,
      alpha: Math.random() * .8 + .2,
      phase: Math.random() * Math.PI * 2,
      speed: .5 + Math.random() * 1.6,
      color: Math.random() > .16 ? "255,105,151" : "255,225,237"
    });
  }

  // Ambient dust.
  const dustCount = Math.max(180, Math.floor((w * h) / 1200));
  for (let i = 0; i < dustCount; i++) {
    particles.push({
      x: Math.random() * w,
      y: Math.random() * h,
      baseX: Math.random() * w,
      baseY: Math.random() * h,
      size: Math.random() * .8 + .2,
      alpha: Math.random() * .32,
      phase: Math.random() * Math.PI * 2,
      speed: .3 + Math.random() * .7,
      ambient: true,
      color: "190,198,255"
    });
  }
}

function draw(now) {
  const w = canvas.clientWidth;
  const h = canvas.clientHeight;
  ctx.clearRect(0, 0, w, h);

  const elapsed = (now - startTime) / 1000;
  const reveal = Math.min(1, elapsed / 3.8);

  for (const p of particles) {
    if (p.ambient) {
      const drift = Math.sin(elapsed * p.speed + p.phase) * 4;
      p.x = p.baseX + drift;
      p.y = p.baseY + Math.cos(elapsed * .6 + p.phase) * 3;
    } else {
      // Particles start scattered and settle into the heart.
      const scatter = (1 - reveal) * (35 + 95 * (0.5 + Math.random()));
      if (reveal < 1) {
        const ease = reveal * reveal * (3 - 2 * reveal);
        p.x = p.baseX + Math.cos(p.phase + elapsed * p.speed) * scatter * (1 - ease);
        p.y = p.baseY + Math.sin(p.phase + elapsed * p.speed) * scatter * (1 - ease);
      } else {
        const pulse = 1 + Math.sin(elapsed * 2.1 + p.phase) * .012;
        const w2 = w / 2;
        const h2 = h / 2 + 4;
        const bx = p.baseX - w2;
        const by = p.baseY - h2;
        p.x = w2 + bx * pulse;
        p.y = h2 + by * pulse;
      }
    }

    const flicker = p.alpha * (.65 + .35 * Math.sin(elapsed * p.speed + p.phase));
    ctx.fillStyle = `rgba(${p.color},${Math.max(.03, flicker)})`;
    ctx.shadowBlur = p.size > 1 ? 7 : 0;
    ctx.shadowColor = `rgba(${p.color},.7)`;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.shadowBlur = 0;

  if (reveal > .93 && !heartReady) {
    heartReady = true;
    message.classList.add("show");
  }

  animationId = requestAnimationFrame(draw);
}

function restart() {
  cancelAnimationFrame(animationId);
  startTime = performance.now();
  heartReady = false;
  message.classList.remove("show");
  success.hidden = true;
  createParticles();
  animationId = requestAnimationFrame(draw);
}

yesBtn.addEventListener("click", () => {
  success.hidden = false;
  success.scrollIntoView({ behavior: "smooth", block: "center" });
  yesBtn.textContent = "♡ FOREVER ♡";
});

againBtn.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
  setTimeout(restart, 450);
});

window.addEventListener("resize", resize);

resize();
animationId = requestAnimationFrame(draw);
