/**
 * Books Page - Enhanced Animations & Interactions
 */

document.addEventListener('DOMContentLoaded', () => {
  initReviewsReveal();
  initVideosReveal();
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
