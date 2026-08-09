import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Peter Parker Origin Scrollytelling Hook (GSAP ScrollTrigger Pin + Scrub)
 * Uses explicit React refs to target sections and elements to avoid stale DOM queries.
 */
export function useScrollAnimation(homeRef, aboutRef, featuresRef, newsRef) {
  // 1. Refresh ScrollTrigger once fonts and images are fully loaded
  useEffect(() => {
    const handleLoadRefresh = () => {
      ScrollTrigger.refresh();
    };

    window.addEventListener('load', handleLoadRefresh);
    // Trigger an initial refresh after a short delay for React mounting
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 500);

    return () => {
      window.removeEventListener('load', handleLoadRefresh);
      clearTimeout(timer);
    };
  }, []);

  // 2. Main ScrollTrigger setup
  useEffect(() => {
    // Check for prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    // Use gsap.context to ensure proper scoped selectors and cleanup
    // We scope to a combined hook context, targeting each ref context.
    const ctx = gsap.context(() => {
      // ----------------------------------------------------
      // Prefers Reduced Motion Fallback
      // ----------------------------------------------------
      if (prefersReducedMotion) {
        // Simple instant reveals, no pinning or scrubbing
        if (homeRef.current) {
          gsap.set(homeRef.current.querySelectorAll('[data-gsap="hero"]'), { opacity: 1, y: 0 });
        }
        if (aboutRef.current) {
          gsap.set(aboutRef.current.querySelectorAll('[data-gsap="step-card"]'), { opacity: 1, scale: 1 });
          const line = aboutRef.current.querySelector('#gsap-about-line');
          if (line) gsap.set(line, { scaleX: 1 });
        }
        if (featuresRef.current) {
          gsap.set(featuresRef.current.querySelectorAll('[data-gsap="card"]'), { opacity: 1, scale: 1, x: 0, y: 0, rotate: 0 });
        }
        if (newsRef.current) {
          gsap.set(newsRef.current.querySelectorAll('[data-gsap="card"]'), { opacity: 1, y: 0 });
        }
        return;
      }

      const mm = gsap.matchMedia();

      // ====================================================
      // DESKTOP ANIMATIONS (Width >= 768px)
      // ====================================================
      mm.add("(min-width: 768px)", () => {
        // --- 1. Hero Section (#home) Ordinary Guy ---
        if (homeRef.current) {
          const heroText = homeRef.current.querySelectorAll('[data-gsap="hero"]');
          const heroTerminal = homeRef.current.querySelector('#gsap-hero-terminal');
          const spiderwebLine = homeRef.current.querySelector('#gsap-spiderweb-line');

          // Desaturated on load flat entrance
          gsap.fromTo(
            heroText,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out', stagger: 0.12 }
          );

          if (heroTerminal) {
            gsap.fromTo(
              heroTerminal,
              { opacity: 0, y: 20 },
              { opacity: 1, y: 0, duration: 0.8, delay: 0.25, ease: 'power2.out' }
            );
          }

          if (spiderwebLine) {
            gsap.fromTo(
              spiderwebLine,
              { height: '0%' },
              { height: '100%', duration: 1.0, delay: 0.4, ease: 'power2.out' }
            );
          }

          // Color-shift scrub: desaturated -> saturated as user scrolls to #about
          if (aboutRef.current) {
            gsap.fromTo(
              homeRef.current,
              { filter: 'saturate(0.15)', opacity: 0.85 },
              {
                filter: 'saturate(1.0)',
                opacity: 1,
                ease: 'none',
                scrollTrigger: {
                  trigger: homeRef.current,
                  endTrigger: aboutRef.current,
                  start: 'bottom bottom',
                  end: 'top top',
                  scrub: 1,
                },
              }
            );
          }
        }

        // --- 2. About Section (#about) Pinned Scrollytelling ---
        if (aboutRef.current) {
          const stepCards = aboutRef.current.querySelectorAll('[data-gsap="step-card"]');
          const stepLine = aboutRef.current.querySelector('#gsap-about-line');
          const biteOverlay = document.querySelector('#gsap-bite-overlay');

          if (stepCards && stepCards.length > 0) {
            const aboutTl = gsap.timeline({
              scrollTrigger: {
                trigger: aboutRef.current,
                start: 'top top',
                end: '+=150%',
                pin: true,
                scrub: 1,
                anticipatePin: 1,
              },
            });

            // Set initial state
            gsap.set(stepCards, { opacity: 0.15, scale: 0.95 });
            if (stepLine) gsap.set(stepLine, { scaleX: 0, transformOrigin: 'left center' });

            aboutTl
              // Step 1
              .to(stepCards[0], { opacity: 1, scale: 1.05, duration: 0.5 })
              .to(stepLine, { scaleX: 0.33, duration: 0.5, ease: 'none' }, '<')
              
              // Step 2
              .to(stepCards[0], { opacity: 0.25, scale: 0.98, duration: 0.3 }, '+=0.3')
              .to(stepCards[1], { opacity: 1, scale: 1.05, duration: 0.5 }, '<')
              .to(stepLine, { scaleX: 0.66, duration: 0.5, ease: 'none' }, '<')

              // Step 3
              .to(stepCards[1], { opacity: 0.25, scale: 0.98, duration: 0.3 }, '+=0.3')
              .to(stepCards[2], { opacity: 1, scale: 1.05, duration: 0.5 }, '<')
              .to(stepLine, { scaleX: 0.9, duration: 0.5, ease: 'none' }, '<')

              // Step 4
              .to(stepCards[2], { opacity: 0.25, scale: 0.98, duration: 0.3 }, '+=0.3')
              .to(stepCards[3], { opacity: 1, scale: 1.05, duration: 0.5 }, '<')
              .to(stepLine, { scaleX: 1.0, duration: 0.5, ease: 'none' }, '<');

            // Screen-wide flash overlay at the end
            if (biteOverlay) {
              aboutTl.to(
                biteOverlay,
                { opacity: 0.35, duration: 0.2, yoyo: true, repeat: 1, ease: 'power2.inOut' },
                '+=0.1'
              );
            }
          }
        }

        // --- 3. Features Section (#features) Powers Awakened ---
        if (featuresRef.current) {
          const featureCards = featuresRef.current.querySelectorAll('[data-gsap="card"]');
          
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
                      ease: 'back.out(1.4)',
                    }
                  );
                });
              },
            });
          }

          // Corner Web SVG strand draw-in
          const cornerWebs = featuresRef.current.querySelectorAll('[data-gsap="corner-web"]');
          cornerWebs?.forEach((cornerWeb) => {
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
                    trigger: featuresRef.current,
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
                    scrollTrigger: { trigger: featuresRef.current, start: 'top 75%', once: true },
                  }
                );
              }
            });
          });
        }

        // --- 4. News Section (#news) Mastery ---
        if (newsRef.current) {
          const newsCards = newsRef.current.querySelectorAll('[data-gsap="card"]');
          const newsTicker = newsRef.current.querySelector('[data-gsap="news-ticker"]');

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
                trigger: newsRef.current,
                start: 'top 80%',
                once: true,
              },
            }
          );

          // Subtle horizontal drift and glow on the news ticker tape
          if (newsTicker) {
            gsap.to(newsTicker, {
              x: 15,
              filter: 'drop-shadow(0 0 8px rgba(59,130,246,0.3))',
              ease: 'none',
              scrollTrigger: {
                trigger: newsRef.current,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1,
              },
            });
          }
        }
      });

      // ====================================================
      // MOBILE ANIMATIONS (Width < 768px) - NO PINNING
      // ====================================================
      mm.add("(max-width: 767px)", () => {
        // Hero Section Mobile
        if (homeRef.current) {
          const heroText = homeRef.current.querySelectorAll('[data-gsap="hero"]');
          gsap.fromTo(
            heroText,
            { opacity: 0, y: 15 },
            { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out', stagger: 0.1 }
          );
        }

        // About Section Mobile (No pinning, simple scroll in view)
        if (aboutRef.current) {
          const stepCards = aboutRef.current.querySelectorAll('[data-gsap="step-card"]');
          gsap.fromTo(
            stepCards,
            { opacity: 0, y: 20 },
            {
              opacity: 1,
              y: 0,
              duration: 0.6,
              stagger: 0.15,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: aboutRef.current,
                start: 'top 85%',
                once: true,
              },
            }
          );
        }

        // Features Section Mobile
        if (featuresRef.current) {
          const featureCards = featuresRef.current.querySelectorAll('[data-gsap="card"]');
          gsap.fromTo(
            featureCards,
            { opacity: 0, y: 20 },
            {
              opacity: 1,
              y: 0,
              duration: 0.6,
              stagger: 0.1,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: featuresRef.current,
                start: 'top 85%',
                once: true,
              },
            }
          );
        }

        // News Section Mobile
        if (newsRef.current) {
          const newsCards = newsRef.current.querySelectorAll('[data-gsap="card"]');
          gsap.fromTo(
            newsCards,
            { opacity: 0, y: 20 },
            {
              opacity: 1,
              y: 0,
              duration: 0.6,
              stagger: 0.1,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: newsRef.current,
                start: 'top 85%',
                once: true,
              },
            }
          );
        }
      });
    });

    return () => {
      ctx.revert();
    };
  }, [homeRef, aboutRef, featuresRef, newsRef]);
}
