/**
 * Main JavaScript for Emmanuel Iren Portfolio
 * Handles navigation, scroll animations, and interactions
 */

// Navigation scroll effect
const nav = document.querySelector('.nav');
let lastScroll = 0;

function handleNavScroll() {
  const currentScroll = window.pageYOffset;
  
  if (currentScroll > 50) {
    nav?.classList.add('nav--scrolled');
  } else {
    nav?.classList.remove('nav--scrolled');
  }
  
  lastScroll = currentScroll;
}

window.addEventListener('scroll', handleNavScroll, { passive: true });

// Mobile navigation toggle
const navToggle = document.querySelector('.nav__toggle');
const navLinks = document.querySelector('.nav__links');

navToggle?.addEventListener('click', () => {
  const isOpen = navLinks?.classList.contains('nav__links--open');
  navLinks?.classList.toggle('nav__links--open', !isOpen);
  navToggle?.classList.toggle('nav__toggle--open', !isOpen);
  navToggle?.setAttribute('aria-expanded', String(!isOpen));
});

// Close mobile menu when clicking a link
document.querySelectorAll('.nav__link').forEach(link => {
  link.addEventListener('click', () => {
    navLinks?.classList.remove('nav__links--open');
    navToggle?.classList.remove('nav__toggle--open');
    navToggle?.setAttribute('aria-expanded', 'false');
  });
});

// ============================================
// SPLIT TEXT ANIMATION
// ============================================
function initSplitText() {
  const splitElements = document.querySelectorAll('[data-split-text]');
  
  splitElements.forEach(element => {
    const text = element.textContent.trim();
    const words = text.split(/\s+/);
    
    element.innerHTML = words.map((word, index) => {
      const delay = index * 0.05;
      return `<span class="word" style="transition-delay: ${delay}s"><span class="word-inner" style="transition-delay: ${delay}s">${word}</span></span>`;
    }).join(' ');
    
    element.classList.add('split-text');
  });
}

// ============================================
// SCROLL REVEAL ANIMATION
// ============================================
const revealElements = document.querySelectorAll('.reveal, .blur-reveal, .scale-reveal, .slide-reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active');
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
});

// Stagger children animation
const staggerContainers = document.querySelectorAll('.stagger-children');

const staggerObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active');
      staggerObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
});

// Image reveal animation
const imageReveals = document.querySelectorAll('.image-reveal');

const imageObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('revealed');
      }, 200);
      imageObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.2
});

// Split text reveal observer
const splitTextObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active');
      splitTextObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.2,
  rootMargin: '0px 0px -50px 0px'
});

// Only enable CSS observers if GSAP is not available
if (typeof gsap === 'undefined') {
  revealElements.forEach(el => revealObserver.observe(el));
  staggerContainers.forEach(el => staggerObserver.observe(el));
  imageReveals.forEach(el => imageObserver.observe(el));
}

// ============================================
// PARALLAX EFFECT
// ============================================
function initParallax() {
  const parallaxElements = document.querySelectorAll('[data-parallax]');
  if (parallaxElements.length === 0) return;
  
  // Skip on touch devices
  if (window.matchMedia('(pointer: coarse)').matches) return;
  
  let ticking = false;
  
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrollY = window.pageYOffset;
        
        parallaxElements.forEach(el => {
          const speed = parseFloat(el.dataset.parallax) || 0.1;
          const rect = el.getBoundingClientRect();
          const elementTop = rect.top + scrollY;
          const distance = scrollY - elementTop + window.innerHeight;
          const translateY = distance * speed;
          
          if (rect.top < window.innerHeight && rect.bottom > 0) {
            el.style.transform = `translateY(${translateY}px)`;
          }
        });
        
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

// ============================================
// MAGNETIC BUTTONS
// ============================================
function initMagneticButtons() {
  const magneticElements = document.querySelectorAll('.magnetic');
  if (magneticElements.length === 0) return;
  
  // Skip on touch devices
  if (window.matchMedia('(pointer: coarse)').matches) return;
  
  magneticElements.forEach(el => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      el.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
    });
    
    el.addEventListener('mouseleave', () => {
      el.style.transform = 'translate(0, 0)';
    });
  });
}

// ============================================
// AMBIENT ORB MOUSE FOLLOW
// ============================================
function initAmbientOrbs() {
  const orbContainers = document.querySelectorAll('.ambient-orbs');
  if (orbContainers.length === 0) return;
  
  // Skip on touch devices
  if (window.matchMedia('(pointer: coarse)').matches) return;
  
  let ticking = false;
  
  document.addEventListener('mousemove', (e) => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const mouseX = e.clientX / window.innerWidth;
        const mouseY = e.clientY / window.innerHeight;
        
        orbContainers.forEach(container => {
          const orbs = container.querySelectorAll('.ambient-orb');
          orbs.forEach((orb, index) => {
            const factor = (index + 1) * 15;
            const moveX = (mouseX - 0.5) * factor;
            const moveY = (mouseY - 0.5) * factor;
            orb.style.marginLeft = `${moveX}px`;
            orb.style.marginTop = `${moveY}px`;
          });
        });
        
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

// ============================================
// SMOOTH SCROLL PROGRESS
// ============================================
function initScrollProgress() {
  const progressElements = document.querySelectorAll('[data-scroll-progress]');
  if (progressElements.length === 0) return;
  
  let ticking = false;
  
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrollY = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = scrollY / docHeight;
        
        progressElements.forEach(el => {
          const property = el.dataset.scrollProgress || 'opacity';
          if (property === 'opacity') {
            el.style.opacity = 1 - (progress * parseFloat(el.dataset.progressFactor || 1));
          } else if (property === 'scale') {
            el.style.transform = `scale(${1 + progress * parseFloat(el.dataset.progressFactor || 0)})`;
          }
        });
        
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

// ============================================
// DYNAMIC YEAR IN FOOTER
// ============================================
const yearSpan = document.getElementById('year');
if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear().toString();
}

// ============================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    if (href !== '#') {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    }
  });
});

// ============================================
// BUTTON RIPPLE EFFECT
// ============================================
document.querySelectorAll('.btn--primary, .btn--outline').forEach(button => {
  button.addEventListener('click', function(e) {
    const rect = this.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const ripple = document.createElement('span');
    ripple.style.cssText = `
      position: absolute;
      background: rgba(255,255,255,0.3);
      border-radius: 50%;
      transform: scale(0);
      animation: ripple 0.6s linear;
      left: ${x}px;
      top: ${y}px;
      width: 100px;
      height: 100px;
      margin-left: -50px;
      margin-top: -50px;
      pointer-events: none;
    `;
    
    this.style.position = 'relative';
    this.style.overflow = 'hidden';
    this.appendChild(ripple);
    
    setTimeout(() => ripple.remove(), 600);
  });
});

// Add ripple keyframes
const style = document.createElement('style');
style.textContent = `
  @keyframes ripple {
    to {
      transform: scale(4);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);

// ============================================
// INITIALIZE ALL ANIMATIONS
// ============================================
function initAll() {
  // Only run basic split text if GSAP is not available
  // GSAP script handles advanced text splitting
  if (typeof gsap === 'undefined') {
    initSplitText();
    document.querySelectorAll('.split-text').forEach(el => {
      splitTextObserver.observe(el);
    });
  }
  
  initParallax();
  initMagneticButtons();
  initAmbientOrbs();
  initScrollProgress();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAll);
} else {
  initAll();
}

console.log('Emmanuel Iren Portfolio - Ready');
