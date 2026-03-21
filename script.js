/* =============================================
   YESHDIP POUDEL — ULTRA PORTFOLIO v3
   script.js — Full rewrite with new features
   ============================================= */

// ─── 1. LOADING SCREEN ───
(function initLoader() {
  document.body.style.overflow = 'hidden';
  const canvas = document.getElementById('loader-matrix');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()><{}[]';
  const cols  = Math.floor(canvas.width / 16);
  const drops = Array(cols).fill(0);
  const mi = setInterval(() => {
    ctx.fillStyle = 'rgba(0,0,0,0.08)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#dc143c';
    ctx.font = '13px Share Tech Mono, monospace';
    drops.forEach((y, i) => {
      const c = chars[Math.floor(Math.random() * chars.length)];
      ctx.fillText(c, i * 16, y * 16);
      drops[i] = y * 16 > canvas.height && Math.random() > .975 ? 0 : drops[i] + 1;
    });
  }, 40);

  const fill = document.getElementById('loader-fill');
  const pct  = document.getElementById('loader-pct');
  const txt  = document.getElementById('loader-text');
  const msgs = ['BOOTING SYSTEM...', 'LOADING MODULES...', 'INJECTING PAYLOAD...', 'BYPASSING FIREWALL...', 'ACCESS GRANTED ✓'];
  let p = 0;
  const t = setInterval(() => {
    p = Math.min(p + Math.random() * 4, 100);
    if (fill) fill.style.width = p + '%';
    if (pct)  pct.textContent  = Math.floor(p) + '%';
    if (txt)  txt.textContent  = msgs[Math.min(Math.floor(p / 25), msgs.length - 1)];
    if (p >= 100) {
      clearInterval(t);
      clearInterval(mi);
      setTimeout(() => {
        document.getElementById('loader').classList.add('hidden');
        document.body.style.overflow = '';
        startCounters();
        animateSkillBars();
        initUptime();
        initInteractiveTerminal();
      }, 650);
    }
  }, 50);
})();

// ─── 2. CUSTOM CURSOR ───
const cursor = document.getElementById('cursor');
const trail  = document.getElementById('cursor-trail');
let mx = 0, my = 0, tx = 0, ty = 0;

document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
(function animCursor() {
  cursor.style.left = mx + 'px'; cursor.style.top = my + 'px';
  tx += (mx - tx) * 0.11; ty += (my - ty) * 0.11;
  trail.style.left = tx + 'px'; trail.style.top = ty + 'px';
  requestAnimationFrame(animCursor);
})();
document.addEventListener('mousedown', () => cursor.style.transform = 'translate(-50%,-50%) scale(0.5)');
document.addEventListener('mouseup',   () => cursor.style.transform = 'translate(-50%,-50%) scale(1)');
document.querySelectorAll('a,button,.pcard,.ach-card,.blog-card,.stk-item,.tl-card,.svc-card,.testi-card,.sdot').forEach(el => {
  el.addEventListener('mouseenter', () => { cursor.style.width = '26px'; cursor.style.height = '26px'; });
  el.addEventListener('mouseleave', () => { cursor.style.width = '12px'; cursor.style.height = '12px'; });
});

// ─── 3. PARTICLES ───
(function() {
  const c = document.getElementById('particles');
  const ctx = c.getContext('2d');
  let W, H, pts = [], mouse = { x: -9999, y: -9999 };
  function resize() { W = c.width = window.innerWidth; H = c.height = window.innerHeight; }
  class Pt {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * W; this.y = Math.random() * H;
      this.vx = (Math.random()-.5)*.4; this.vy = (Math.random()-.5)*.4;
      this.r = Math.random() * 1.3 + .4; this.o = Math.random() * .3 + .07;
    }
    update() {
      const dx = this.x-mouse.x, dy = this.y-mouse.y, d = Math.sqrt(dx*dx+dy*dy);
      if (d < 100) { this.vx += dx/d*.5; this.vy += dy/d*.5; }
      this.vx *= .98; this.vy *= .98;
      this.x += this.vx; this.y += this.vy;
      if (this.x<0||this.x>W||this.y<0||this.y>H) this.reset();
    }
    draw() { ctx.beginPath(); ctx.arc(this.x,this.y,this.r,0,Math.PI*2); ctx.fillStyle=`rgba(220,20,60,${this.o})`; ctx.fill(); }
  }
  function init() { pts=[]; const n=Math.min(120,Math.floor(W*H/12000)); for(let i=0;i<n;i++) pts.push(new Pt()); }
  function draw() {
    ctx.clearRect(0,0,W,H);
    for(let i=0;i<pts.length;i++) for(let j=i+1;j<pts.length;j++) {
      const dx=pts[i].x-pts[j].x, dy=pts[i].y-pts[j].y, d=Math.sqrt(dx*dx+dy*dy);
      if(d<120){ ctx.beginPath(); ctx.moveTo(pts[i].x,pts[i].y); ctx.lineTo(pts[j].x,pts[j].y); ctx.strokeStyle=`rgba(220,20,60,${.12*(1-d/120)})`; ctx.lineWidth=.5; ctx.stroke(); }
    }
    pts.forEach(p=>{p.update();p.draw();});
    requestAnimationFrame(draw);
  }
  document.addEventListener('mousemove', e=>{mouse.x=e.clientX;mouse.y=e.clientY;});
  window.addEventListener('resize',()=>{resize();init();});
  resize(); init(); draw();
})();

// ─── 4. SCROLL: progress + navbar + back-top + floating CTA + section dots ───
const navbar  = document.getElementById('navbar');
const backTop = document.getElementById('back-top');
const scrollB = document.getElementById('scroll-bar');
const hireCTA = document.getElementById('hire-cta');
const allSecs = ['hero','about','services','skills','stack','projects','timeline','ctf','github','blog','achievements','testimonials','uses','contact'];

window.addEventListener('scroll', () => {
  const s = window.scrollY, h = document.body.scrollHeight - window.innerHeight;
  scrollB.style.width = (s / h * 100) + '%';
  navbar.classList.toggle('scrolled', s > 50);
  backTop.classList.toggle('hidden', s < 400);
  // Floating hire CTA appears after scrolling past hero
  const heroH = document.getElementById('hero')?.offsetHeight || 600;
  hireCTA.classList.toggle('hidden', s < heroH * 0.6);
  updateNav();
  updateDots();
});

function updateNav() {
  let cur = 'hero';
  allSecs.forEach(id => { const el = document.getElementById(id); if(el && window.scrollY >= el.offsetTop - 100) cur = id; });
  document.querySelectorAll('.nav-links a').forEach(a => a.classList.toggle('active', a.getAttribute('href') === `#${cur}`));
}

function updateDots() {
  let cur = 'hero';
  allSecs.forEach(id => { const el = document.getElementById(id); if(el && window.scrollY >= el.offsetTop - 120) cur = id; });
  document.querySelectorAll('.sdot').forEach(d => d.classList.toggle('active', d.dataset.sec === cur));
}

// Dot nav click
document.querySelectorAll('.sdot').forEach(d => {
  d.addEventListener('click', () => { const el = document.getElementById(d.dataset.sec); if(el) el.scrollIntoView({behavior:'smooth',block:'start'}); });
});

// ─── 5. LIVE TIME ───
function updateTime() {
  const el = document.getElementById('live-time');
  if (!el) return;
  el.textContent = 'NPT ' + new Date().toLocaleTimeString('en-US', {hour12:false, timeZone:'Asia/Kathmandu'});
}
setInterval(updateTime, 1000); updateTime();

// ─── 6. HAMBURGER ───
const ham = document.getElementById('hamburger');
const mob = document.getElementById('mobile-menu');
let mobOpen = false;
ham.addEventListener('click', () => {
  mobOpen = !mobOpen;
  mob.classList.toggle('hidden', !mobOpen);
  const [s1,s2,s3] = ham.querySelectorAll('span');
  if(mobOpen){ s1.style.transform='rotate(45deg) translate(5px,5px)'; s2.style.opacity='0'; s3.style.transform='rotate(-45deg) translate(5px,-5px)'; }
  else { [s1,s2,s3].forEach(s=>{s.style.transform='';s.style.opacity='';}); }
});
window.closeMobile = () => {
  mobOpen = false; mob.classList.add('hidden');
  ham.querySelectorAll('span').forEach(s=>{s.style.transform='';s.style.opacity='';});
};

// ─── 7. TYPEWRITER ───
(function() {
  const el = document.getElementById('typewriter');
  if (!el) return;
  const roles = ['Ethical Hacker','Python Developer','AI Enthusiast','Bug Hunter','Game Developer','CTF Player','Problem Solver','Innovator from Nepal 🇳🇵'];
  let ri=0, ci=0, del=false;
  function type() {
    const r = roles[ri];
    if(!del){ el.textContent=r.slice(0,++ci); if(ci===r.length){del=true;return setTimeout(type,1800);} }
    else { el.textContent=r.slice(0,--ci); if(ci===0){del=false;ri=(ri+1)%roles.length;} }
    setTimeout(type, del ? 48 : 85);
  }
  setTimeout(type, 1400);
})();

// ─── 8. COUNTERS ───
function countUp(el, target) {
  let cur = 0;
  const step = Math.max(1, Math.ceil(target / 55));
  const t = setInterval(() => { cur = Math.min(cur+step, target); el.textContent = cur; if(cur>=target) clearInterval(t); }, 35);
}
function startCounters() {
  document.querySelectorAll('.hstat-n, .anum-v').forEach(el => countUp(el, parseInt(el.dataset.t || 0)));
}

// ─── 9. UPTIME ───
function initUptime() {
  const el = document.getElementById('uptime-line');
  if (!el) return;
  const d = Math.floor((new Date() - new Date('2022-01-01')) / 86400000);
  el.textContent = `${d} days of coding (and counting)`;
}

// ─── 10. REVEAL ON SCROLL ───
const revObs = new IntersectionObserver(e => { e.forEach(x => { if(x.isIntersecting) x.target.classList.add('vis'); }); }, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => revObs.observe(el));

// ─── 11. SKILL BARS ───
function animateSkillBars() {
  const obs = new IntersectionObserver(e => {
    e.forEach(x => { if(x.isIntersecting) x.target.querySelectorAll('.skb-fill').forEach(b => setTimeout(()=>b.style.width=b.dataset.width+'%', 200)); });
  }, { threshold: 0.2 });
  const sec = document.getElementById('skills');
  if(sec) obs.observe(sec);
}

// ─── 12. PROJECT FILTER ───
document.querySelectorAll('.fb').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.fb').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    const f = btn.dataset.f;
    document.querySelectorAll('.pcard').forEach(card => {
      const show = f==='all' || card.dataset.c===f;
      card.style.display = show ? '' : 'none';
      if(show){ card.style.animation='none'; void card.offsetWidth; card.style.animation='fade-up .4s ease forwards'; }
    });
  });
});

// ─── 13. 3D TILT ───
document.querySelectorAll('.tilt').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX-r.left)/r.width-.5, y = (e.clientY-r.top)/r.height-.5;
    card.style.transform = `translateY(-6px) perspective(800px) rotateX(${-y*8}deg) rotateY(${x*8}deg) scale(1.02)`;
  });
  card.addEventListener('mouseleave', () => card.style.transform = '');
});

// ─── 14. PROJECT MODALS ───
const modalData = {
  smartlearn:{ emoji:'📘', title:'Smart Learn', desc:'Smart Learn is an AI-powered career roadmap generator that analyzes a student\'s interests, skill level, and goals to build personalized step-by-step learning paths with curated resources, timelines, and progress tracking.', tech:['Python','Machine Learning','NLP','Flask','HTML/CSS'], link:'https://github.com/yeshdippoudel/Smart-Learn', features:['AI-generated personalized roadmaps','Skill gap analysis','Resource recommendations','Progress tracking dashboard'] },
  handcar:{ emoji:'🚗', title:'Hand Gesture Car', desc:'A real-time hand gesture controlled RC car using computer vision to detect hand positions via webcam and translate them into directional signals for an Arduino-powered car over serial communication.', tech:['Python','OpenCV','MediaPipe','Arduino','Serial Comm'], link:'https://github.com/yeshdippoudel/Hand-Gesture-Car', features:['Real-time gesture recognition','Arduino motor control','Low-latency serial comms','5 gesture directions'] },
  swordgame:{ emoji:'🎮', title:'Sword Game', desc:'An endless zombie runner game built from scratch with Pygame. Features dynamic difficulty scaling, sprite animations, collision detection, particle effects, and persistent high-score tracking via file I/O.', tech:['Python','Pygame','Sprite Animation','Physics'], link:'https://github.com/yeshdippoudel/Sword-Game', features:['Dynamic difficulty curve','Custom sprite sheets','Physics-based collision','Local high score persistence'] },
  godgpt:{ emoji:'🤖', title:'GodGPT', desc:'GodGPT is an all-in-one AI chatbot interface that unifies multiple language model APIs. Supports multi-turn conversations, code generation, creative writing, and conversation history export.', tech:['Python','NLP','REST APIs','HTML/CSS','JavaScript'], link:'https://github.com/yeshdippoudel/GodGPT', features:['Multi-model support','Conversation memory','Code generation mode','Export chat history'] },
  astroai:{ emoji:'🛰️', title:'AstroAI', desc:'AstroAI processes astronomical datasets from NASA, uses ML to classify celestial objects, and generates human-readable natural language insights about discovered phenomena.', tech:['Python','AI/ML','NumPy','Matplotlib','NASA API'], link:'https://github.com/yeshdippoudel/AstroAI', features:['NASA dataset integration','ML classification','Natural language insights','Sky visualizations'] }
};
window.openModal = function(id) {
  const d = modalData[id]; if(!d) return;
  document.getElementById('modal-body').innerHTML = `
    <div class="modal-em">${d.emoji}</div>
    <div class="modal-title">${d.title}</div>
    <p class="modal-desc">${d.desc}</p>
    <div class="modal-tech">${d.tech.map(t=>`<span>${t}</span>`).join('')}</div>
    <div class="modal-feat">
      <div class="modal-feat-title">// KEY FEATURES</div>
      <ul>${d.features.map(f=>`<li>${f}</li>`).join('')}</ul>
    </div>
    <div class="modal-links" style="margin-top:1.2rem">
      <a href="${d.link}" target="_blank" class="btn-primary">VIEW ON GITHUB →</a>
    </div>`;
  document.getElementById('modal-ov').classList.remove('hidden');
};
window.closeModal = () => document.getElementById('modal-ov').classList.add('hidden');

// ─── 15. COMMAND PALETTE ───
const navItems = [
  {id:'hero',title:'Home',n:'01'},{id:'about',title:'About Me',n:'02'},
  {id:'services',title:'Services',n:'03'},{id:'skills',title:'Skills',n:'04'},
  {id:'stack',title:'Tech Stack',n:'05'},{id:'projects',title:'Projects',n:'06'},
  {id:'timeline',title:'My Journey',n:'07'},{id:'ctf',title:'CTF & Security',n:'08'},
  {id:'github',title:'GitHub Stats',n:'09'},{id:'blog',title:'Blog',n:'10'},
  {id:'achievements',title:'Achievements',n:'11'},{id:'testimonials',title:'Testimonials',n:'12'},
  {id:'uses',title:'My Setup',n:'13'},{id:'contact',title:'Contact',n:'14'},
];
let cmdIdx = 0;
window.openCmd = () => {
  document.getElementById('cmd-overlay').classList.remove('hidden');
  document.getElementById('cmd-input').value='';
  document.getElementById('cmd-input').focus();
  cmdIdx=0; renderCmd(navItems);
};
window.closeCmd = () => document.getElementById('cmd-overlay').classList.add('hidden');

function renderCmd(items) {
  const ul = document.getElementById('cmd-list');
  ul.innerHTML = items.map((item,i)=>`<li class="cmd-item${i===0?' active':''}" data-id="${item.id}"><span class="cmd-k">${item.n}</span>${item.title}</li>`).join('');
  ul.querySelectorAll('.cmd-item').forEach(li=>li.addEventListener('click',()=>{navTo(li.dataset.id);closeCmd();}));
}
function setCmd(i) { cmdIdx=i; document.querySelectorAll('.cmd-item').forEach((el,idx)=>el.classList.toggle('active',idx===cmdIdx)); }
document.getElementById('cmd-input').addEventListener('input', e=>{
  const q=e.target.value.toLowerCase();
  const f=navItems.filter(s=>s.title.toLowerCase().includes(q)||s.id.includes(q)).map((s,i)=>({...s,n:String(i+1).padStart(2,'0')}));
  cmdIdx=0; renderCmd(f.length?f:navItems);
});
document.getElementById('cmd-input').addEventListener('keydown', e=>{
  const items=document.querySelectorAll('.cmd-item');
  if(e.key==='ArrowDown'){setCmd(Math.min(cmdIdx+1,items.length-1));e.preventDefault();}
  else if(e.key==='ArrowUp'){setCmd(Math.max(cmdIdx-1,0));e.preventDefault();}
  else if(e.key==='Enter'){const a=document.querySelector('.cmd-item.active');if(a){navTo(a.dataset.id);closeCmd();}}
});
document.getElementById('cmd-overlay').addEventListener('click',e=>{if(e.target===document.getElementById('cmd-overlay'))closeCmd();});
document.addEventListener('keydown',e=>{
  if((e.ctrlKey||e.metaKey)&&e.key==='k'){e.preventDefault();document.getElementById('cmd-overlay').classList.contains('hidden')?openCmd():closeCmd();}
  if(e.key==='Escape'){closeCmd();closeModal();}
});
function navTo(id){const el=document.getElementById(id);if(el)el.scrollIntoView({behavior:'smooth',block:'start'});}

// ─── 16. INTERACTIVE TERMINAL ───
function initInteractiveTerminal() {
  const input  = document.getElementById('term-input');
  const output = document.getElementById('term-output');
  if (!input || !output) return;

  const cmds = {
    help: () => [
      {t:'info',  v:'Available commands:'},
      {t:'info',  v:'  whoami    — who is Yeshdip'},
      {t:'info',  v:'  skills    — list skills'},
      {t:'info',  v:'  projects  — list projects'},
      {t:'info',  v:'  contact   — contact info'},
      {t:'info',  v:'  github    — GitHub profile'},
      {t:'info',  v:'  clear     — clear terminal'},
      {t:'info',  v:'  hack      — try your luck 😈'},
    ],
    whoami: () => [
      {t:'out', v:'Yeshdip Poudel'},
      {t:'out', v:'Ethical Hacker | Python Dev | AI Builder'},
      {t:'out', v:'Location: Kathmandu, Nepal 🇳🇵'},
      {t:'out', v:'Status: Building & Breaking Things 🔥'},
    ],
    skills: () => [
      {t:'out', v:'[■■■■■■■■■░] HTML/CSS      90%'},
      {t:'out', v:'[■■■■■■■■░░] Python        82%'},
      {t:'out', v:'[■■■■■■■■░░] Eth. Hacking  85%'},
      {t:'out', v:'[■■■■■■■░░░] Pentesting    78%'},
      {t:'out', v:'[■■■■■■■░░░] AI/ML         75%'},
      {t:'out', v:'[■■■■■■■░░░] Game Dev      70%'},
    ],
    projects: () => [
      {t:'out', v:'📘 Smart Learn    — AI career roadmap'},
      {t:'out', v:'🚗 Hand Gesture Car — CV + Arduino'},
      {t:'out', v:'🎮 Sword Game     — Pygame zombie runner'},
      {t:'out', v:'🤖 GodGPT         — AI chatbot'},
      {t:'out', v:'🛰️ AstroAI        — Space AI analyzer'},
    ],
    contact: () => [
      {t:'out', v:'📧 kripuyeshdip@gmail.com'},
      {t:'out', v:'💻 github.com/yeshdip'},
      {t:'out', v:'📷 @yeshdippoudel'},
    ],
    github: () => [
      {t:'out', v:'Opening GitHub...'},
    ],
    hack: () => [
      {t:'info', v:'[*] Initializing exploit...'},
      {t:'info', v:'[*] Scanning target... 127.0.0.1'},
      {t:'info', v:'[*] Port 80 open — HTTP detected'},
      {t:'err',  v:'[!] Access denied. Nice try 😈'},
      {t:'info', v:'[*] Tip: Try the Konami Code instead ;)'},
    ],
    clear: () => 'CLEAR',
    ls:     () => [{t:'out',v:'about.txt  skills/  projects/  contact.json  secret.enc'}],
    pwd:    () => [{t:'out',v:'/home/yeshdip/portfolio'}],
    date:   () => [{t:'out',v: new Date().toLocaleString()}],
    uname:  () => [{t:'out',v:'YeshdipOS v2.0 — Nepal Edition 🇳🇵'}],
    cat:    () => [{t:'err',v:'Usage: cat <filename>  (try: cat about.txt)'}],
    'cat about.txt': () => [
      {t:'out',v:'Name:     Yeshdip Poudel'},
      {t:'out',v:'Role:     Hacker & Developer'},
      {t:'out',v:'Location: Nepal 🇳🇵'},
      {t:'out',v:'Mission:  Innovate. Inspire. Impact.'},
    ],
  };

  function addLine(type, text) {
    const div = document.createElement('div');
    if(type === 'cmd') div.innerHTML = `<span class="tp">$</span> ${escHtml(text)}`;
    else if(type === 'out')  div.innerHTML = `<span class="to">${escHtml(text)}</span>`;
    else if(type === 'info') div.innerHTML = `<span class="t-info">${escHtml(text)}</span>`;
    else if(type === 'err')  div.innerHTML = `<span class="t-err">${escHtml(text)}</span>`;
    output.appendChild(div);
    output.scrollTop = output.scrollHeight;
  }

  function escHtml(s) { return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

  input.addEventListener('keydown', e => {
    if (e.key !== 'Enter') return;
    const val = input.value.trim().toLowerCase();
    input.value = '';
    if (!val) return;
    addLine('cmd', val);
    const fn = cmds[val];
    if (!fn) { addLine('err', `command not found: ${val}. Type 'help' for options.`); return; }
    const result = fn();
    if (result === 'CLEAR') { output.innerHTML = ''; return; }
    result.forEach(r => addLine(r.t, r.v));
    if (val === 'github') window.open('https://github.com/yeshdip', '_blank');
  });
}

// ─── 17. TOAST SYSTEM ───
window.showToast = function(msg, type='success', duration=3000) {
  const c = document.getElementById('toast-container');
  const t = document.createElement('div');
  t.className = `toast ${type}`;
  t.innerHTML = `<span class="toast-icon">${type==='success'?'✅':'❌'}</span><span>${msg}</span>`;
  c.appendChild(t);
  setTimeout(() => { t.classList.add('out'); setTimeout(()=>t.remove(), 350); }, duration);
};

// ─── 18. COPY EMAIL ───
window.copyEmail = function() {
  const email = 'kripuyeshdip@gmail.com';
  navigator.clipboard.writeText(email).then(() => {
    const hint = document.getElementById('copy-hint');
    if(hint){ hint.textContent = 'COPIED!'; setTimeout(()=>hint.textContent='COPY',2000); }
    showToast('Email copied to clipboard!', 'success');
  }).catch(() => showToast('Copy failed — email: kripuyeshdip@gmail.com', 'error'));
};

// ─── 19. DOWNLOAD CV ───
window.downloadCV = function() {
  const content = `YESHDIP POUDEL — CURRICULUM VITAE
================================
Location : Kathmandu, Nepal 🇳🇵
Email    : kripuyeshdip@gmail.com
GitHub   : github.com/yeshdip
Instagram: @yeshdippoudel

SKILLS
------
• HTML & CSS      — 90%
• Ethical Hacking — 85%
• Python          — 82%
• Pentesting      — 78%
• AI / ML         — 75%
• Bug Hunting     — 72%
• Game Dev        — 70%
• UI/UX Design    — 68%

PROJECTS
--------
• Smart Learn      — AI-powered career roadmap generator
• Hand Gesture Car — CV + Arduino RC car control
• Sword Game       — Pygame endless zombie runner
• GodGPT           — All-in-one AI chatbot
• AstroAI          — Space data AI analyzer

KEY ACHIEVEMENTS
----------------
• Winner — National School Coding Challenge 2024
• Best Collaboration — Nepal's 1st School AI Hackathon (2025)
• 2nd Place — Ethical Hacking Inter-School Contest 2024
• Best Project — Smart Tech School Expo 2023
• Finalist — Young Innovators Robotics Expo 2024
• DIGI Club Phase 1 & 2 Certificates

SECURITY PLATFORMS
------------------
• TryHackMe | HackTheBox | PicoCTF | Bugcrowd

Generated from: yeshdippoudel.github.io`;

  const blob = new Blob([content], {type:'text/plain'});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'Yeshdip_Poudel_CV.txt';
  a.click();
  showToast('CV downloaded!', 'success');
};

// ─── 20. BLOG SUBSCRIBE ───
window.subscribe = function() {
  const email = document.getElementById('sub-email').value.trim();
  const msg   = document.getElementById('sub-msg');
  if(!email || !email.includes('@')){ showToast('Please enter a valid email', 'error'); return; }
  document.getElementById('sub-email').value = '';
  msg.classList.remove('hidden');
  showToast('You\'re subscribed! 🎉', 'success');
  setTimeout(()=>msg.classList.add('hidden'), 5000);
};

// ─── 21. AI CHATBOT (Groq — FREE, no credit card) ───
//
// 🔑 STEP 1: Go to https://console.groq.com/keys
// 🔑 STEP 2: Sign up free → click "Create API Key"
// 🔑 STEP 3: Paste your key below replacing YOUR_GROQ_KEY_HERE
//
const GROQ_API_KEY = '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';
const GROQ_MODEL   = 'llama-3.1-8b-instant'; // free & fast — alternatives: gemma2-9b-it, mixtral-8x7b-32768

const chatCtx = `You are YP·BOT, the AI assistant on Yeshdip Poudel's portfolio website. Answer ONLY questions about Yeshdip. Keep answers SHORT and punchy (2-3 sentences max). Use a friendly, slightly hacker-ish tone. Never break character.

ABOUT YESHDIP:
- Student from Kathmandu, Nepal 🇳🇵
- Skills: Python, HTML/CSS, Ethical Hacking, Pentesting, Bug Hunting, AI/ML, Game Dev, UI/UX
- Projects: Smart Learn (AI career guide), Hand Gesture Car (CV+Arduino), Sword Game (Pygame), GodGPT (AI chatbot), AstroAI (NASA space AI)
- Security: Kali Linux, Wireshark, Nmap, Burp Suite, SQLMap | Active on TryHackMe & HackTheBox
- Wins: National School Coding Challenge 2024 winner, 2nd place Ethical Hacking Contest, Best Collaboration AI Hackathon Jan 2025, Best Project Expo 2023
- Contact: kripuyeshdip@gmail.com | GitHub: yeshdip | Instagram: yeshdippoudel
- Currently available for projects, collabs & internships. Goal: Innovate, inspire, impact.`;

// Keep conversation history for multi-turn context
const chatHistory = [];

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

  // Remove quick-reply buttons once used
  document.querySelector('.cb-quick')?.remove();

  // Show user message
  const um = document.createElement('div');
  um.className = 'cb-msg user-m';
  um.textContent = text;
  msgs.appendChild(um);

  // Typing indicator
  const tm = document.createElement('div');
  tm.className = 'cb-msg typing-m';
  tm.innerHTML = '<span class="cb-from">YP·BOT</span><span class="dot-anim">●  ●  ●</span>';
  msgs.appendChild(tm);
  msgs.scrollTop = msgs.scrollHeight;

  // Add to history
  chatHistory.push({ role: 'user', content: text });

  // Key not set — show friendly guide
  if (!GROQ_API_KEY || GROQ_API_KEY === 'YOUR_GROQ_KEY_HERE') {
    tm.remove();
    const bm = document.createElement('div');
    bm.className = 'cb-msg bot-m';
    bm.innerHTML = `<span class="cb-from">YP·BOT</span>⚠️ API key not set yet! Open <code>script.js</code>, find <code>GROQ_API_KEY</code> and paste your free Groq key. Get one free at <a href="https://console.groq.com/keys" target="_blank" style="color:var(--red)">console.groq.com/keys</a> 🔑`;
    msgs.appendChild(bm);
    msgs.scrollTop = msgs.scrollHeight;
    return;
  }

  try {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        max_tokens: 180,
        temperature: 0.75,
        messages: [
          { role: 'system', content: chatCtx },
          ...chatHistory.slice(-8) // keep last 8 turns for context
        ]
      })
    });

    const data = await res.json();

    if (data.error) throw new Error(data.error.message);

    const reply = data.choices?.[0]?.message?.content?.trim()
      || 'Hmm, got no response. Try again!';

    // Add bot reply to history
    chatHistory.push({ role: 'assistant', content: reply });

    tm.remove();
    const bm = document.createElement('div');
    bm.className = 'cb-msg bot-m';
    bm.innerHTML = `<span class="cb-from">YP·BOT <span style="opacity:.4;font-size:.5rem">(llama-3.1)</span></span>${reply}`;
    msgs.appendChild(bm);

  } catch (err) {
    tm.remove();
    const bm = document.createElement('div');
    bm.className = 'cb-msg bot-m';
    const isKeyErr = err.message?.toLowerCase().includes('auth') || err.message?.toLowerCase().includes('api');
    bm.innerHTML = `<span class="cb-from">YP·BOT</span>${
      isKeyErr
        ? '❌ API key error — double-check your Groq key in script.js!'
        : '📡 Connection lost. Email me at kripuyeshdip@gmail.com!'
    }`;
    msgs.appendChild(bm);
  }

  msgs.scrollTop = msgs.scrollHeight;
};

document.getElementById('cb-input').addEventListener('keydown', e => {
  if (e.key === 'Enter') sendChat();
});

// ─── 22. MUSIC PLAYER (Web Audio) ───
let actx=null, aplay=false, again=null;
window.toggleMusic = function() {
  const btn=document.getElementById('music-btn'), bars=document.getElementById('music-bars');
  if(!actx){
    actx=new(window.AudioContext||window.webkitAudioContext)();
    again=actx.createGain(); again.gain.value=0.035; again.connect(actx.destination);
    [40,60,80,120,160,200].forEach(f=>{const o=actx.createOscillator();o.type='sine';o.frequency.value=f;o.connect(again);o.start();});
    aplay=true;
  } else {
    aplay=!aplay;
    again.gain.setTargetAtTime(aplay?.035:0,actx.currentTime,.5);
  }
  btn.textContent=aplay?'🔊':'🎵';
  bars.classList.toggle('hidden',!aplay);
};

// ─── 23. MATRIX EASTER EGG ───
let mxActive=false, mxInt=null;
function activateMatrix(){
  if(mxActive) return; mxActive=true;
  const cv=document.getElementById('matrix-rain'), ctx=cv.getContext('2d');
  cv.width=window.innerWidth; cv.height=window.innerHeight; cv.classList.remove('hidden');
  const chars='アイウエオカキYESHDIPPOUDEL0123456789@#$%';
  const cols=Math.floor(cv.width/16), drops=Array(cols).fill(0);
  mxInt=setInterval(()=>{
    ctx.fillStyle='rgba(0,0,0,0.05)'; ctx.fillRect(0,0,cv.width,cv.height);
    ctx.fillStyle='#dc143c'; ctx.font='14px Share Tech Mono,monospace';
    drops.forEach((y,i)=>{ctx.fillText(chars[Math.floor(Math.random()*chars.length)],i*16,y*16);drops[i]=(y*16>cv.height&&Math.random()>.975)?0:drops[i]+1;});
  },33);
  setTimeout(()=>{clearInterval(mxInt);cv.classList.add('hidden');mxActive=false;},8000);
}

// ─── 24. KONAMI CODE ───
const konami=['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
let ki=0;
document.addEventListener('keydown',e=>{
  if(e.key===konami[ki]){ki++;if(ki===konami.length){ki=0;document.getElementById('easter-ov').classList.remove('hidden');activateMatrix();showToast('Konami Code activated! 🎮','success');}}
  else ki=0;
});
window.closeEaster = () => document.getElementById('easter-ov').classList.add('hidden');
