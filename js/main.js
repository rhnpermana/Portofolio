/* ================================================================
   MAIN.JS — Core Application Logic
   Navbar, Theme Toggle, Typing, Filters, Modal, Form, Lenis
   ================================================================ */

(function () {
  'use strict';

  // ===== LENIS SMOOTH SCROLL =====
  function initSmoothScroll() {
    let lenis = null;

    if (typeof Lenis !== 'undefined') {
      lenis = new Lenis({
        duration: 0.9,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1.0,
        touchMultiplier: 1.5,
      });

      window.__lenis = lenis;

      function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }

      requestAnimationFrame(raf);
    }

    // Connect smooth scroll to internal anchor links
    document.querySelectorAll('a[href^="#"]').forEach((link) => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (!href || href === '#' || href.length <= 1) return;

        try {
          const target = document.querySelector(href);
          if (target) {
            e.preventDefault();
            if (lenis) {
              lenis.scrollTo(target, {
                offset: -70,
                duration: 0.8,
                immediate: false,
              });
            } else {
              const navHeight = 70;
              const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
              window.scrollTo({
                top: targetPosition,
                behavior: 'smooth',
              });
            }
            closeMobileMenu();
          }
        } catch (err) {
          // Ignore invalid selector
        }
      });
    });

    return lenis;
  }

  // ===== NAVBAR =====
  function initNavbar() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;

    let lastScroll = 0;

    window.addEventListener('scroll', () => {
      const currentScroll = window.pageYOffset;

      if (currentScroll > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }

      lastScroll = currentScroll;
    }, { passive: true });
  }

  // ===== MOBILE MENU =====
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  const navOverlay = document.getElementById('navOverlay');

  function closeMobileMenu() {
    if (navToggle) navToggle.classList.remove('active');
    if (navMenu) navMenu.classList.remove('open');
    if (navOverlay) navOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  function initMobileMenu() {
    if (!navToggle || !navMenu) return;

    navToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.contains('open');
      if (isOpen) {
        closeMobileMenu();
      } else {
        navToggle.classList.add('active');
        navMenu.classList.add('open');
        if (navOverlay) navOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });

    if (navOverlay) {
      navOverlay.addEventListener('click', closeMobileMenu);
    }

    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeMobileMenu();
    });
  }

  // ===== THEME TOGGLE =====
  function initThemeToggle() {
    const toggle = document.getElementById('themeToggle');
    if (!toggle) return;

    const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);

    toggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('portfolio-theme', next);
    });
  }

  // ===== TYPING ANIMATION =====
  function initTypingAnimation() {
    const typingEl = document.getElementById('typingText');
    if (!typingEl) return;

    const words = [
      'Fullstack Developer',
      'UI/UX Designer',
      'Creative Coder',
      'Problem Solver',
    ];

    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let isPaused = false;

    function type() {
      const currentWord = words[wordIndex];

      if (isPaused) {
        isPaused = false;
        isDeleting = true;
        setTimeout(type, 50);
        return;
      }

      if (!isDeleting) {
        // Typing
        typingEl.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;

        if (charIndex === currentWord.length) {
          isPaused = true;
          setTimeout(type, 2000); // Pause at full word
          return;
        }

        setTimeout(type, 80 + Math.random() * 40); // Variable typing speed
      } else {
        // Deleting
        typingEl.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;

        if (charIndex === 0) {
          isDeleting = false;
          wordIndex = (wordIndex + 1) % words.length;
          setTimeout(type, 400); // Pause before next word
          return;
        }

        setTimeout(type, 40);
      }
    }

    // Start after a small delay
    setTimeout(type, 1000);
  }

  // ===== PROJECT FILTER =====
  function initProjectFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    if (!filterBtns.length || !projectCards.length) return;

    filterBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        // Update active button
        filterBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.getAttribute('data-filter');

        projectCards.forEach((card) => {
          const category = card.getAttribute('data-category');
          const shouldShow = filter === 'all' || category === filter;

          if (shouldShow) {
            card.classList.remove('hidden', 'filtering-out');
            card.classList.add('filtering-in');
            card.addEventListener('animationend', () => {
              card.classList.remove('filtering-in');
            }, { once: true });
          } else {
            card.classList.add('filtering-out');
            setTimeout(() => {
              card.classList.add('hidden');
              card.classList.remove('filtering-out');
            }, 300);
          }
        });
      });
    });
  }

  // ===== PROJECT MODAL =====
  function initProjectModal() {
    const modal = document.getElementById('projectModal');
    const modalOverlay = document.querySelector('.modal-overlay');
    if (!modal) return;

    const modalImage = modal.querySelector('.modal-image img');
    const modalTitle = modal.querySelector('.modal-title');
    const modalTags = modal.querySelector('.modal-tags');
    const modalDesc = modal.querySelector('.modal-description');
    const modalLinks = modal.querySelector('.modal-links');
    const modalClose = modal.querySelector('.modal-close');

    // Project data
    const projectData = {
      1: {
        title: 'NexGen Dashboard',
        image: 'img/Screenshot%20(66).png',
        tags: ['React', 'TypeScript', 'D3.js', 'Node.js'],
        description: 'Platform analytics real-time yang dirancang untuk memvisualisasikan data bisnis kompleks dengan antarmuka yang intuitif. Dashboard ini mendukung lebih dari 10 jenis grafik interaktif, filter data dinamis, dan ekspor laporan otomatis. Dibangun dengan arsitektur micro-frontend untuk skalabilitas optimal.',
        demo: '#',
        github: '#',
        gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      },
      2: {
        title: 'marketplace_juarastyle',
        image: 'img/Screenshot%20(65).png',
        tags: ['Vite', 'Laravel', 'Mysql', 'Tailwind'],
        description: 'website marketplace untuk produk style outfit untuk pasar anak muda khusus nya para pelajar/mahasiswa.website ini memang masih tahap pengembangan dan anda bisa mencoba lewat fitur mode demo dibawah ini   .',
        demo: 'https://juarastyle.vercel.app/',
        github: 'https://github.com/rhnpermana/juarastyle.git',
        gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      },
      3: {
        title: 'ShopVerse',
        image: 'img/Screenshot%20(56).png',
        tags: ['Next.js', 'Stripe', 'Prisma', 'Tailwind'],
        description: 'Platform e-commerce modern dengan pengalaman belanja yang seamless. Fitur unggulan termasuk AR product preview, pencarian cerdas berbasis AI, sistem rekomendasi personal, checkout satu klik, dan dashboard analytics untuk penjual.',
        demo: '#',
        github: '#',
        gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      },
      4: {
        title: 'district_barbershop',
        image: 'img/Screenshot%20from%202026-09-10%2014-47-59.png',
        tags: ['Figma', 'Prototyping', 'User Research', 'Design System'],
        description: 'Desain UI/UX lengkap untuk platform pemesanan perjalanan. Proyek ini mencakup riset pengguna mendalam, wireframing, prototyping interaktif, dan pembuatan design system komprehensif. Fokus pada aksesibilitas dan pengalaman pengguna lintas budaya.',
        demo: 'https://dsbarbershop.vercel.app/',
        github: 'https://github.com/rhnpermana/district.git',
        gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      },
      5: {
        title: 'DevConnect',
        image: '',
        tags: ['Vue.js', 'GraphQL', 'PostgreSQL', 'Docker'],
        description: 'Jaringan sosial khusus developer untuk berbagi kode, berkolaborasi dalam proyek, dan membangun portofolio profesional. Fitur termasuk code snippet sharing dengan syntax highlighting, forum diskusi real-time, dan sistem mentorship.',
        demo: '#',
        github: '#',
        gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      },
      6: {
        title: 'FoodSwift',
        image: '',
        tags: ['Flutter', 'Dart', 'Google Maps', 'Socket.io'],
        description: 'Aplikasi pesan antar makanan dengan pelacakan real-time dan antarmuka yang menarik. Dilengkapi dengan pencarian restoran berbasis lokasi, estimasi waktu pengiriman akurat, sistem rating & review, dan program loyalitas pelanggan.',
        demo: '#',
        github: '#',
        gradient: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
      },
    };

    // Open modal on card click
    document.querySelectorAll('.project-card').forEach((card) => {
      card.addEventListener('click', (e) => {
        // Don't open if clicking a link inside the card
        if (e.target.closest('.project-link')) return;

        const projectId = card.getAttribute('data-project');
        const data = projectData[projectId];
        if (!data) return;

        // Populate modal
        if (data.image) {
          modalImage.src = data.image;
          modalImage.style.display = 'block';
          modalImage.parentElement.style.background = '';
        } else {
          modalImage.style.display = 'none';
          modalImage.parentElement.style.background = data.gradient;
        }

        modalTitle.textContent = data.title;
        modalTags.innerHTML = data.tags
          .map((tag) => `<span class="project-tag">${tag}</span>`)
          .join('');
        modalDesc.textContent = data.description;
        modalLinks.innerHTML = `
          <a href="${data.demo}" class="btn btn-primary" target="_blank" rel="noopener">
            <span>Live Demo</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
          </a>
          <a href="${data.github}" class="btn btn-ghost" target="_blank" rel="noopener">
            <span>GitHub</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
          </a>
        `;

        // Show modal
        modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
      });
    });

    // Close modal
    function closeModal() {
      modalOverlay.classList.remove('active');
      document.body.style.overflow = '';
    }

    if (modalClose) modalClose.addEventListener('click', closeModal);

    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeModal();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeModal();
    });
  }

  // ===== CONTACT FORM =====
  function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    const submitBtn = form.querySelector('.submit-btn');

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      // Basic validation
      const inputs = form.querySelectorAll('.form-input[required]');
      let isValid = true;

      inputs.forEach((input) => {
        if (!input.value.trim()) {
          isValid = false;
          input.style.borderColor = '#f87171';
          setTimeout(() => {
            input.style.borderColor = '';
          }, 2000);
        }
      });

      // Email validation
      const emailInput = form.querySelector('input[type="email"]');
      if (emailInput && emailInput.value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailInput.value)) {
          isValid = false;
          emailInput.style.borderColor = '#f87171';
          setTimeout(() => {
            emailInput.style.borderColor = '';
          }, 2000);
        }
      }

      if (!isValid) return;

      // Simulate sending
      submitBtn.classList.add('sending');

      setTimeout(() => {
        submitBtn.classList.remove('sending');
        submitBtn.classList.add('sent');

        // Reset form
        form.reset();

        // Reset button after 3 seconds
        setTimeout(() => {
          submitBtn.classList.remove('sent');
        }, 3000);
      }, 2000);
    });
  }

  // ===== BACK TO TOP =====
  function initBackToTop() {
    const btn = document.getElementById('backToTop');
    if (!btn) return;

    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (window.__lenis) {
        window.__lenis.scrollTo(0, { duration: 0.8 });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }

  // ===== LUCIDE ICONS INIT =====
  function initIcons() {
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  }

  // ===== INIT ALL =====
  function init() {
    initSmoothScroll();
    initNavbar();
    initMobileMenu();
    initThemeToggle();
    initTypingAnimation();
    initProjectFilter();
    initProjectModal();
    initContactForm();
    initBackToTop();
    initIcons();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
