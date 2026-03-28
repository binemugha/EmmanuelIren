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

// Scroll Reveal Animation
const revealElements = document.querySelectorAll('.reveal');

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

revealElements.forEach(el => revealObserver.observe(el));

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

staggerContainers.forEach(el => staggerObserver.observe(el));

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

imageReveals.forEach(el => imageObserver.observe(el));

// Dynamic year in footer
const yearSpan = document.getElementById('year');
if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear().toString();
}

// Smooth scroll for anchor links
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

// Button ripple effect
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

console.log('Emmanuel Iren Portfolio - Ready');
