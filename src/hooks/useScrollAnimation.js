import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Reusable custom hook for React-safe GSAP + ScrollTrigger animations.
 * Features:
 * - Automatic cleanup via gsap.context() on unmount (no memory leaks)
 * - Accessibility support for prefers-reduced-motion
 * - Page-load entrance for Hero
 * - ScrollTrigger.batch() for card grids
 * - Section reveals at 80% viewport height (play once)
 * - Section heading scale-in (0.9 -> 1)
 * - Stats number count-up animations
 * - Parallax background scrubbing
 */
export function useScrollAnimation() {
  const containerRef = useRef(null);

  useEffect(() => {
    // Respect user's motion preferences
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        // If reduced motion is preferred, force opacity to 1 immediately with no movement
        gsap.set(
          '[data-gsap="hero"], [data-gsap="section"], [data-gsap="heading"], [data-gsap="card"], [data-gsap="stat-count"]',
          { opacity: 1, y: 0, scale: 1 }
        );
        return;
      }

      // 1. HERO SECTION: Page-load entrance (fade + upward slide)
      const heroEls = containerRef.current?.querySelectorAll('[data-gsap="hero"]');
      if (heroEls && heroEls.length > 0) {
        gsap.fromTo(
          heroEls,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power2.out',
            stagger: 0.15,
          }
        );
      }

      // 2. HERO PARALLAX BACKGROUND: Subtle scrub parallax
      const parallaxEls = containerRef.current?.querySelectorAll('[data-gsap="parallax"]');
      parallaxEls?.forEach((el) => {
        gsap.to(el, {
          yPercent: 20,
          ease: 'none',
          scrollTrigger: {
            trigger: el.parentElement || el,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        });
      });

      // 3. SUBSEQUENT SECTIONS: Fade in + translateY(40px -> 0), start: "top 80%", play once
      const sectionEls = containerRef.current?.querySelectorAll('[data-gsap="section"]');
      sectionEls?.forEach((sec) => {
        gsap.fromTo(
          sec,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: sec,
              start: 'top 80%',
              toggleActions: 'play none none none',
              once: true,
            },
          }
        );
      });

      // 4. SECTION HEADINGS: Scale-in (0.9 -> 1) + fade
      const headingEls = containerRef.current?.querySelectorAll('[data-gsap="heading"]');
      headingEls?.forEach((heading) => {
        gsap.fromTo(
          heading,
          { opacity: 0, scale: 0.9, y: 20 },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.7,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: heading,
              start: 'top 82%',
              toggleActions: 'play none none none',
              once: true,
            },
          }
        );
      });

      // 5. CARD/GRID ELEMENTS: ScrollTrigger.batch() with 0.12s stagger
      const cardEls = containerRef.current?.querySelectorAll('[data-gsap="card"]');
      if (cardEls && cardEls.length > 0) {
        ScrollTrigger.batch(cardEls, {
          start: 'top 85%',
          once: true,
          onEnter: (batch) => {
            gsap.fromTo(
              batch,
              { opacity: 0, y: 40 },
              {
                opacity: 1,
                y: 0,
                duration: 0.65,
                ease: 'power2.out',
                stagger: 0.12,
                overwrite: 'auto',
              }
            );
          },
        });
      }

      // 6. STATS / NUMBERS: Animate counting up from 0 when scrolled into view
      const statEls = containerRef.current?.querySelectorAll('[data-gsap="stat-count"]');
      statEls?.forEach((statEl) => {
        const targetVal = parseFloat(statEl.getAttribute('data-target') || '0');
        const prefix = statEl.getAttribute('data-prefix') || '';
        const suffix = statEl.getAttribute('data-suffix') || '';
        const isInt = Number.isInteger(targetVal);

        const obj = { val: 0 };

        gsap.to(obj, {
          val: targetVal,
          duration: 1.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: statEl,
            start: 'top 85%',
            once: true,
          },
          onUpdate: () => {
            const formatted = isInt
              ? Math.floor(obj.val).toLocaleString('en-IN')
              : obj.val.toFixed(2);
            statEl.textContent = `${prefix}${formatted}${suffix}`;
          },
        });
      });
    }, containerRef);

    // Clean up all GSAP animations and ScrollTrigger instances on unmount
    return () => {
      ctx.revert();
    };
  }, []);

  // Helper to trigger ScrollTrigger.refresh() manually when dynamic content or images finish loading
  const refreshScrollTrigger = () => {
    ScrollTrigger.refresh();
  };

  return { containerRef, refreshScrollTrigger };
}
