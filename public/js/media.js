/* ==========================================================================
   Media Page JavaScript - Immersive Video Background
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Handle video background on mobile devices
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  if (isMobile) {
    // On mobile, adjust iframe to cover screen properly
    const videoBackground = document.querySelector('.video-background');
    const videoIframe = document.querySelector('.video-background iframe');
    
    if (videoIframe && videoBackground) {
      // Force iframe to cover on mobile
      const isPortrait = window.innerHeight > window.innerWidth;
      
      if (isPortrait) {
        // Portrait: Make iframe wider to cover full width
        videoIframe.style.width = '350vw';
        videoIframe.style.height = '100vh';
        videoIframe.style.left = '50%';
        videoIframe.style.top = '50%';
      } else {
        // Landscape: Make iframe taller
        videoIframe.style.width = '100vw';
        videoIframe.style.height = '200vh';
        videoIframe.style.left = '50%';
        videoIframe.style.top = '50%';
      }
    }
  }

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // Pause video when not in viewport (performance optimization)
  const heroSection = document.querySelector('.media-hero');
  const heroVideo = document.querySelector('#heroVideo');
  
  if (heroVideo && 'IntersectionObserver' in window) {
    const videoObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        // Video handling is limited due to iframe restrictions
        // The overlay opacity can be adjusted based on visibility
        if (!entry.isIntersecting) {
          heroSection.style.opacity = '0.95';
        } else {
          heroSection.style.opacity = '1';
        }
      });
    }, {
      threshold: 0.1
    });
    
    videoObserver.observe(heroSection);
  }

  // Add parallax effect to hero section
  if (!isMobile && window.innerWidth > 768) {
    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;
      const hero = document.querySelector('.media-hero');
      const heroContent = document.querySelector('.media-hero__content');
      
      if (hero && scrolled < window.innerHeight) {
        const parallaxSpeed = 0.5;
        heroContent.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
        heroContent.style.opacity = 1 - (scrolled / window.innerHeight) * 0.8;
      }
    });
  }

  // Animate audio wave bars randomly for more dynamic effect
  const audioBars = document.querySelectorAll('.audio-wave .bar');
  if (audioBars.length > 0) {
    setInterval(() => {
      audioBars.forEach(bar => {
        if (Math.random() > 0.7) {
          const randomDelay = Math.random() * 0.5;
          bar.style.animationDelay = `${randomDelay}s`;
        }
      });
    }, 2000);
  }

  console.log('Media page loaded - Immersive video experience ready');
});
