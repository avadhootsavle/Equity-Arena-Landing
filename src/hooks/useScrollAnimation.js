import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Reusable custom hook for React-safe GSAP + ScrollTrigger animations.
 * Configured specifically for Equity Arena section hierarchy & class markup:
 * - #home (Hero entrance + terminal slide-in + spiderweb line reveal + background parallax)
 * - #features, #news, #about (Section intros + batch card grid reveals)
 * - Automatic image/font load ScrollTrigger.refresh()
 * - prefers-reduced-motion fallback (opacity-only fade, y: 0)
 * - Complete unmount cleanup via gsap.context().revert()
 */
export function useScrollAnimation() {
  const containerRef = useRef(null);

  useEffect(() => {
    // Check user preference for reduced motion
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    // Handle image/font load refresh for position calculations
    const handleLoadRefresh = () => {
      ScrollTrigger.refresh();
    };
    window.addEventListener('load', handleLoadRefresh);

    const ctx = gsap.context(() => {
      // ----------------------------------------------------------------
      // REDUCED MOTION FALLBACK: Fade opacity only, no Y translation
      // ----------------------------------------------------------------
      if (prefersReducedMotion) {
        gsap.set(
          '[data-gsap="hero"], #gsap-hero-terminal, [data-gsap="section"], [data-gsap="heading"], .gsap-trigger-card, .layer-3d, [data-gsap="stat-count"]',
          { opacity: 1, y: 0, scale: 1 }
        );
        return;
      }

      // ----------------------------------------------------------------
      // 1. HERO (#home): Page-Load Entrance (Not Scroll-Triggered)
      // ----------------------------------------------------------------
      const heroText = containerRef.current?.querySelectorAll('[data-gsap="hero"]');
      if (heroText && heroText.length > 0) {
        gsap.fromTo(
          heroText,
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

      // Hero Trading Terminal Card (#gsap-hero-terminal) — slight delay after heading
      const heroTerminal = containerRef.current?.querySelector('#gsap-hero-terminal');
      if (heroTerminal) {
        gsap.fromTo(
          heroTerminal,
          { opacity: 0, y: 30, scale: 0.96 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.85,
            delay: 0.35,
            ease: 'power2.out',
          }
        );
      }

      // Hero Side Spiderweb Line (#gsap-spiderweb-line) — stroke/height draw reveal
      const spiderwebLine = containerRef.current?.querySelector('#gsap-spiderweb-line');
      if (spiderwebLine) {
        gsap.fromTo(
          spiderwebLine,
          { height: '0%' },
          {
            height: '100%',
            duration: 1.2,
            delay: 0.5,
            ease: 'power2.out',
          }
        );
      }

      // Hero Background Ambient Parallax
      const parallaxEls = containerRef.current?.querySelectorAll('[data-gsap="parallax"]');
      parallaxEls?.forEach((el) => {
        gsap.to(el, {
          yPercent: 18,
          ease: 'none',
          scrollTrigger: {
            trigger: el.parentElement || el,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        });
      });

      // ----------------------------------------------------------------
      // 2. SECTION INTRO BLOCKS (Badge + Heading Wrappers)
      // ----------------------------------------------------------------
      const sectionIntros = containerRef.current?.querySelectorAll(
        '[data-gsap="heading"], section > div > div:first-child'
      );
      sectionIntros?.forEach((intro) => {
        gsap.fromTo(
          intro,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: intro,
              start: 'top 85%',
              toggleActions: 'play none none none',
              once: true,
            },
          }
        );
      });

      // ----------------------------------------------------------------
      // 3. CARD GRIDS (.stage-3d .layer-3d & .gsap-trigger-card)
      // ----------------------------------------------------------------
      const gridCards = containerRef.current?.querySelectorAll(
        '.gsap-trigger-card, .stage-3d .layer-3d, [data-gsap="card"]'
      );
      if (gridCards && gridCards.length > 0) {
        ScrollTrigger.batch(gridCards, {
          start: 'top 85%',
          once: true,
          onEnter: (batch) => {
            gsap.fromTo(
              batch,
              { opacity: 0, y: 28 },
              {
                opacity: 1,
                y: 0,
                duration: 0.7,
                ease: 'power2.out',
                stagger: 0.12,
                overwrite: 'auto',
              }
            );
          },
        });
      }

      // ----------------------------------------------------------------
      // 4. STATS COUNT-UP NUMBERS
      // ----------------------------------------------------------------
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

    return () => {
      window.removeEventListener('load', handleLoadRefresh);
      ctx.revert();
    };
  }, []);

  const refreshScrollTrigger = () => {
    ScrollTrigger.refresh();
  };

  return { containerRef, refreshScrollTrigger };
}
