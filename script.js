/**
 * VANUJA VINNATH — PORTFOLIO SCRIPT
 * Handles: preloader, canvas particles, cursor, navbar,
 * typed text, scroll reveals, skill bars, counters,
 * skill filter, chat widget, contact form
 */

/* ── Preloader ── */
(function initPreloader() {
  const preloader = document.getElementById('preloader');
  const text      = document.getElementById('preloader-text');
  const fill      = document.getElementById('preloader-fill');
  const msgs      = ['initializing...', 'loading assets...', 'warming up AI...', 'ready.'];
  let mIdx = 0, cIdx = 0, prog = 0;
  let interval;

  function typeMsg() {
    if (!msgs[mIdx]) return;
    if (cIdx <= msgs[mIdx].length) {
      text.textContent = msgs[mIdx].slice(0, cIdx);
      cIdx++;
    } else {
      clearInterval(interval);
      setTimeout(() => {
        cIdx = 0;
        mIdx++;
        if (mIdx < msgs.length) interval = setInterval(typeMsg, 60);
      }, 400);
    }
  }

  interval = setInterval(typeMsg, 60);

  const fillInterval = setInterval(() => {
    prog += 2;
    fill.style.width = prog + '%';
    if (prog >= 100) {
      clearInterval(fillInterval);
      setTimeout(() => {
        preloader.classList.add('hidden');
        // Trigger hero reveals after preloader
        document.querySelectorAll('#hero .reveal-up, #hero .reveal-right').forEach((el, i) => {
          setTimeout(() => el.classList.add('visible'), 150 + i * 120);
        });
      }, 300);
    }
  }, 20);
})();

/* ── Canvas Particle Background ── */
(function initCanvas() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles = [], animId;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function mkParticle() {
    return {
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.5 + 0.3,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      a: Math.random() * 0.5 + 0.1,
      hue: Math.random() > 0.5 ? 250 : 200
    };
  }

  function init() {
    resize();
    particles = Array.from({ length: 80 }, mkParticle);
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    for (const p of particles) {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${p.hue}, 80%, 70%, ${p.a})`;
      ctx.fill();
    }

    // Draw connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(99,102,241,${0.06 * (1 - dist / 100)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
    animId = requestAnimationFrame(draw);
  }

  init();
  draw();
  window.addEventListener('resize', () => { resize(); });
})();

/* ── Custom Cursor ── */
(function initCursor() {
  const dot  = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  if (!dot || !ring) return;

  let mx = -100, my = -100, rx = -100, ry = -100;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.left  = mx + 'px';
    dot.style.top   = my + 'px';
  });

  // Smooth ring follow
  (function animRing() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(animRing);
  })();

  // Hover state
  document.querySelectorAll('a, button, .skill-card, .project-card, .glass-card').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('hovering'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('hovering'));
  });
})();

/* ── Scroll Progress ── */
(function initScrollProgress() {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100;
    bar.style.width = pct + '%';
  }, { passive: true });
})();

/* ── Navbar ── */
(function initNavbar() {
  const nav  = document.getElementById('navbar');
  const ham  = document.getElementById('nav-hamburger');
  const menu = document.getElementById('mobile-menu');
  if (!nav) return;

  // Scroll effect
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });

  // Hamburger
  if (ham && menu) {
    ham.addEventListener('click', () => {
      const open = ham.classList.toggle('open');
      menu.classList.toggle('open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });
    menu.querySelectorAll('.mobile-link').forEach(link => {
      link.addEventListener('click', () => {
        ham.classList.remove('open');
        menu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // Active section tracking
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link[data-section]');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        navLinks.forEach(l => l.classList.toggle('active', l.dataset.section === e.target.id));
      }
    });
  }, { threshold: 0.35 });

  sections.forEach(s => observer.observe(s));
})();

/* ── Theme Toggle ── */
(function initTheme() {
  const btn = document.getElementById('theme-toggle');
  if (!btn) return;
  const stored = localStorage.getItem('portfolio-theme');
  if (stored) document.documentElement.setAttribute('data-theme', stored);

  btn.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('portfolio-theme', next);
  });
})();

/* ── Typed Text ── */
(function initTyped() {
  const el = document.getElementById('typed-role');
  if (!el) return;

  const roles = [
    'AI/ML Enthusiast',
    'Data Science Student',
    'Full Stack Engineer',
    'Mobile App Developer',
    'Data Analyst'
  ];
  let rIdx = 0, cIdx = 0, deleting = false;

  function tick() {
    const role = roles[rIdx];
    if (!deleting) {
      el.textContent = role.slice(0, ++cIdx);
      if (cIdx === role.length) { deleting = true; setTimeout(tick, 2000); return; }
    } else {
      el.textContent = role.slice(0, --cIdx);
      if (cIdx === 0) { deleting = false; rIdx = (rIdx + 1) % roles.length; }
    }
    setTimeout(tick, deleting ? 55 : 90);
  }
  setTimeout(tick, 1800);
})();

/* ── Scroll Reveal ── */
(function initReveal() {
  const els = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

  // Skip hero (handled by preloader)
  const nonHero = [...els].filter(el => !el.closest('#hero'));

  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  nonHero.forEach(el => obs.observe(el));
})();

/* ── Animated Counters ── */
(function initCounters() {
  const counters = document.querySelectorAll('.stat-number[data-count]');
  if (!counters.length) return;

  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = +el.dataset.count;
      let current = 0;
      const step = Math.ceil(target / 40);
      const timer = setInterval(() => {
        current = Math.min(current + step, target);
        el.textContent = current + (target >= 10 ? '+' : '');
        if (current >= target) clearInterval(timer);
      }, 35);
      obs.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(c => obs.observe(c));
})();

/* ── Skill Bar Animations ── */
(function initSkillBars() {
  const fills = document.querySelectorAll('.skill-fill[data-width]');

  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.style.width = e.target.dataset.width + '%';
      obs.unobserve(e.target);
    });
  }, { threshold: 0.4 });

  fills.forEach(f => obs.observe(f));
})();

/* ── Skill Filter ── */
(function initSkillFilter() {
  const btns  = document.querySelectorAll('.skill-filter');
  const cards = document.querySelectorAll('.skill-card[data-category]');

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      cards.forEach(card => {
        const match = filter === 'all' || card.dataset.category === filter;
        card.classList.toggle('hidden', !match);
      });
    });
  });
})();

/* ── Contact Form ── */
(function initContactForm() {
  const form = document.getElementById('contact-form');
  const msg  = document.getElementById('form-msg');
  if (!form || !msg) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    const name    = form.name.value.trim();
    const email   = form.email.value.trim();
    const message = form.message.value.trim();

    if (!name || !email || !message) {
      msg.textContent = '⚠ Please fill in all required fields.';
      msg.className = 'form-msg error';
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      msg.textContent = '⚠ Please enter a valid email address.';
      msg.className = 'form-msg error';
      return;
    }

    // Simulate submission
    const btn = form.querySelector('button[type=submit]');
    btn.disabled = true;
    btn.querySelector('span').textContent = 'Sending...';
    msg.textContent = '';

    setTimeout(() => {
      msg.textContent = '✓ Message sent! I\'ll get back to you soon.';
      msg.className = 'form-msg success';

      btn.disabled = false;
      btn.querySelector('span').textContent = 'Sent ✓';

      form.reset();

      // Optional: revert back after few seconds
      setTimeout(() => {
        btn.querySelector('span').textContent = 'Send Message';
      }, 3000);

      setTimeout(() => {
        msg.textContent = '';
        msg.className = 'form-msg';
      }, 5000);

    }, 1200);
  });
})();

/* ── AI Chat Widget ── */
(function initChat() {
  const bubble   = document.getElementById('chat-bubble');
  const panel    = document.getElementById('chat-panel');
  const closeBtn = document.getElementById('chat-close');
  const input    = document.getElementById('chat-input');
  const sendBtn  = document.getElementById('chat-send');
  const messages = document.getElementById('chat-messages');
  if (!bubble || !panel) return;

  // Knowledge base about Vanuja
  const KB = `
You are a helpful AI assistant on Vanuja Vinnath's portfolio website.
Vanuja is a Data Science undergraduate (Y4S2) at SLIIT, Sri Lanka.
He is an AI/ML Enthusiast, Full Stack Engineer, and Data Analyst.
His tech stack includes: React.js, Vite.js, Node.js, Express.js, Java, Spring Boot, Python, TensorFlow, AWS, Azure, MySQL, MongoDB, JavaScript, TypeScript, React Native, Power BI, Excel, Git.
His projects include: Multilingual Call Center Automation (NLP/LLM/Sentiment Analysis with LECO), KD Aircon e-commerce platform, Fashion Recommendation System, Public Health Information System.
He completed a 6-month Software Engineering Internship at Gamage Recruiters (March–September 2025).
He is from Panadura, Sri Lanka. Email: vinnathvanuja@gmail.com. Phone: +94786099188.
His GitHub: https://github.com/Vanuja03 and https://github.com/IT22025180
LinkedIn: https://www.linkedin.com/in/vanuja-vinnath-a0a32130a
He has an AWS Academy Cloud Foundations certification and a Diploma in IT from ESoft Metro Campus.
Be concise, friendly, and professional. Answer questions about his skills, projects, experience, or how to contact him.
`;

  let isOpen = false;

  function togglePanel() {
    isOpen = !isOpen;
    panel.classList.toggle('open', isOpen);
    if (isOpen) setTimeout(() => input.focus(), 200);
  }

  bubble.addEventListener('click', togglePanel);
  closeBtn.addEventListener('click', togglePanel);

  function appendMsg(text, role) {
    const div = document.createElement('div');
    div.className = 'chat-msg ' + role;
    div.textContent = text;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
    return div;
  }

  function showTyping() {
    const div = document.createElement('div');
    div.className = 'chat-msg loading';
    div.innerHTML = '<div class="typing-dots"><span></span><span></span><span></span></div>';
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
    return div;
  }

  async function sendMessage() {
    const text = input.value.trim();
    if (!text) return;
    appendMsg(text, 'user');
    input.value = '';
    const typing = showTyping();

    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          system: KB,
          messages: [{ role: 'user', content: text }]
        })
      });
      const data = await res.json();
      typing.remove();
      const reply = data.content?.map(b => b.text || '').join('') || 'Sorry, I couldn\'t process that.';
      appendMsg(reply, 'bot');
    } catch {
      typing.remove();
      appendMsg('Connection error. Please try again later.', 'bot');
    }
  }

  sendBtn.addEventListener('click', sendMessage);
  input.addEventListener('keydown', e => { if (e.key === 'Enter') sendMessage(); });
})();

/* ── Mouse Follow Gradient on Hero ── */
(function initMouseGlow() {
  const hero = document.getElementById('hero');
  if (!hero) return;
  hero.addEventListener('mousemove', e => {
    const rect = hero.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top)  / rect.height) * 100;
    hero.style.setProperty('--mx', x + '%');
    hero.style.setProperty('--my', y + '%');
  });
})();

/* ── Smooth Scroll for all anchor links ── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const id = anchor.getAttribute('href').slice(1);
    const target = document.getElementById(id);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

console.log('%c[VV] Portfolio loaded ✓', 'color:#6366f1;font-family:monospace;font-size:14px;font-weight:bold;');
