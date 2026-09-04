/**
 * VESTURE — Main Interactive Application Script
 * Smooth animations, preloader, audio synthesis, slider, drawer menu, and interactions.
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Interactive Preloader
  const loader = document.getElementById('loader');
  const loaderCounter = document.getElementById('loaderCounter');
  
  if (loader && loaderCounter) {
    let count = 0;
    const interval = setInterval(() => {
      count += Math.floor(Math.random() * 12) + 8;
      if (count >= 100) {
        count = 100;
        loaderCounter.textContent = '100%';
        clearInterval(interval);
        setTimeout(() => {
          loader.classList.add('is-loaded');
          setTimeout(() => {
            loader.classList.add('is-done');
          }, 1200);
        }, 300);
      } else {
        loaderCounter.textContent = `${count}%`;
      }
    }, 45);
  }

  // 2. Custom Cursor Follower
  const cursor = document.getElementById('customCursor');
  const follower = document.getElementById('customCursorFollower');
  
  if (cursor && follower && window.matchMedia('(pointer: fine)').matches) {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let followerX = mouseX;
    let followerY = mouseY;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursor.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
    });

    const updateFollower = () => {
      followerX += (mouseX - followerX) * 0.15;
      followerY += (mouseY - followerY) * 0.15;
      follower.style.transform = `translate(${followerX}px, ${followerY}px)`;
      requestAnimationFrame(updateFollower);
    };
    updateFollower();

    const hoverTargets = document.querySelectorAll('a, button, .interactive, .showcase_card, .phil_card');
    hoverTargets.forEach((target) => {
      target.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
      target.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });
  }

  // 3. Ambient Audio Synth (No external audio file dependencies)
  const soundBtn = document.getElementById('soundBtn');
  let audioCtx = null;
  let isSoundActive = false;

  const playClickSound = (freq = 440, type = 'sine', duration = 0.08) => {
    if (!isSoundActive) return;
    try {
      if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
      console.warn('Web Audio error', e);
    }
  };

  if (soundBtn) {
    soundBtn.addEventListener('click', () => {
      isSoundActive = !isSoundActive;
      soundBtn.classList.toggle('is-active', isSoundActive);
      soundBtn.querySelector('.sound_status').textContent = isSoundActive ? 'Sound [ON]' : 'Sound [OFF]';
      if (isSoundActive) playClickSound(580, 'sine', 0.12);
    });
  }

  // Play subtle blips on interactive button clicks
  document.querySelectorAll('button, .btn_magnetic, .menu_nav_link').forEach(btn => {
    btn.addEventListener('click', () => playClickSound(520, 'sine', 0.06));
  });

  // 4. Sticky Navbar Scrolled State
  const nav = document.getElementById('mainNav');
  if (nav) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 60) {
        nav.classList.add('is-scrolled');
      } else {
        nav.classList.remove('is-scrolled');
      }
    }, { passive: true });
  }

  // 5. Fullscreen Navigation Drawer
  const menuOverlay = document.getElementById('menuOverlay');
  const menuOpenBtn = document.getElementById('menuOpenBtn');
  const menuCloseBtn = document.getElementById('menuCloseBtn');
  const menuLinks = document.querySelectorAll('.menu_nav_link');

  const toggleMenu = (open) => {
    if (!menuOverlay) return;
    if (open) {
      menuOverlay.classList.add('is-open');
      document.body.style.overflow = 'hidden';
      playClickSound(640, 'triangle', 0.1);
    } else {
      menuOverlay.classList.remove('is-open');
      document.body.style.overflow = '';
      playClickSound(380, 'triangle', 0.08);
    }
  };

  if (menuOpenBtn) menuOpenBtn.addEventListener('click', () => toggleMenu(true));
  if (menuCloseBtn) menuCloseBtn.addEventListener('click', () => toggleMenu(false));
  menuLinks.forEach(link => {
    link.addEventListener('click', () => toggleMenu(false));
  });

  // 6. Showcase Slider Controls
  const prevSlideBtn = document.getElementById('prevSlide');
  const nextSlideBtn = document.getElementById('nextSlide');
  const showcaseTrack = document.getElementById('showcaseTrack');
  let currentSlide = 0;
  const totalSlides = 3;

  const updateSlider = (index) => {
    if (!showcaseTrack) return;
    if (window.innerWidth <= 1024) {
      currentSlide = (index + totalSlides) % totalSlides;
      const cardWidth = showcaseTrack.firstElementChild.offsetWidth;
      showcaseTrack.scrollTo({
        left: currentSlide * (cardWidth + 24),
        behavior: 'smooth'
      });
    }
    playClickSound(480, 'sine', 0.05);
  };

  if (prevSlideBtn) prevSlideBtn.addEventListener('click', () => updateSlider(currentSlide - 1));
  if (nextSlideBtn) nextSlideBtn.addEventListener('click', () => updateSlider(currentSlide + 1));

  // 7. Interactive Accordion (Service / Feature System)
  const serviceRows = document.querySelectorAll('.service_row');
  serviceRows.forEach(row => {
    row.addEventListener('click', () => {
      const wasActive = row.classList.contains('is-active');
      serviceRows.forEach(r => r.classList.remove('is-active'));
      if (!wasActive) {
        row.classList.add('is-active');
        playClickSound(560, 'sine', 0.06);
      }
    });
  });

  // 8. Smooth Back to Top
  const backToTopBtn = document.getElementById('backToTop');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      playClickSound(600, 'sine', 0.1);
    });
  }

  // 9. Real-time Live Clock & Coordinates
  const liveTimeEl = document.getElementById('liveTime');
  if (liveTimeEl) {
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getUTCHours()).padStart(2, '0');
      const mins = String(now.getUTCMinutes()).padStart(2, '0');
      const secs = String(now.getUTCSeconds()).padStart(2, '0');
      liveTimeEl.textContent = `UTC ${hours}:${mins}:${secs}`;
    };
    updateTime();
    setInterval(updateTime, 1000);
  }
});
