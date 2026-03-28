/**
 * Home Page Specific JavaScript
 * Handles counter animations and hero interactions
 */

// Animated Counter
function animateCounter(element, target, duration = 2000) {
  const start = 0;
  const increment = target / (duration / 16);
  let current = start;
  
  const updateCounter = () => {
    current += increment;
    if (current < target) {
      element.textContent = Math.floor(current);
      requestAnimationFrame(updateCounter);
    } else {
      element.textContent = target;
    }
  };
  
  updateCounter();
}

// Counter observer
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const target = parseInt(entry.target.dataset.count, 10);
      animateCounter(entry.target, target);
      counterObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.5
});

document.querySelectorAll('.stat-number').forEach(counter => {
  counterObserver.observe(counter);
});

// Smooth scroll for hero scroll indicator
document.querySelector('.hero__scroll')?.addEventListener('click', () => {
  document.querySelector('.ministry-focus')?.scrollIntoView({
    behavior: 'smooth'
  });
});

console.log('Home page loaded');
