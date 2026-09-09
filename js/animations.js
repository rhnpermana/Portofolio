/* ================================================================
   ANIMATIONS.JS — Scroll-Triggered Animations
   IntersectionObserver reveals, counters, timeline, parallax
   ================================================================ */

(function () {
  'use strict';

  // ===== SCROLL REVEAL (IntersectionObserver) =====
  function initScrollReveal() {
    const revealElements = document.querySelectorAll(
      '.reveal, .reveal-left, .reveal-right, .reveal-scale, .stagger-children'
    );

    if (!revealElements.length) return;

    // Immediately reveal elements already visible in initial viewport
    const windowHeight = window.innerHeight;
    revealElements.forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < windowHeight && rect.bottom > 0) {
        el.classList.add('revealed');
      }
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.05,
        rootMargin: '0px 0px 60px 0px',
      }
    );

    revealElements.forEach((el) => {
      if (!el.classList.contains('revealed')) {
        observer.observe(el);
      }
    });
  }

  // ===== ANIMATED COUNTERS =====
  function initCounters() {
    const counters = document.querySelectorAll('[data-count]');
    if (!counters.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    counters.forEach((el) => observer.observe(el));
  }

  function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-count'), 10);
    const duration = 2000;
    const startTime = performance.now();
    const startVal = 0;

    function easeOutQuart(t) {
      return 1 - Math.pow(1 - t, 4);
    }

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutQuart(progress);
      const currentVal = Math.floor(startVal + (target - startVal) * easedProgress);

      element.textContent = currentVal;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        element.textContent = target;
      }
    }

    requestAnimationFrame(update);
  }

  // ===== SKILL BAR ANIMATION =====
  function initSkillBars() {
    const skillBars = document.querySelectorAll('.skill-bar-fill');
    if (!skillBars.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const fill = entry.target;
            const targetWidth = fill.getAttribute('data-width');
            // Small delay for visual effect
            setTimeout(() => {
              fill.style.width = targetWidth + '%';
            }, 200);
            observer.unobserve(fill);
          }
        });
      },
      { threshold: 0.3 }
    );

    skillBars.forEach((bar) => observer.observe(bar));
  }

  // ===== TIMELINE PROGRESS =====
  function initTimeline() {
    const timeline = document.querySelector('.timeline');
    const progressBar = document.querySelector('.timeline-progress');
    const items = document.querySelectorAll('.timeline-item');

    if (!timeline || !progressBar || !items.length) return;

    function updateTimeline() {
      const rect = timeline.getBoundingClientRect();
      const timelineTop = rect.top;
      const timelineHeight = rect.height;
      const windowHeight = window.innerHeight;

      // Calculate scroll progress within the timeline
      const scrolled = windowHeight * 0.6 - timelineTop;
      const progress = Math.max(0, Math.min(scrolled / timelineHeight, 1));

      progressBar.style.height = (progress * 100) + '%';

      // Activate timeline items based on scroll
      items.forEach((item) => {
        const itemRect = item.getBoundingClientRect();
        const itemMiddle = itemRect.top + itemRect.height / 2;

        if (itemMiddle < windowHeight * 0.7) {
          item.classList.add('active');
        }
      });
    }

    // Listen to scroll/Lenis events
    window.addEventListener('scroll', updateTimeline, { passive: true });
    updateTimeline(); // Initial call
  }

  // ===== PARALLAX EFFECT =====
  function initParallax() {
    const parallaxElements = document.querySelectorAll('.parallax');
    if (!parallaxElements.length) return;

    function updateParallax() {
      const scrollY = window.pageYOffset;

      parallaxElements.forEach((el) => {
        const speed = parseFloat(el.getAttribute('data-parallax-speed')) || 0.3;
        const rect = el.getBoundingClientRect();
        const elementCenter = rect.top + rect.height / 2;
        const windowCenter = window.innerHeight / 2;
        const offset = (elementCenter - windowCenter) * speed;

        el.style.transform = `translateY(${offset}px)`;
      });
    }

    window.addEventListener('scroll', updateParallax, { passive: true });
    updateParallax();
  }

  // ===== 3D CARD TILT =====
  function initCardTilt() {
    const cards = document.querySelectorAll('.project-card');

    cards.forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -5;
        const rotateY = ((x - centerX) / centerX) * 5;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
      });
    });
  }

  // ===== MAGNETIC BUTTONS =====
  function initMagneticButtons() {
    const buttons = document.querySelectorAll('.magnetic-btn');

    buttons.forEach((btn) => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
      });

      btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate(0px, 0px)';
      });
    });
  }

  // ===== NAVBAR ACTIVE SECTION INDICATOR =====
  function initNavActiveIndicator() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    if (!sections.length || !navLinks.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            navLinks.forEach((link) => {
              link.classList.remove('active');
              if (link.getAttribute('data-section') === id) {
                link.classList.add('active');
              }
            });
          }
        });
      },
      {
        threshold: 0.3,
        rootMargin: '-80px 0px -50% 0px',
      }
    );

    sections.forEach((section) => observer.observe(section));
  }

  // ===== INIT ALL =====
  function init() {
    initScrollReveal();
    initCounters();
    initSkillBars();
    initTimeline();
    initParallax();
    initCardTilt();
    initMagneticButtons();
    initNavActiveIndicator();
  }

  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
