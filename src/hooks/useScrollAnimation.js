import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Spider-Man Web-Sling Scroll Animation Hook (GSAP + ScrollTrigger)
 * 
 * Mechanics:
 * 1. HERO SWING-IN: Hero heading & terminal swing in on web lines with elastic/back overshoot
 * 2. CORNER WEB DRAW-IN: SVG corner web paths draw themselves strand-by-strand on section entry
 * 3. WEB-SHOT CARD REVEAL: Cards in grid yank in diagonally from web-shot points with back.out(1.4) snap
 * 4. PARALLAX CORNER WEBS: Corner webs drift slightly opposite to scroll direction
 * 5. STAT IMPACT PUNCH: Number counters punch scale (1 -> 1.12 -> 1) on web impact completion
 * 6. ACCESSIBILITY & MOBILE: Respects prefers-reduced-motion & caps overshoot easing on mobile screens
 */
export function useScrollAnimation() {
  const containerRef = useRef(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    const isMobile = window.innerWidth < 768;

    const handleLoadRefresh = () => {
      ScrollTrigger.refresh();
    };
    window.addEventListener('load', handleLoadRefresh);

    const ctx = gsap.context(() => {
      // ----------------------------------------------------------------
      // ACCESSIBILITY: Reduced Motion Fallback
      // ----------------------------------------------------------------
      if (prefersReducedMotion) {
        gsap.set(
          '[data-gsap="hero"], #gsap-hero-terminal, [data-gsap="section"], [data-gsap="heading"], .gsap-trigger-card, .layer-3d, [data-gsap="stat-count"], [data-gsap="corner-web"]',
          { opacity: 1, x: 0, y: 0, scale: 1, rotate: 0 }
        );
        return;
      }

      const snapEase = isMobile ? 'power2.out' : 'back.out(1.4)';

      // ----------------------------------------------------------------
      // 1. HERO SECTION (#home): Web-Swing Entrance (Page Load)
      // ----------------------------------------------------------------
      const heroHeading = containerRef.current?.querySelector('[data-gsap="hero"]');
      if (heroHeading) {
        gsap.fromTo(
          heroHeading,
          { opacity: 0, x: -60, rotate: -6, transformOrigin: 'top left' },
          {
            opacity: 1,
            x: 0,
            rotate: 0,
            duration: 0.9,
            ease: isMobile ? 'power2.out' : 'back.out(1.5)',
          }
        );
      }

      const heroTerminal = containerRef.current?.querySelector('#gsap-hero-terminal');
      if (heroTerminal) {
        gsap.fromTo(
          heroTerminal,
          { opacity: 0, x: 60, scale: 0.9, rotate: 5, transformOrigin: 'top right' },
          {
            opacity: 1,
            x: 0,
            scale: 1,
            rotate: 0,
            duration: 0.95,
            delay: 0.2,
            ease: snapEase,
          }
        );
      }

      // Hero Spiderweb Line (#gsap-spiderweb-line)
      const spiderwebLine = containerRef.current?.querySelector('#gsap-spiderweb-line');
      if (spiderwebLine) {
        gsap.fromTo(
          spiderwebLine,
          { height: '0%' },
          {
            height: '100%',
            duration: 1.0,
            delay: 0.35,
            ease: 'power2.out',
          }
        );
      }

      // Hero Ambient Parallax
      const parallaxEls = containerRef.current?.querySelectorAll('[data-gsap="parallax"]');
      parallaxEls?.forEach((el) => {
        gsap.to(el, {
          yPercent: 15,
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
      // 2. CORNER WEB SVGs: Strand Draw-In Effect & Parallax
      // ----------------------------------------------------------------
      const sections = containerRef.current?.querySelectorAll('section, #home, #about, #features, #news');
      sections?.forEach((section) => {
        const cornerWebSvg = section.querySelector('[data-gsap="corner-web"]');
        if (cornerWebSvg) {
          const paths = cornerWebSvg.querySelectorAll('path');
          paths.forEach((path) => {
            try {
              const length = path.getTotalLength() || 200;
              gsap.set(path, {
                strokeDasharray: length,
                strokeDashoffset: length,
              });

              gsap.to(path, {
                strokeDashoffset: 0,
                duration: 0.8,
                stagger: 0.05,
                ease: 'power2.out',
                scrollTrigger: {
                  trigger: section,
                  start: 'top 75%',
                  toggleActions: 'play none none none',
                  once: true,
                },
              });
            } catch (_) {
              // Fallback for non-scalable elements
              gsap.fromTo(
                path,
                { opacity: 0 },
                {
                  opacity: 1,
                  duration: 0.5,
                  scrollTrigger: {
                    trigger: section,
                    start: 'top 75%',
                    once: true,
                  },
                }
              );
            }
          });

          // Scroll-linked Subtle Parallax on Corner Webs
          gsap.to(cornerWebSvg, {
            y: -12,
            ease: 'none',
            scrollTrigger: {
              trigger: section,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          });
        }
      });

      // ----------------------------------------------------------------
      // 3. SECTION INTRO HEADINGS: Web-Shot Entrance
      // ----------------------------------------------------------------
      const headings = containerRef.current?.querySelectorAll('[data-gsap="heading"]');
      headings?.forEach((heading) => {
        gsap.fromTo(
          heading,
          { opacity: 0, scale: 0.88, y: 35, rotate: -2 },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            rotate: 0,
            duration: 0.75,
            ease: snapEase,
            scrollTrigger: {
              trigger: heading,
              start: 'top 85%',
              toggleActions: 'play none none none',
              once: true,
            },
          }
        );
      });

      // ----------------------------------------------------------------
      // 4. CARD GRIDS: "Web-Shot" Alternating Diagonal Pull (ScrollTrigger.batch)
      // ----------------------------------------------------------------
      const cards = containerRef.current?.querySelectorAll(
        '.gsap-trigger-card, .stage-3d .layer-3d, [data-gsap="card"]'
      );
      if (cards && cards.length > 0) {
        ScrollTrigger.batch(cards, {
          start: 'top 82%',
          once: true,
          onEnter: (batch) => {
            batch.forEach((card, idx) => {
              const fromLeft = idx % 2 === 0;
              gsap.fromTo(
                card,
                {
                  opacity: 0,
                  scale: 0.85,
                  x: fromLeft ? -40 : 40,
                  y: 40,
                  rotate: fromLeft ? -3 : 3,
                },
                {
                  opacity: 1,
                  scale: 1,
                  x: 0,
                  y: 0,
                  rotate: 0,
                  duration: 0.7,
                  delay: idx * 0.1,
                  ease: snapEase,
                  overwrite: 'auto',
                }
              );
            });
          },
        });
      }

      // ----------------------------------------------------------------
      // 5. STATS COUNTERS: Count-Up + Web Impact Scale-Punch
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
          duration: 1.5,
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
          onComplete: () => {
            // Web impact scale-punch (1 -> 1.12 -> 1)
            if (!prefersReducedMotion) {
              gsap.to(statEl, {
                scale: 1.12,
                duration: 0.15,
                yoyo: true,
                repeat: 1,
                ease: 'power2.out',
              });
            }
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
