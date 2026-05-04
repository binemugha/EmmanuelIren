/**
 * GSAP ScrollTrigger Animations for Emmanuel Iren Portfolio
 * Advanced scroll-based text animations with character splitting,
 * 3D transforms, scroll velocity skew, and smooth scrubbed reveals.
 */

gsap.registerPlugin(ScrollTrigger);

// ============================================
// CSS RESET — disable conflicting transitions
// ============================================
const gsapStyle = document.createElement('style');
gsapStyle.textContent = `
  .split-text .word-inner,
  .split-text .char-inner,
  .reveal, .blur-reveal, .scale-reveal, .slide-reveal,
  .stagger-children > *,
  .image-reveal, .image-reveal img, .image-reveal::after {
    transition: none !important;
  }
  .split-text {
    perspective: 800px;
  }
`;
document.head.appendChild(gsapStyle);

// ============================================
// ADVANCED TEXT SPLITTING
// ============================================
function splitIntoWords(element) {
  const text = element.textContent.trim();
  const words = text.split(/\s+/);
  element.innerHTML = '';
  element.classList.add('split-text');

  const wordEls = [];
  words.forEach((word, i) => {
    const wordSpan = document.createElement('span');
    wordSpan.className = 'word';
    wordSpan.style.display = 'inline-block';
    wordSpan.style.overflow = 'hidden';
    wordSpan.style.verticalAlign = 'bottom';

    const inner = document.createElement('span');
    inner.className = 'word-inner';
    inner.style.display = 'inline-block';
    inner.textContent = word;

    wordSpan.appendChild(inner);
    element.appendChild(wordSpan);

    if (i < words.length - 1) {
      element.appendChild(document.createTextNode('\u00A0'));
    }
    wordEls.push(inner);
  });

  return wordEls;
}

function splitIntoChars(element) {
  const text = element.textContent.trim();
  element.innerHTML = '';
  element.classList.add('split-text');

  const charEls = [];
  const words = text.split(/\s+/);

  words.forEach((word, wIndex) => {
    const wordSpan = document.createElement('span');
    wordSpan.className = 'word';
    wordSpan.style.display = 'inline-block';
    wordSpan.style.whiteSpace = 'nowrap';

    for (let i = 0; i < word.length; i++) {
      const charWrapper = document.createElement('span');
      charWrapper.style.display = 'inline-block';
      charWrapper.style.overflow = 'hidden';
      charWrapper.style.verticalAlign = 'bottom';

      const inner = document.createElement('span');
      inner.className = 'char-inner';
      inner.style.display = 'inline-block';
      inner.textContent = word[i];

      charWrapper.appendChild(inner);
      wordSpan.appendChild(charWrapper);
      charEls.push(inner);
    }

    element.appendChild(wordSpan);
    if (wIndex < words.length - 1) {
      element.appendChild(document.createTextNode('\u00A0'));
    }
  });

  return charEls;
}

function splitIntoLines(element) {
  const text = element.innerHTML.trim();
  element.innerHTML = '';
  element.classList.add('split-text');

  // Simple line split by <br> or periods for blockquotes
  const lines = text.split(/<br\s*\/?>|\n/).filter(l => l.trim());
  const lineEls = [];

  lines.forEach((line, i) => {
    const lineSpan = document.createElement('span');
    lineSpan.className = 'line';
    lineSpan.style.display = 'block';
    lineSpan.style.overflow = 'hidden';

    const inner = document.createElement('span');
    inner.className = 'line-inner';
    inner.style.display = 'block';
    inner.innerHTML = line.trim();

    lineSpan.appendChild(inner);
    element.appendChild(lineSpan);
    lineEls.push(inner);
  });

  return lineEls;
}

function getSplitType(element) {
  const attr = element.getAttribute('data-split-text');
  if (attr === 'chars') return 'chars';
  if (attr === 'lines') return 'lines';
  return 'words';
}

function splitElement(element) {
  const type = getSplitType(element);
  if (type === 'chars') return { type, elements: splitIntoChars(element) };
  if (type === 'lines') return { type, elements: splitIntoLines(element) };
  return { type, elements: splitIntoWords(element) };
}

// ============================================
// STAGGER UTILITIES
// ============================================
function centerStagger(index, total) {
  const center = (total - 1) / 2;
  return Math.abs(index - center);
}

function randomStagger(indices) {
  const shuffled = indices.slice().sort(() => Math.random() - 0.5);
  const map = {};
  shuffled.forEach((origIndex, i) => {
    map[origIndex] = i;
  });
  return map;
}

// ============================================
// SCROLL VELOCITY SKEW
// ============================================
function initScrollVelocitySkew() {
  // Skip on touch devices
  if (window.matchMedia('(pointer: coarse)').matches) return;

  const skewTargets = document.querySelectorAll('.split-text');
  if (skewTargets.length === 0) return;

  let currentSkew = 0;
  let targetSkew = 0;

  ScrollTrigger.create({
    onUpdate: (self) => {
      const velocity = self.getVelocity();
      targetSkew = Math.max(-4, Math.min(4, velocity / 800));
    }
  });

  function updateSkew() {
    currentSkew += (targetSkew - currentSkew) * 0.08;
    targetSkew *= 0.92;

    if (Math.abs(currentSkew) > 0.01 || Math.abs(targetSkew) > 0.01) {
      skewTargets.forEach(el => {
        el.style.transform = `skewX(${currentSkew}deg)`;
      });
    }

    requestAnimationFrame(updateSkew);
  }

  requestAnimationFrame(updateSkew);
}

// ============================================
// HERO ENTRANCE — character-level 3D
// ============================================
function initHeroEntrance() {
  const hero = document.querySelector('.hero, .page-header, .media-hero');
  if (!hero) return;

  const heroHeading = hero.querySelector('h1[data-split-text]');
  const heroEyebrow = hero.querySelector('.eyebrow');
  const heroText = hero.querySelector('.hero__text, .page-header__text, .media-hero__text');
  const heroActions = hero.querySelector('.hero__actions, .media-hero__actions');
  const heroImage = hero.querySelector('.hero__media, .media-hero__media');

  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });

  // Hero heading: split into chars for dramatic effect
  if (heroHeading) {
    const { elements: chars } = splitElement(heroHeading);

    gsap.set(chars, {
      y: '120%',
      opacity: 0,
      rotateX: -90,
      transformOrigin: 'center bottom'
    });

    tl.to(chars, {
      y: '0%',
      opacity: 1,
      rotateX: 0,
      duration: 1.4,
      stagger: {
        each: 0.03,
        from: 'start'
      }
    }, 0.1);
  }

  // Eyebrow
  if (heroEyebrow) {
    gsap.set(heroEyebrow, { y: 30, opacity: 0, filter: 'blur(12px)' });
    tl.to(heroEyebrow, {
      y: 0,
      opacity: 1,
      filter: 'blur(0px)',
      duration: 1,
      ease: 'power3.out'
    }, 0);
  }

  // Body text
  if (heroText) {
    gsap.set(heroText, { y: 30, opacity: 0, filter: 'blur(10px)' });
    tl.to(heroText, {
      y: 0,
      opacity: 1,
      filter: 'blur(0px)',
      duration: 1,
      ease: 'power3.out'
    }, 0.35);
  }

  // Actions
  if (heroActions) {
    gsap.set(heroActions, { y: 25, opacity: 0 });
    tl.to(heroActions, {
      y: 0,
      opacity: 1,
      duration: 0.9,
      ease: 'power3.out'
    }, 0.55);
  }

  // Image reveal with mask
  if (heroImage) {
    gsap.set(heroImage, {
      clipPath: 'inset(100% 0 0 0)',
      scale: 1.15,
      y: 40
    });
    tl.to(heroImage, {
      clipPath: 'inset(0% 0 0 0)',
      scale: 1,
      y: 0,
      duration: 1.6,
      ease: 'power4.inOut'
    }, 0.2);
  }
}

// ============================================
// SCROLL WORD REVEALS — 3D rotationX
// ============================================
function initScrollWordAnimations() {
  const elements = document.querySelectorAll('[data-split-text]');

  elements.forEach(el => {
    // Skip elements handled by dedicated functions
    if (el.closest('.hero, .page-header, .media-hero')) return;
    if (el.closest('.quote-section')) return;
    if (el.closest('.cta-section')) return;

    const { type, elements: items } = splitElement(el);
    if (items.length === 0) return;

    if (type === 'chars') {
      // Character-level: dramatic with rotation
      gsap.set(items, {
        y: '110%',
        opacity: 0,
        rotateX: -80,
        transformOrigin: 'center bottom'
      });

      gsap.to(items, {
        y: '0%',
        opacity: 1,
        rotateX: 0,
        duration: 1.2,
        ease: 'expo.out',
        stagger: {
          each: 0.02,
          from: 'start'
        },
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          end: 'top 35%',
          scrub: 0.6,
          once: true
        }
      });
    } else if (type === 'lines') {
      // Line-level: slide up
      gsap.set(items, {
        y: 40,
        opacity: 0
      });

      gsap.to(items, {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: 'power3.out',
        stagger: 0.12,
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          end: 'top 40%',
          scrub: 0.5,
          once: true
        }
      });
    } else {
      // Word-level: center-out stagger with 3D
      gsap.set(items, {
        y: '110%',
        opacity: 0,
        rotateX: -70,
        transformOrigin: 'center bottom'
      });

      const total = items.length;
      const staggerFn = (index) => centerStagger(index, total) * 0.06;

      gsap.to(items, {
        y: '0%',
        opacity: 1,
        rotateX: 0,
        duration: 1.2,
        ease: 'expo.out',
        stagger: staggerFn,
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          end: 'top 35%',
          scrub: 0.6,
          once: true
        }
      });
    }
  });
}

// ============================================
// REVEAL ELEMENTS
// ============================================
function initScrollRevealAnimations() {
  const revealElements = document.querySelectorAll('.reveal, .blur-reveal, .scale-reveal, .slide-reveal');

  revealElements.forEach(el => {
    if (el.hasAttribute('data-split-text')) return;
    if (el.closest('[data-split-text]')) return;

    const isBlur = el.classList.contains('blur-reveal');
    const isScale = el.classList.contains('scale-reveal');
    const isSlide = el.classList.contains('slide-reveal');

    let fromVars = { y: 35, opacity: 0 };
    if (isScale) fromVars = { scale: 0.94, opacity: 0, y: 25 };
    if (isSlide) fromVars = { x: -35, opacity: 0 };
    if (isBlur) fromVars = { y: 25, opacity: 0, filter: 'blur(10px)' };

    gsap.fromTo(el, fromVars, {
      y: 0,
      x: 0,
      scale: 1,
      opacity: 1,
      filter: 'blur(0px)',
      duration: 1.1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 88%',
        end: 'top 50%',
        scrub: 0.4,
        once: true
      }
    });
  });
}

// ============================================
// STAGGER CHILDREN
// ============================================
function initStaggerScrollAnimations() {
  document.querySelectorAll('.stagger-children').forEach(container => {
    const children = Array.from(container.children);
    if (children.length === 0) return;

    gsap.fromTo(children, {
      y: 30,
      opacity: 0
    }, {
      y: 0,
      opacity: 1,
      duration: 0.9,
      ease: 'power3.out',
      stagger: 0.08,
      scrollTrigger: {
        trigger: container,
        start: 'top 85%',
        end: 'top 45%',
        scrub: 0.4,
        once: true
      }
    });
  });
}

// ============================================
// IMAGE REVEALS
// ============================================
function initImageRevealAnimations() {
  document.querySelectorAll('.image-reveal').forEach(el => {
    gsap.fromTo(el, {
      clipPath: 'inset(100% 0 0 0)',
      scale: 1.12,
      y: 30
    }, {
      clipPath: 'inset(0% 0 0 0)',
      scale: 1,
      y: 0,
      duration: 1.4,
      ease: 'power4.inOut',
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        end: 'top 35%',
        scrub: 0.6,
        once: true
      }
    });
  });
}

// ============================================
// PARALLAX
// ============================================
function initParallaxScroll() {
  if (window.matchMedia('(pointer: coarse)').matches) return;

  document.querySelectorAll('[data-parallax]').forEach(el => {
    const speed = parseFloat(el.dataset.parallax) || 0.1;
    gsap.to(el, {
      y: () => speed * 250,
      ease: 'none',
      scrollTrigger: {
        trigger: el,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
      }
    });
  });
}

// ============================================
// STAT COUNTERS
// ============================================
function initCounterAnimations() {
  document.querySelectorAll('.stat-number[data-count]').forEach(el => {
    const target = parseInt(el.dataset.count, 10);
    if (isNaN(target)) return;

    const obj = { value: 0 };
    gsap.to(obj, {
      value: target,
      duration: 2.2,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        once: true
      },
      onUpdate: () => {
        el.textContent = Math.round(obj.value);
      }
    });
  });
}

// ============================================
// QUOTE SECTION
// ============================================
function initQuoteScrollAnimation() {
  const quote = document.querySelector('.quote-section blockquote');
  if (!quote) return;

  const heading = quote.querySelector('[data-split-text]');
  const cite = quote.querySelector('cite');

  if (heading) {
    const { elements: chars } = splitElement(heading);
    if (chars.length > 0) {
      gsap.set(chars, {
        y: '120%',
        opacity: 0,
        rotateX: -80,
        transformOrigin: 'center bottom'
      });

      gsap.to(chars, {
        y: '0%',
        opacity: 1,
        rotateX: 0,
        duration: 1.3,
        ease: 'expo.out',
        stagger: {
          each: 0.015,
          from: 'start'
        },
        scrollTrigger: {
          trigger: quote,
          start: 'top 80%',
          end: 'top 30%',
          scrub: 0.7,
          once: true
        }
      });
    }
  }

  if (cite) {
    gsap.fromTo(cite,
      { y: 20, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.9,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: quote,
          start: 'top 55%',
          end: 'top 25%',
          scrub: 0.3,
          once: true
        }
      }
    );
  }
}

// ============================================
// CTA SECTION
// ============================================
function initCTAScrollAnimation() {
  const section = document.querySelector('.cta-section');
  if (!section) return;

  const cta = section.querySelector('.cta');
  const heading = section.querySelector('[data-split-text]');

  if (cta) {
    gsap.fromTo(cta,
      { y: 50, opacity: 0, scale: 0.96 },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 80%',
          end: 'top 35%',
          scrub: 0.5,
          once: true
        }
      }
    );
  }

  if (heading) {
    const { elements: words } = splitElement(heading);
    if (words.length > 0) {
      gsap.set(words, {
        y: '110%',
        opacity: 0,
        rotateX: -70,
        transformOrigin: 'center bottom'
      });

      gsap.to(words, {
        y: '0%',
        opacity: 1,
        rotateX: 0,
        duration: 1.2,
        ease: 'expo.out',
        stagger: {
          each: 0.06,
          from: 'center'
        },
        scrollTrigger: {
          trigger: section,
          start: 'top 75%',
          end: 'top 30%',
          scrub: 0.6,
          once: true
        }
      });
    }
  }
}

// ============================================
// BOOKS PAGE — book cards stagger
// ============================================
function initBooksAnimations() {
  const showcase = document.querySelector('.books-showcase');
  if (!showcase) return;

  const cards = showcase.querySelectorAll('.book-card');
  if (cards.length === 0) return;

  gsap.fromTo(cards, {
    y: 60,
    opacity: 0,
    rotateY: 15,
    transformOrigin: 'center center'
  }, {
    y: 0,
    opacity: 1,
    rotateY: 0,
    duration: 1.2,
    ease: 'power3.out',
    stagger: 0.15,
    scrollTrigger: {
      trigger: showcase,
      start: 'top 80%',
      end: 'top 40%',
      scrub: 0.5,
      once: true
    }
  });
}

// ============================================
// MEDIA PAGE — video cards
// ============================================
function initMediaAnimations() {
  const videoGrid = document.querySelector('.video-grid');
  if (!videoGrid) return;

  const cards = videoGrid.querySelectorAll('.video-card');
  if (cards.length === 0) return;

  gsap.fromTo(cards, {
    y: 40,
    opacity: 0,
    scale: 0.97
  }, {
    y: 0,
    opacity: 1,
    scale: 1,
    duration: 1,
    ease: 'power3.out',
    stagger: 0.1,
    scrollTrigger: {
      trigger: videoGrid,
      start: 'top 85%',
      end: 'top 45%',
      scrub: 0.4,
      once: true
    }
  });
}

// ============================================
// SPEAKING PAGE — topic cards
// ============================================
function initSpeakingAnimations() {
  const topicsGrid = document.querySelector('.topics-grid');
  if (!topicsGrid) return;

  const cards = topicsGrid.querySelectorAll('.topic-card');
  if (cards.length === 0) return;

  gsap.fromTo(cards, {
    y: 35,
    opacity: 0
  }, {
    y: 0,
    opacity: 1,
    duration: 1,
    ease: 'power3.out',
    stagger: 0.1,
    scrollTrigger: {
      trigger: topicsGrid,
      start: 'top 85%',
      end: 'top 45%',
      scrub: 0.4,
      once: true
    }
  });
}

// ============================================
// INIT
// ============================================
function initGSAPAnimations() {
  // Small delay to ensure DOM is fully ready
  requestAnimationFrame(() => {
    initHeroEntrance();
    initScrollWordAnimations();
    initScrollRevealAnimations();
    initStaggerScrollAnimations();
    initImageRevealAnimations();
    initParallaxScroll();
    initCounterAnimations();
    initQuoteScrollAnimation();
    initCTAScrollAnimation();
    initBooksAnimations();
    initMediaAnimations();
    initSpeakingAnimations();
    initScrollVelocitySkew();
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initGSAPAnimations);
} else {
  initGSAPAnimations();
}
