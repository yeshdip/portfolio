/* =============================================
   YESHDIP POUDEL — ULTRA PORTFOLIO v2
   script.js
   ============================================= */

// ─── 1. LOADING SCREEN w/ MATRIX ───
(function initLoader() {
  document.body.style.overflow = 'hidden';
  const canvas = document.getElementById('loader-matrix');
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()';
  const cols = Math.floor(canvas.width / 16);
  const drops = Array(cols).fill(0);
  let frame = 0;

  const matrixInterval = setInterval(() => {
    ctx.fillStyle = 'rgba(0,0,0,0.07)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#dc143c';
    ctx.font = '13px Share Tech Mono, monospace';
    drops.forEach((y, i) => {
      const char = chars[Math.floor(Math.random() * chars.length)];
      ctx.fillText(char, i * 16, y * 16);
      drops[i] = (y * 16 > canvas.height && Math.random() > 0.975) ? 0 : drops[i] + 1;
    });
    frame++;
  }, 40);

  const fill = document.getElementById('loader-fill');
  const pct  = document.getElementById('loader-pct');
  const txt  = document.getElementById('loader-text');
  const msgs = ['BOOTING SYSTEM...', 'LOADING MODULES...', 'INJECTING PAYLOAD...', 'BYPASSING FIREWALL...', 'ACCESS GRANTED ✓'];
  let progress = 0;
  const timer = setInterval(() => {
    progress = Math.min(progress + Math.random() * 3.5, 100);
    fill.style.width = progress + '%';
    pct.textContent = Math.floor(progress) + '%';
    txt.textContent = msgs[Math.min(Math.floor(progress / 25), msgs.length - 1)];
    if (progress >= 100) {
      clearInterval(timer);
      clearInterval(matrixInterval);
      setTimeout(() => {
        document.getElementById('loader').classList.add('hidden');
        document.body.style.overflow = '';
        runOnLoad();
      }, 600);
    }
  }, 50);
})();

function runOnLoad() {
  startCounters();
  animateSkillBars();
  initUptime();
}

// ─── 2. CUSTOM CURSOR ───
const cursor = document.getElementById('cursor');
const trail  = document.getElementById('cursor-trail');
let mx = 0, my = 0, tx = 0, ty = 0;

document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

function updateCursor() {
  cursor.style.left = mx + 'px';
  cursor.style.top  = my + 'px';
  tx += (mx - tx) * 0.12;
  ty += (my - ty) * 0.12;
  trail.style.left = tx + 'px';
  trail.style.top  = ty + 'px';
  requestAnimationFrame(updateCursor);
}
updateCursor();

document.addEventListener('mousedown', () => cursor.style.transform = 'translate(-50%,-50%) scale(0.5)');
document.addEventListener('mouseup',   () => cursor.style.transform = 'translate(-50%,-50%) scale(1)');
document.querySelectorAll('a,button,.pcard,.ach-card,.blog-card,.stk-item,.tl-card').forEach(el => {
  el.addEventListener('mouseenter', () => { cursor.style.width = '28px'; cursor.style.height = '28px'; });
  el.addEventListener('mouseleave', () => { cursor.style.width = '14px'; cursor.style.height = '14px'; });
});

// ─── 3. PARTICLE SYSTEM ───
(function() {
  const c = document.getElementById('particles');
  const ctx = c.getContext('2d');
  let W, H, pts = [], mouse = { x: -9999, y: -9999 };

  function resize() { W = c.width = window.innerWidth; H = c.height = window.innerHeight; }

  class Pt {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * W; this.y = Math.random() * H;
      this.vx = (Math.random() - .5) * .45; this.vy = (Math.random() - .5) * .45;
      this.r = Math.random() * 1.4 + .4; this.o = Math.random() * .35 + .08;
    }
    update() {
      const dx = this.x - mouse.x, dy = this.y - mouse.y;
      const d = Math.sqrt(dx*dx + dy*dy);
      if (d < 110) { this.vx += dx/d * .6; this.vy += dy/d * .6; }
      this.vx *= .98; this.vy *= .98;
      this.x += this.vx; this.y += this.vy;
      if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
    }
    draw() {
      ctx.beginPath(); ctx.arc(this.x, this.y, this.r, 0, Math.PI*2);
      ctx.fillStyle = `rgba(220,20,60,${this.o})`; ctx.fill();
    }
  }

  function init() {
    pts = [];
    const n = Math.min(130, Math.floor(W * H / 10000));
    for (let i = 0; i < n; i++) pts.push(new Pt());
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
        const d = Math.sqrt(dx*dx + dy*dy);
        if (d < 130) {
          ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y);
          ctx.strokeStyle = `rgba(220,20,60,${.14*(1-d/130)})`; ctx.lineWidth = .5; ctx.stroke();
        }
      }
    }
    pts.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(draw);
  }

  document.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });
  window.addEventListener('resize', () => { resize(); init(); });
  resize(); init(); draw();
})();

// ─── 4. SCROLL PROGRESS + NAVBAR + BACK TO TOP ───
const navbar  = document.getElementById('navbar');
const backTop = document.getElementById('back-top');
const scrollB = document.getElementById('scroll-bar');

window.addEventListener('scroll', () => {
  const s = window.scrollY, h = document.body.scrollHeight - window.innerHeight;
  scrollB.style.width = (s / h * 100) + '%';
  navbar.classList.toggle('scrolled', s > 50);
  backTop.classList.toggle('hidden', s < 400);
  updateActiveNav();
});

// ─── 5. LIVE TIME ───
function updateTime() {
  const el = document.getElementById('live-time');
  if (!el) return;
  const now = new Date();
  const t = now.toLocaleTimeString('en-US', { hour12: false, timeZone: 'Asia/Kathmandu' });
  el.textContent = `NPT ${t}`;
}
setInterval(updateTime, 1000);
updateTime();

// ─── 6. HAMBURGER ───
const ham = document.getElementById('hamburger');
const mobMenu = document.getElementById('mobile-menu');
let mobOpen = false;

ham.addEventListener('click', () => {
  mobOpen = !mobOpen;
  mobMenu.classList.toggle('hidden', !mobOpen);
  const [s1, s2, s3] = ham.querySelectorAll('span');
  if (mobOpen) {
    s1.style.transform = 'rotate(45deg) translate(5px,5px)';
    s2.style.opacity = '0';
    s3.style.transform = 'rotate(-45deg) translate(5px,-5px)';
  } else {
    [s1, s2, s3].forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  }
});
window.closeMobile = function() {
  mobOpen = false;
  mobMenu.classList.add('hidden');
  ham.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
};

// ─── 7. TYPEWRITER ───
(function() {
  const el = document.getElementById('typewriter');
  if (!el) return;
  const roles = ['Ethical Hacker', 'Python Developer', 'AI Enthusiast', 'Bug Hunter', 'Game Developer', 'Problem Solver', 'CTF Player', 'Innovator from Nepal'];
  let ri = 0, ci = 0, del = false;
  function type() {
    const r = roles[ri];
    if (!del) { el.textContent = r.slice(0, ++ci); if (ci === r.length) { del = true; return setTimeout(type, 1800); } }
    else { el.textContent = r.slice(0, --ci); if (ci === 0) { del = false; ri = (ri+1) % roles.length; } }
    setTimeout(type, del ? 48 : 85);
  }
  setTimeout(type, 1200);
})();

// ─── 8. COUNTERS ───
function countUp(el, target, suffix) {
  let cur = 0;
  const step = Math.max(1, Math.ceil(target / 50));
  const t = setInterval(() => {
    cur = Math.min(cur + step, target);
    el.textContent = cur;
    if (cur >= target) { clearInterval(t); el.textContent = cur; }
  }, 35);
}
function startCounters() {
  document.querySelectorAll('.hstat-n, .anum-v').forEach(el => {
    countUp(el, parseInt(el.dataset.t || el.dataset.target || 0));
  });
}

// ─── 9. UPTIME ───
function initUptime() {
  const el = document.getElementById('uptime-line');
  if (!el) return;
  const start = new Date('2022-01-01');
  const diff = new Date() - start;
  const days = Math.floor(diff / 86400000);
  el.textContent = `${days} days of coding (and counting)`;
}

// ─── 10. SCROLL REVEAL ───
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('vis'); }
  });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

// ─── 11. SKILL BARS ───
function animateSkillBars() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.querySelectorAll('.skb-fill').forEach(bar => {
          setTimeout(() => bar.style.width = bar.dataset.width + '%', 200);
        });
      }
    });
  }, { threshold: 0.2 });
  document.querySelectorAll('#skills').forEach(el => obs.observe(el));
}

// ─── 12. PROJECT FILTER ───
document.querySelectorAll('.fb').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.fb').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const f = btn.dataset.f;
    document.querySelectorAll('.pcard').forEach(card => {
      const show = f === 'all' || card.dataset.c === f;
      if (show) {
        card.style.display = '';
        card.style.animation = 'none';
        void card.offsetWidth;
        card.style.animation = 'fade-up .4s ease forwards';
      } else {
        card.style.display = 'none';
      }
    });
  });
});

// ─── 13. 3D TILT ───
document.querySelectorAll('.tilt').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width  - 0.5;
    const y = (e.clientY - rect.top)  / rect.height - 0.5;
    card.style.transform = `translateY(-8px) perspective(800px) rotateX(${-y*10}deg) rotateY(${x*10}deg) scale(1.02)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

// ─── 14. PROJECT MODALS ───
const modalData = {
  smartlearn: {
    emoji: '📘', title: 'Smart Learn',
    desc: 'Smart Learn is an AI-powered career roadmap generator that analyzes a student\'s interests, skill level, and goals to build personalized step-by-step learning paths with curated resources, timelines, and progress tracking.',
    tech: ['Python', 'Machine Learning', 'NLP', 'Flask', 'HTML/CSS'],
    link: 'https://github.com/yeshdippoudel/Smart-Learn',
    features: ['AI-generated personalized roadmaps', 'Skill gap analysis', 'Resource recommendations', 'Progress tracking dashboard']
  },
  handcar: {
    emoji: '🚗', title: 'Hand Gesture Car',
    desc: 'A real-time hand gesture controlled RC car that uses computer vision to detect hand positions via webcam and translates them into directional signals for an Arduino-powered car over serial communication.',
    tech: ['Python', 'OpenCV', 'MediaPipe', 'Arduino', 'Serial Comm'],
    link: 'https://github.com/yeshdippoudel/Hand-Gesture-Car',
    features: ['Real-time gesture recognition', 'Arduino motor control', 'Low-latency serial comms', '5 gesture directions supported']
  },
  swordgame: {
    emoji: '🎮', title: 'Sword Game',
    desc: 'An endless zombie runner game built entirely from scratch with Pygame. Features dynamic difficulty scaling, sprite animations, collision detection, particle effects, and persistent high-score tracking via file I/O.',
    tech: ['Python', 'Pygame', 'Sprite Animation', 'Game Physics'],
    link: 'https://github.com/yeshdippoudel/Sword-Game',
    features: ['Dynamic difficulty curve', 'Custom sprite sheets', 'Physics-based collision', 'Local high score persistence']
  },
  godgpt: {
    emoji: '🤖', title: 'GodGPT',
    desc: 'GodGPT is an all-in-one AI chatbot interface that unifies multiple language model APIs into a single sleek UI. Supports multi-turn conversations, code generation, creative writing, and conversation history export.',
    tech: ['Python', 'NLP', 'REST APIs', 'HTML/CSS', 'JavaScript'],
    link: 'https://github.com/yeshdippoudel/GodGPT',
    features: ['Multi-model support', 'Conversation memory', 'Code generation mode', 'Export chat history']
  },
  astroai: {
    emoji: '🛰️', title: 'AstroAI',
    desc: 'AstroAI processes astronomical datasets from NASA and other open sources, uses ML classification to identify celestial objects, and generates human-readable natural language insights about discovered phenomena.',
    tech: ['Python', 'AI/ML', 'NumPy', 'Matplotlib', 'NASA API'],
    link: 'https://github.com/yeshdippoudel/AstroAI',
    features: ['NASA dataset integration', 'ML object classification', 'Natural language insights', 'Interactive sky visualizations']
  }
};

window.openModal = function(id) {
  const d = modalData[id];
  if (!d) return;
  document.getElementById('modal-body').innerHTML = `
    <div class="modal-em">${d.emoji}</div>
    <div class="modal-title">${d.title}</div>
    <p class="modal-desc">${d.desc}</p>
    <div class="modal-tech">${d.tech.map(t => `<span>${t}</span>`).join('')}</div>
    <div class="modal-feat">
      <div class="modal-feat-title">// KEY FEATURES</div>
      <ul>${d.features.map(f => `<li>${f}</li>`).join('')}</ul>
    </div>
    <div class="modal-links" style="margin-top:1.2rem">
      <a href="${d.link}" target="_blank" class="btn-primary">VIEW ON GITHUB →</a>
    </div>`;
  document.getElementById('modal-ov').classList.remove('hidden');
};
window.closeModal = function() { document.getElementById('modal-ov').classList.add('hidden'); };
window.closeModalOut = function(e) { if (e.target === document.getElementById('modal-ov')) closeModal(); };

// ─── 15. COMMAND PALETTE ───
const navSections = [
  {id:'hero',       label:'Home',           num:'01'},
  {id:'about',      label:'About Me',       num:'02'},
  {id:'skills',     label:'Skills',         num:'03'},
  {id:'stack',      label:'Tech Stack',     num:'04'},
  {id:'projects',   label:'Projects',       num:'05'},
  {id:'timeline',   label:'My Journey',     num:'06'},
  {id:'ctf',        label:'CTF & Security', num:'07'},
  {id:'blog',       label:'Blog',           num:'08'},
  {id:'achievements',label:'Achievements', num:'09'},
  {id:'uses',       label:'My Setup',       num:'10'},
  {id:'contact',    label:'Contact',        num:'11'},
];
let cmdIdx = 0;

window.openCmd = function() {
  const ov = document.getElementById('cmd-overlay');
  ov.classList.remove('hidden');
  document.getElementById('cmd-input').value = '';
  document.getElementById('cmd-input').focus();
  cmdIdx = 0;
  renderCmd(navSections);
};
window.closeCmd = function() { document.getElementById('cmd-overlay').classList.add('hidden'); };

function renderCmd(items) {
  const ul = document.getElementById('cmd-list');
  ul.innerHTML = items.map((item, i) => `
    <li class="cmd-item${i === 0 ? ' active' : ''}" data-id="${item.id}">
      <span class="cmd-k">${item.num}</span>${item.label}
    </li>`).join('');
  ul.querySelectorAll('.cmd-item').forEach(li => {
    li.addEventListener('click', () => { navTo(li.dataset.id); closeCmd(); });
  });
}
function setCmd(i) {
  cmdIdx = i;
  document.querySelectorAll('.cmd-item').forEach((el, idx) => el.classList.toggle('active', idx === cmdIdx));
}

document.getElementById('cmd-input').addEventListener('input', e => {
  const q = e.target.value.toLowerCase();
  const filt = navSections.filter(s => s.label.toLowerCase().includes(q) || s.id.includes(q)).map((s, i) => ({ ...s, num: String(i+1).padStart(2,'0') }));
  cmdIdx = 0;
  renderCmd(filt.length ? filt : navSections);
});

document.getElementById('cmd-input').addEventListener('keydown', e => {
  const items = document.querySelectorAll('.cmd-item');
  if (e.key === 'ArrowDown') { setCmd(Math.min(cmdIdx+1, items.length-1)); e.preventDefault(); }
  else if (e.key === 'ArrowUp') { setCmd(Math.max(cmdIdx-1, 0)); e.preventDefault(); }
  else if (e.key === 'Enter') {
    const active = document.querySelector('.cmd-item.active');
    if (active) { navTo(active.dataset.id); closeCmd(); }
  }
});

document.getElementById('cmd-overlay').addEventListener('click', e => {
  if (e.target === document.getElementById('cmd-overlay')) closeCmd();
});

document.addEventListener('keydown', e => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') { e.preventDefault(); document.getElementById('cmd-overlay').classList.contains('hidden') ? openCmd() : closeCmd(); }
  if (e.key === 'Escape') { closeCmd(); closeModal(); }
});

function navTo(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ─── 16. ACTIVE NAV ON SCROLL ───
const allSectionIds = ['hero','about','skills','stack','projects','timeline','ctf','blog','achievements','uses','contact'];

function updateActiveNav() {
  let cur = 'hero';
  allSectionIds.forEach(id => {
    const el = document.getElementById(id);
    if (el && window.scrollY >= el.offsetTop - 100) cur = id;
  });
  document.querySelectorAll('.nav-links a').forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === `#${cur}`);
  });
}

// ─── 17. AI CHATBOT ───
const chatCtx = `You are the AI assistant on Yeshdip Poudel's portfolio website. Answer ONLY questions about Yeshdip. Keep answers SHORT and punchy (2-3 sentences). Speak in a futuristic, slightly hacker-like tone. Never break character.

ABOUT YESHDIP:
- Student from Kathmandu, Nepal passionate about tech
- Skills: Python, HTML/CSS, Ethical Hacking, Pentesting, Bug Hunting, AI/ML, Game Dev, UI/UX
- Projects: Smart Learn (AI career guide), Hand Gesture Car (CV+Arduino), Sword Game (Pygame), GodGPT (AI chatbot), AstroAI (space AI)
- Security tools: Kali Linux, Wireshark, Nmap, Burp Suite, SQLMap
- Active on: TryHackMe, HackTheBox, PicoCTF, Bugcrowd
- Achievements: National School Coding Challenge 2024 winner, 2nd place Ethical Hacking contest, Best Collaboration AI Hackathon, Best Project Expo 2023
- Contact: kripuyeshdip@gmail.com | GitHub: yeshdip | Instagram: yeshdippoudel
- Goal: Innovate, inspire, make an impact in the digital world
- Currently available for projects, collaborations, and internships`;

window.quickAsk = function(q) {
  document.getElementById('cb-input').value = q;
  sendChat();
};

window.sendChat = async function() {
  const input = document.getElementById('cb-input');
  const msgs  = document.getElementById('cb-msgs');
  const text  = input.value.trim();
  if (!text) return;
  input.value = '';

  // Remove quick buttons
  const quick = msgs.querySelector('.cb-quick');
  if (quick) quick.remove();

  // User message
  const userDiv = document.createElement('div');
  userDiv.className = 'cb-msg user-m';
  userDiv.textContent = text;
  msgs.appendChild(userDiv);

  // Typing indicator
  const typingDiv = document.createElement('div');
  typingDiv.className = 'cb-msg typing-m';
  typingDiv.innerHTML = '<span class="cb-from">YP·BOT</span>typing...';
  msgs.appendChild(typingDiv);
  msgs.scrollTop = msgs.scrollHeight;

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        system: chatCtx,
        messages: [{ role: 'user', content: text }]
      })
    });
    const data = await res.json();
    const reply = data.content?.[0]?.text || "System glitch. Try emailing kripuyeshdip@gmail.com!";
    typingDiv.remove();
    const botDiv = document.createElement('div');
    botDiv.className = 'cb-msg bot-m';
    botDiv.innerHTML = `<span class="cb-from">YP·BOT</span>${reply}`;
    msgs.appendChild(botDiv);
  } catch {
    typingDiv.remove();
    const botDiv = document.createElement('div');
    botDiv.className = 'cb-msg bot-m';
    botDiv.innerHTML = `<span class="cb-from">YP·BOT</span>Connection lost. Reach out directly at kripuyeshdip@gmail.com 📧`;
    msgs.appendChild(botDiv);
  }
  msgs.scrollTop = msgs.scrollHeight;
};

document.getElementById('cb-input').addEventListener('keydown', e => { if (e.key === 'Enter') sendChat(); });

// ─── 18. BLOG SUBSCRIBE ───
window.subscribe = function() {
  const email = document.getElementById('sub-email').value.trim();
  const msg   = document.getElementById('sub-msg');
  if (!email || !email.includes('@')) return;
  document.getElementById('sub-email').value = '';
  msg.classList.remove('hidden');
  setTimeout(() => msg.classList.add('hidden'), 4000);
};

// ─── 19. MUSIC PLAYER (Web Audio API ambient) ───
let audioCtx = null, playing = false, gainNode = null, oscNodes = [];

window.toggleMusic = function() {
  const btn = document.getElementById('music-btn');
  const bars = document.getElementById('music-bars');
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    gainNode = audioCtx.createGain();
    gainNode.gain.setValueAtTime(0.04, audioCtx.currentTime);
    gainNode.connect(audioCtx.destination);
    const freqs = [40, 60, 80, 120, 160, 220];
    freqs.forEach(f => {
      const o = audioCtx.createOscillator();
      o.type = 'sine'; o.frequency.setValueAtTime(f, audioCtx.currentTime);
      o.connect(gainNode); o.start();
      oscNodes.push(o);
    });
    playing = true;
  } else {
    if (playing) { gainNode.gain.setTargetAtTime(0, audioCtx.currentTime, .5); playing = false; }
    else { gainNode.gain.setTargetAtTime(0.04, audioCtx.currentTime, .5); playing = true; }
  }
  btn.textContent = playing ? '🔊' : '🎵';
  bars.classList.toggle('hidden', !playing);
};

// ─── 20. MATRIX RAIN EASTER EGG ───
let matrixActive = false;
let matrixInterval2 = null;

function activateMatrix() {
  if (matrixActive) return;
  matrixActive = true;
  const canvas = document.getElementById('matrix-rain');
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  canvas.classList.remove('hidden');
  const cols = Math.floor(canvas.width / 16);
  const drops = Array(cols).fill(0);
  const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%';
  matrixInterval2 = setInterval(() => {
    ctx.fillStyle = 'rgba(0,0,0,0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#dc143c'; ctx.font = '14px Share Tech Mono, monospace';
    drops.forEach((y, i) => {
      ctx.fillText(chars[Math.floor(Math.random()*chars.length)], i*16, y*16);
      drops[i] = (y*16 > canvas.height && Math.random() > .975) ? 0 : drops[i]+1;
    });
  }, 33);
  setTimeout(() => {
    clearInterval(matrixInterval2);
    canvas.classList.add('hidden');
    matrixActive = false;
  }, 8000);
}

// ─── 21. KONAMI CODE EASTER EGG ───
const konami = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
let kIdx = 0;
document.addEventListener('keydown', e => {
  if (e.key === konami[kIdx]) {
    kIdx++;
    if (kIdx === konami.length) {
      kIdx = 0;
      document.getElementById('easter-ov').classList.remove('hidden');
      activateMatrix();
    }
  } else { kIdx = 0; }
});
window.closeEaster = function() { document.getElementById('easter-ov').classList.add('hidden'); };