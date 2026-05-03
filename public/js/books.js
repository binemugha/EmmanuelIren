/**
 * Books Page - Enhanced Animations & Interactions
 */

document.addEventListener('DOMContentLoaded', () => {
  initReviewsReveal();
  initVideosReveal();
  initBookTilt();
});

/**
 * Reviews Section - Scroll Reveal
 */
function initReviewsReveal() {
  const reviewCards = document.querySelectorAll('[data-review]');
  
  if (reviewCards.length === 0) return;

  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.2
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // Stagger animation
        setTimeout(() => {
          entry.target.classList.add('revealed');
        }, index * 150);
        
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  reviewCards.forEach(card => observer.observe(card));
}

/**
 * Videos Section - Scroll Reveal
 */
function initVideosReveal() {
  const videoCards = document.querySelectorAll('[data-video]');
  
  if (videoCards.length === 0) return;

  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // Stagger animation
        setTimeout(() => {
          entry.target.classList.add('revealed');
        }, index * 150);
        
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  videoCards.forEach(card => observer.observe(card));
}

/**
 * 3D Tilt Effect for Featured Book
 */
function initBookTilt() {
  const tiltElements = document.querySelectorAll('[data-tilt]');
  
  if (tiltElements.length === 0) return;
  if (window.matchMedia('(pointer: coarse)').matches) return;
  
  tiltElements.forEach(el => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = ((y - centerY) / centerY) * -8;
      const rotateY = ((x - centerX) / centerX) * 8;
      
      el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
    });
    
    el.addEventListener('mouseleave', () => {
      el.style.transform = 'perspective(1000px) rotateX(0) rotateY(-8deg) translateY(0)';
    });
  });
}
