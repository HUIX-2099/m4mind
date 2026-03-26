/* ============================================
   M4TMind — Main JavaScript v3.0
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* =====================
     LOADING SCREEN
     ===================== */
  const loadingScreen = document.getElementById('loading-screen');
  const loadingBar = document.getElementById('loading-bar');

  if (loadingScreen && loadingBar) {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 18 + 5;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        loadingBar.style.width = '100%';
        setTimeout(() => {
          loadingScreen.classList.add('hidden');
        }, 400);
      }
      loadingBar.style.width = `${Math.min(progress, 100)}%`;
    }, 120);
  }

  /* =====================
     TOP BAR OFFSET
     ===================== */
  const topbar = document.querySelector('.topbar');
  if (topbar && window.innerWidth >= 768) {
    document.body.classList.add('has-topbar');
  }

  /* =====================
     THEME TOGGLE
     ===================== */
  const themeToggle = document.getElementById('theme-toggle');
  const html = document.documentElement;
  const sunIcon = document.getElementById('sun-icon');
  const moonIcon = document.getElementById('moon-icon');

  function applyTheme(theme) {
    html.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    if (sunIcon && moonIcon) {
      if (theme === 'dark') {
        sunIcon.classList.remove('hidden');
        moonIcon.classList.add('hidden');
      } else {
        sunIcon.classList.add('hidden');
        moonIcon.classList.remove('hidden');
      }
    }
  }

  const savedTheme = localStorage.getItem('theme') || 'dark';
  applyTheme(savedTheme);

  themeToggle?.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    applyTheme(current === 'dark' ? 'light' : 'dark');
  });

  /* =====================
     SCROLL PROGRESS
     ===================== */
  const scrollBar = document.getElementById('scroll-progress');
  const navbar = document.getElementById('navbar');
  const backToTop = document.getElementById('back-to-top');

  window.addEventListener('scroll', () => {
    const total = document.documentElement.scrollHeight - window.innerHeight;
    if (scrollBar) scrollBar.style.width = `${(window.scrollY / total) * 100}%`;

    // Navbar solid on scroll
    if (navbar) {
      if (window.scrollY > 60) {
        navbar.classList.add('scrolled');
        if (document.body.classList.contains('has-topbar')) {
          navbar.style.top = '0';
        }
      } else {
        navbar.classList.remove('scrolled');
        if (document.body.classList.contains('has-topbar')) {
          navbar.style.top = topbar ? `${topbar.offsetHeight}px` : '0';
        }
      }
    }

    // Back to top
    if (backToTop) {
      backToTop.classList.toggle('show', window.scrollY > 500);
    }
  });

  /* =====================
     BACK TO TOP
     ===================== */
  backToTop?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* =====================
     MOBILE MENU
     ===================== */
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileClose = document.getElementById('mobile-close');
  const mobileLinks = mobileMenu?.querySelectorAll('.mobile-nav-link, .mobile-nav-cta') || [];

  function openMobileMenu() {
    hamburger?.classList.add('active');
    mobileMenu?.classList.add('open');
    document.body.style.overflow = 'hidden';
    mobileLinks.forEach((link, i) => {
      link.style.transitionDelay = `${0.05 + i * 0.06}s`;
    });
  }

  function closeMobileMenu() {
    hamburger?.classList.remove('active');
    mobileMenu?.classList.remove('open');
    document.body.style.overflow = '';
    mobileLinks.forEach(link => { link.style.transitionDelay = '0s'; });
  }

  hamburger?.addEventListener('click', () => {
    mobileMenu?.classList.contains('open') ? closeMobileMenu() : openMobileMenu();
  });
  mobileClose?.addEventListener('click', closeMobileMenu);
  mobileLinks.forEach(link => link.addEventListener('click', closeMobileMenu));

  // Close on backdrop tap
  mobileMenu?.addEventListener('click', (e) => {
    if (e.target === mobileMenu) closeMobileMenu();
  });

  /* =====================
     SMOOTH SCROLL
     ===================== */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (!targetId || targetId === '#' || targetId.length < 2) return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  /* =====================
     ACTIVE NAV HIGHLIGHT
     ===================== */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  function highlightNav() {
    const scrollPos = window.scrollY + 160;
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(link => {
          link.classList.toggle('active-link', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }
  window.addEventListener('scroll', highlightNav);

  /* =====================
     SCROLL REVEAL
     ===================== */
  const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  revealEls.forEach(el => observer.observe(el));

  /* =====================
     COOKIE POPUP
     ===================== */
  const cookiePopup = document.getElementById('cookie-popup');
  const acceptCookies = document.getElementById('accept-cookies');
  const declineCookies = document.getElementById('decline-cookies');
  const manageCookies = document.getElementById('manage-cookies');

  if (cookiePopup && !localStorage.getItem('cookie-consent')) {
    setTimeout(() => cookiePopup.classList.add('show'), 2200);
  }

  function hideCookiePopup() {
    cookiePopup?.classList.remove('show');
  }

  acceptCookies?.addEventListener('click', () => {
    localStorage.setItem('cookie-consent', 'accepted');
    hideCookiePopup();
    // Google Analytics consent (if gtag is loaded)
    if (typeof gtag !== 'undefined') {
      gtag('consent', 'update', { analytics_storage: 'granted', ad_storage: 'granted' });
    }
  });

  manageCookies?.addEventListener('click', () => {
    // Simple manage: just accept analytics only
    localStorage.setItem('cookie-consent', 'analytics-only');
    hideCookiePopup();
    if (typeof gtag !== 'undefined') {
      gtag('consent', 'update', { analytics_storage: 'granted', ad_storage: 'denied' });
    }
  });

  declineCookies?.addEventListener('click', () => {
    localStorage.setItem('cookie-consent', 'declined');
    hideCookiePopup();
  });

  /* =====================
     CHAT WIDGET
     ===================== */
  const chatFab = document.getElementById('chat-fab');
  const chatModal = document.getElementById('chat-modal');
  const chatClose = document.getElementById('chat-close');
  const chatInput = document.getElementById('chat-input');
  const chatSend = document.getElementById('chat-send');
  const chatMessages = document.getElementById('chat-messages');

  // Canned responses
  const responses = {
    'documentary': "📽️ Our documentary service covers full pre-production, filming, and post-production. We've produced award-winning docs across West Africa. Contact us at info@m4tmind.com to start!",
    'podcast': "🎙️ We offer end-to-end podcast production: recording, mixing, mastering, and distribution. We have a professional studio setup in Monrovia, Liberia.",
    'event': "🎥 Our Event Virtualization team handles everything — live streaming, multi-camera setups, virtual event platforms, and global broadcast. Great for conferences and summits!",
    'zoom': "💻 We manage all aspects of virtual meetings and Zoom events — setup, moderation, technical support, and full recording with post-production.",
    'price': "💰 Pricing varies by project scope. Please reach out at info@m4tmind.com or call (+231) 881 274 124 for a custom quote tailored to your needs.",
    'started': "🚀 Getting started is easy! You can fill out the contact form on our Contact page, or email us at info@m4tmind.com. We'll get back to you within 24 hours.",
    'location': "📍 We're based in the DB Building, Newport Street, Monrovia, Liberia — but we serve clients across Africa and globally!",
    'default': "Thanks for reaching out! 😊 For the fastest response, please email us at info@m4tmind.com or call (+231) 881 274 124. We'd love to help tell your story!"
  };

  function getBotResponse(msg) {
    const lower = msg.toLowerCase();
    if (lower.includes('documentary') || lower.includes('film') || lower.includes('docu')) return responses.documentary;
    if (lower.includes('podcast') || lower.includes('audio')) return responses.podcast;
    if (lower.includes('event') || lower.includes('virtual') || lower.includes('stream')) return responses.event;
    if (lower.includes('zoom') || lower.includes('meeting')) return responses.zoom;
    if (lower.includes('price') || lower.includes('cost') || lower.includes('pricing') || lower.includes('how much')) return responses.price;
    if (lower.includes('start') || lower.includes('begin') || lower.includes('get started')) return responses.started;
    if (lower.includes('location') || lower.includes('where') || lower.includes('liberia') || lower.includes('monrovia')) return responses.location;
    return responses.default;
  }

  function appendMessage(text, sender) {
    const div = document.createElement('div');
    div.className = `chat-msg chat-msg-${sender}`;
    const now = new Date();
    const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    div.innerHTML = `<div class="chat-bubble">${text}</div><span class="chat-time">${time}</span>`;
    chatMessages?.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function showTyping() {
    const typing = document.createElement('div');
    typing.className = 'chat-msg chat-msg-bot';
    typing.id = 'typing-indicator';
    typing.innerHTML = `<div class="chat-typing"><span></span><span></span><span></span></div>`;
    chatMessages?.appendChild(typing);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function removeTyping() {
    document.getElementById('typing-indicator')?.remove();
  }

  function sendMessage(text) {
    if (!text.trim()) return;
    appendMessage(text, 'user');
    if (chatInput) chatInput.value = '';
    // Hide suggestions
    document.querySelector('.chat-suggestions')?.remove();
    showTyping();
    setTimeout(() => {
      removeTyping();
      appendMessage(getBotResponse(text), 'bot');
    }, 900 + Math.random() * 600);
  }

  chatFab?.addEventListener('click', () => {
    chatModal?.classList.add('open');
    chatFab.style.transform = 'scale(0.8)';
    setTimeout(() => { chatFab.style.transform = ''; }, 200);
  });

  chatClose?.addEventListener('click', () => {
    chatModal?.classList.remove('open');
  });

  chatSend?.addEventListener('click', () => sendMessage(chatInput?.value || ''));
  chatInput?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') sendMessage(chatInput.value);
  });

  // Suggestion buttons
  document.querySelectorAll('.chat-suggestion-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      sendMessage(btn.getAttribute('data-msg') || btn.textContent);
    });
  });

  // Close chat on outside click
  document.addEventListener('click', (e) => {
    if (chatModal?.classList.contains('open') &&
        !chatModal.contains(e.target) &&
        !chatFab?.contains(e.target)) {
      chatModal.classList.remove('open');
    }
  });

  /* =====================
     CONTACT FORM
     ===================== */
  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = form.querySelector('#name')?.value.trim();
      const email = form.querySelector('#email')?.value.trim();
      const message = form.querySelector('#message')?.value.trim();

      if (!name || !email || !message) {
        showToast('Please fill in all required fields.', 'error'); return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showToast('Please enter a valid email address.', 'error'); return;
      }

      const btn = form.querySelector('button[type="submit"]');
      const orig = btn.innerHTML;
      btn.innerHTML = `<svg class="animate-spin h-5 w-5 inline" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" opacity=".25"/><path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" opacity=".75"/></svg> Sending…`;
      btn.disabled = true;

      setTimeout(() => {
        showToast('Message sent! We\'ll be in touch soon.', 'success');
        form.reset();
        btn.innerHTML = orig;
        btn.disabled = false;
      }, 2000);
    });
  }

  /* =====================
     TOAST
     ===================== */
  function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    const bg = type === 'success' ? 'linear-gradient(135deg,#16a34a,#15803d)' : 'linear-gradient(135deg,#dc2626,#b91c1c)';
    toast.style.cssText = `position:fixed;bottom:5rem;left:50%;transform:translateX(-50%) translateY(12px);background:${bg};color:#fff;padding:.75rem 1.5rem;border-radius:10px;font-size:.85rem;font-weight:600;z-index:9999;opacity:0;transition:all .35s cubic-bezier(0.23,1,0.32,1);white-space:nowrap;box-shadow:0 8px 32px rgba(0,0,0,0.3);`;
    toast.textContent = message;
    document.body.appendChild(toast);
    requestAnimationFrame(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translateX(-50%) translateY(0)';
    });
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(-50%) translateY(12px)';
      setTimeout(() => toast.remove(), 350);
    }, 3500);
  }

  /* =====================
     FOOTER YEAR
     ===================== */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* =====================
     TOPBAR HEIGHT → NAVBAR OFFSET
     ===================== */
  function setNavbarTop() {
    if (!navbar) return;
    if (topbar && window.innerWidth >= 768 && window.scrollY <= 60) {
      navbar.style.top = `${topbar.offsetHeight}px`;
    } else if (window.scrollY > 60) {
      navbar.style.top = '0';
    }
  }
  setNavbarTop();
  window.addEventListener('resize', setNavbarTop);

});
