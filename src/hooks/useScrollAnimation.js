import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Peter Parker Origin Scrollytelling Hook (GSAP ScrollTrigger Pin + Scrub)
 * 
 * Story Arc:
 * ACT 1 — #home (ORDINARY GUY): Muted base, flat entrance, scrubbed color-shift saturation as user scrolls to #about.
 * ACT 2 — #about (THE BITE / GAINING POWERS): Pinned 4-step sequence (desktop only, +=180% scroll distance).
 *         Steps awaken one-by-one with line draw & icon pulse. Step 4 triggers full-bleed "Bite" radial impact flash.
 * ACT 3 — #features (USING POWERS): Energetic diagonal "web-shot" card yanks with back.out(1.4) snap & SVG strand draws.
 * ACT 4 — #news (FULL HERO / MASTERY): Calm, controlled entrance with velocity scrub drift.
 * 
 * Technical Safety:
 * - Desktop pinning enabled only above 768px width (mobile falls back to standard non-pinned reveals).
 * - Complete React cleanup via gsap.context().revert() on unmount.
 * - Automatic ScrollTrigger.refresh() on image/font loads.
 * - prefers-reduced-motion: opacity-only fade with zero pin/scrub.
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
      // ACCESSIBILITY FALLBACK: Reduced Motion Mode
      // ----------------------------------------------------------------
      if (prefersReducedMotion) {
        gsap.set(
          '[data-gsap="hero"], #gsap-hero-terminal, [data-gsap="section"], [data-gsap="heading"], .gsap-trigger-card, .layer-3d, [data-gsap="step-card"], [data-gsap="stat-count"], [data-gsap="corner-web"]',
          { opacity: 1, x: 0, y: 0, scale: 1, filter: 'none' }
        );
        return;
      }

      // ================================================================
      // ACT 1 — #home (ORDINARY GUY -> THE BUILD)
      // ================================================================
      // 1. Initial Page-Load: Deliberately flat, unadorned entrance (Before Powers)
      const heroText = containerRef.current?.querySelectorAll('[data-gsap="hero"]');
      if (heroText && heroText.length > 0) {
        gsap.fromTo(
          heroText,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power2.out',
            stagger: 0.12,
          }
        );
      }

      const heroTerminal = containerRef.current?.querySelector('#gsap-hero-terminal');
      if (heroTerminal) {
        gsap.fromTo(
          heroTerminal,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            delay: 0.25,
            ease: 'power2.out',
          }
        );
      }

      const spiderwebLine = containerRef.current?.querySelector('#gsap-spiderweb-line');
      if (spiderwebLine) {
        gsap.fromTo(
          spiderwebLine,
          { height: '0%' },
          {
            height: '100%',
            duration: 1.0,
            delay: 0.4,
            ease: 'power2.out',
          }
        );
      }

      // 2. Act 1 -> Act 2 Color-Shift Scrub (Saturating red/blue as user scrolls away from #home)
      const homeBg = containerRef.current?.querySelector('#home');
      if (homeBg) {
        gsap.fromTo(
          homeBg,
          { filter: 'saturate(0.25)', opacity: 0.85 },
          {
            filter: 'saturate(1.25)',
            opacity: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: homeBg,
              start: 'top top',
              end: 'bottom top',
              scrub: 0.5,
            },
          }
        );
      }

      // ================================================================
      // ACT 2 — #about (THE BITE / GAINING POWERS) — Pinned Sequence
      // ================================================================
      const stepCards = containerRef.current?.querySelectorAll('[data-gsap="step-card"]');
      const stepLine = containerRef.current?.querySelector('#gsap-about-line');
      const biteOverlay = containerRef.current?.querySelector('#gsap-bite-overlay');

      if (!isMobile && stepCards && stepCards.length > 0) {
        // DESKTOP PINNED SCROLLYTELLING TIMELINE (+=180% Scroll Distance)
        // Scroll distance math: 180% of viewport height gives each of the 4 steps
        // ~45% of viewport scroll distance to illuminate, pulse, and draw connecting line
        const aboutTl = gsap.timeline({
          scrollTrigger: {
            trigger: '#about',
            start: 'top top',
            end: '+=180%',
            pin: true,
            scrub: 1,
            anticipatePin: 1,
          },
        });

        // Initial State: Dim all steps to 0.3 opacity (powers unawakened)
        gsap.set(stepCards, { opacity: 0.3, scale: 0.96 });
        if (stepLine) gsap.set(stepLine, { scaleX: 0, transformOrigin: 'left center' });

        // Step 01 Awakening
        aboutTl
          .to(stepCards[0], { opacity: 1, scale: 1.04, duration: 0.4, ease: 'power2.out' }, 'step1')
          .to(stepLine, { scaleX: 0.33, duration: 0.4, ease: 'none' }, 'step1');

        // Step 02 Awakening
        if (stepCards[1]) {
          aboutTl
            .to(stepCards[0], { scale: 1, opacity: 0.5, duration: 0.3 }, 'step2')
            .to(stepCards[1], { opacity: 1, scale: 1.04, duration: 0.4, ease: 'power2.out' }, 'step2')
            .to(stepLine, { scaleX: 0.66, duration: 0.4, ease: 'none' }, 'step2');
        }

        // Step 03 Awakening
        if (stepCards[2]) {
          aboutTl
            .to(stepCards[1], { scale: 1, opacity: 0.5, duration: 0.3 }, 'step3')
            .to(stepCards[2], { opacity: 1, scale: 1.04, duration: 0.4, ease: 'power2.out' }, 'step3')
            .to(stepLine, { scaleX: 0.9, duration: 0.4, ease: 'none' }, 'step3');
        }

        // Step 04 Awakening & "THE BITE" Impact Flash
        if (stepCards[3]) {
          aboutTl
            .to(stepCards[2], { scale: 1, opacity: 0.5, duration: 0.3 }, 'step4')
            .to(stepCards[3], { opacity: 1, scale: 1.06, duration: 0.4, ease: 'power2.out' }, 'step4')
            .to(stepLine, { scaleX: 1.0, duration: 0.4, ease: 'none' }, 'step4');

          if (biteOverlay) {
            aboutTl.to(
              biteOverlay,
              { opacity: 0.35, duration: 0.2, yoyo: true, repeat: 1, ease: 'power2.inOut' },
              'step4+=0.2'
            );
          }
        }
      } else {
        // MOBILE FALLBACK: Non-pinned standard reveal under 768px
        if (stepCards) {
          gsap.fromTo(
            stepCards,
            { opacity: 0, y: 30 },
            {
              opacity: 1,
              y: 0,
              duration: 0.7,
              stagger: 0.15,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: '#about',
                start: 'top 80%',
                once: true,
              },
            }
          );
        }
      }

      // ================================================================
      // ACT 3 — #features (USING THE POWERS — Web-Shot Cards)
      // ================================================================
      const featureCards = containerRef.current?.querySelectorAll(
        '#features .gsap-trigger-card, #features .layer-3d, #features [data-gsap="card"]'
      );
      if (featureCards && featureCards.length > 0) {
        ScrollTrigger.batch(featureCards, {
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
                  ease: isMobile ? 'power2.out' : 'back.out(1.4)',
                  overwrite: 'auto',
                }
              );
            });
          },
        });
      }

      // Act 3 Corner Web SVGs Strand Draw-In
      const cornerWebs = containerRef.current?.querySelectorAll('[data-gsap="corner-web"]');
      cornerWebs?.forEach((cornerWeb) => {
        const section = cornerWeb.closest('section') || cornerWeb.parentElement;
        const paths = cornerWeb.querySelectorAll('path');
        paths.forEach((path) => {
          try {
            const length = path.getTotalLength() || 200;
            gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
            gsap.to(path, {
              strokeDashoffset: 0,
              duration: 0.8,
              stagger: 0.05,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: section,
                start: 'top 75%',
                once: true,
              },
            });
          } catch (_) {
            gsap.fromTo(
              path,
              { opacity: 0 },
              {
                opacity: 1,
                duration: 0.5,
                scrollTrigger: { trigger: section, start: 'top 75%', once: true },
              }
            );
          }
        });

        // Corner web subtle scrub drift
        gsap.to(cornerWeb, {
          y: -14,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        });
      });

      // ================================================================
      // ACT 4 — #news (FULL HERO / MASTERY — Controlled Power)
      // ================================================================
      const newsSection = containerRef.current?.querySelector('#news');
      if (newsSection) {
        const newsCards = newsSection.querySelectorAll('[data-gsap="card"], .glow-ring');
        gsap.fromTo(
          newsCards,
          { opacity: 0, y: 25 },
          {
            opacity: 1,
            y: 0,
            duration: 0.75,
            stagger: 0.15,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: newsSection,
              start: 'top 80%',
              once: true,
            },
          }
        );

        // Continuous scrubbed ticker velocity drift on news cards
        gsap.to(newsCards, {
          x: 10,
          ease: 'none',
          scrollTrigger: {
            trigger: newsSection,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.5,
          },
        });
      }

      // Stat Counters Count-up + Scale-Punch
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
