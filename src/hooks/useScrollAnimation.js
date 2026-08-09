import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Enhanced Peter Parker Origin Scrollytelling Hook (GSAP ScrollTrigger Pin + Scrub)
 * Integrates visual comic POP elements, Spidey-Sense alert waves, narrative text evolution, and 3D card tilt physics.
 */
export function useScrollAnimation(homeRef, aboutRef, featuresRef, newsRef) {
  // 1. Refresh ScrollTrigger once fonts and images are fully loaded
  useEffect(() => {
    const handleLoadRefresh = () => {
      ScrollTrigger.refresh();
    };

    window.addEventListener('load', handleLoadRefresh);
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 600);

    return () => {
      window.removeEventListener('load', handleLoadRefresh);
      clearTimeout(timer);
    };
  }, []);

  // 2. Main ScrollTrigger setup
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        // Reduced Motion Fallback
        if (homeRef.current) {
          gsap.set(homeRef.current.querySelectorAll('[data-gsap="hero"]'), { opacity: 1, y: 0 });
        }
        if (aboutRef.current) {
          gsap.set(aboutRef.current.querySelectorAll('[data-gsap="step-card"]'), { opacity: 1, scale: 1 });
          const line = aboutRef.current.querySelector('#gsap-about-line');
          if (line) gsap.set(line, { scaleX: 1 });
          const story = aboutRef.current.querySelector('#gsap-about-story');
          if (story) story.textContent = "STORY: Peter Parker logs in and becomes a trading legend.";
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

          // Color-shift scrub: Only desaturate the background parallax glows/grids, leaving text/buttons fully colorful
          if (aboutRef.current) {
            const homeParallax = homeRef.current.querySelector('[data-gsap="parallax"]');
            if (homeParallax) {
              gsap.fromTo(
                homeParallax,
                { filter: 'saturate(0.15)', opacity: 0.6 },
                {
                  filter: 'saturate(1.25)',
                  opacity: 1,
                  ease: 'none',
                  scrollTrigger: {
                    trigger: homeRef.current,
                    start: 'top top',
                    end: 'bottom center', // Fully saturated by the time user scrolls halfway down the hero
                    scrub: 0.5,
                  },
                }
              );
            }
          }
        }

        // --- 2. About Section (#about) Pinned Scrollytelling + Narrative ---
        if (aboutRef.current) {
          const stepCards = aboutRef.current.querySelectorAll('[data-gsap="step-card"]');
          const stepLine = aboutRef.current.querySelector('#gsap-about-line');
          const biteOverlay = document.querySelector('#gsap-bite-overlay');
          const storyText = aboutRef.current.querySelector('#gsap-about-story');

          // Comic Popups
          const comicThwip = aboutRef.current.querySelector('#gsap-comic-thwip');
          const comicBzzzt = aboutRef.current.querySelector('#gsap-comic-bzzzt');
          const comicSwing = aboutRef.current.querySelector('#gsap-comic-swing');
          const comicBoom = aboutRef.current.querySelector('#gsap-comic-boom');

          // Spidey-Sense Halo Alerts
          const senseLeft = document.querySelector('#gsap-spidey-sense-left');
          const senseRight = document.querySelector('#gsap-spidey-sense-right');

          if (stepCards && stepCards.length > 0) {
            const aboutTl = gsap.timeline({
              scrollTrigger: {
                trigger: aboutRef.current,
                start: 'top top',
                end: '+=180%',
                pin: true,
                scrub: 1,
                anticipatePin: 1,
              },
            });

            // Set initial state
            gsap.set(stepCards, { opacity: 0.15, scale: 0.95 });
            if (stepLine) gsap.set(stepLine, { scaleX: 0, transformOrigin: 'left center' });
            
            // Clean/Reset overlays
            gsap.set([comicThwip, comicBzzzt, comicSwing, comicBoom], { opacity: 0, scale: 0 });
            gsap.set([senseLeft, senseRight], { opacity: 0, scale: 0.8 });

            aboutTl
              // ------------------------------------
              // STEP 1: Discover Stark Trading Hub
              // ------------------------------------
              .to(stepCards[0], { opacity: 1, scale: 1.05, duration: 0.5 }, 'step1')
              .to(stepLine, { scaleX: 0.33, duration: 0.5, ease: 'none' }, 'step1')
              .to(comicThwip, { opacity: 1, scale: 1.2, rotate: -15, duration: 0.3, ease: 'back.out(1.5)' }, 'step1')
              .call(() => {
                if (storyText) storyText.textContent = "STORY: Volatility bite strikes! Peter Parker discovers the Stark Trading Hub.";
              }, null, 'step1')

              // ------------------------------------
              // STEP 2: Spidey-Sense Unlocks
              // ------------------------------------
              .to(stepCards[0], { opacity: 0.25, scale: 0.98, duration: 0.3 }, 'step2')
              .to(comicThwip, { opacity: 0, scale: 0, duration: 0.2 }, 'step2')
              .to(stepCards[1], { opacity: 1, scale: 1.05, duration: 0.5 }, 'step2')
              .to(stepLine, { scaleX: 0.66, duration: 0.5, ease: 'none' }, 'step2')
              .to(comicBzzzt, { opacity: 1, scale: 1.2, rotate: 8, duration: 0.3, ease: 'back.out(1.5)' }, 'step2')
              .call(() => {
                if (storyText) storyText.textContent = "STORY: Spidey-sense activated! He sees the price action charts before they form.";
              }, null, 'step2')

              // ------------------------------------
              // STEP 3: Receive 20,000 IC
              // ------------------------------------
              .to(stepCards[1], { opacity: 0.25, scale: 0.98, duration: 0.3 }, 'step3')
              .to(comicBzzzt, { opacity: 0, scale: 0, duration: 0.2 }, 'step3')
              .to(stepCards[2], { opacity: 1, scale: 1.05, duration: 0.5 }, 'step3')
              .to(stepLine, { scaleX: 0.9, duration: 0.5, ease: 'none' }, 'step3')
              .to(comicSwing, { opacity: 1, scale: 1.2, rotate: -8, duration: 0.3, ease: 'back.out(1.5)' }, 'step3')
              .call(() => {
                if (storyText) storyText.textContent = "STORY: Stark Wallet receives 20,000 Ignite Coins. Volatility yields to leverage.";
              }, null, 'step3')

              // ------------------------------------
              // STEP 4: First Order & Bite Impact
              // ------------------------------------
              .to(stepCards[2], { opacity: 0.25, scale: 0.98, duration: 0.3 }, 'step4')
              .to(comicSwing, { opacity: 0, scale: 0, duration: 0.2 }, 'step4')
              .to(stepCards[3], { opacity: 1, scale: 1.08, duration: 0.5 }, 'step4')
              .to(stepLine, { scaleX: 1.0, duration: 0.5, ease: 'none' }, 'step4')
              .to(comicBoom, { opacity: 1, scale: 1.4, rotate: 12, duration: 0.4, ease: 'elastic.out(1.1, 0.6)' }, 'step4')
              .to([senseLeft, senseRight], { opacity: 1, scale: 1.0, duration: 0.3, ease: 'back.out(1.5)' }, 'step4')
              .call(() => {
                if (storyText) storyText.textContent = "STORY: First fill executed! The Web-Slinger dominates the Arena Leaderboard.";
              }, null, 'step4');

            // Screen flash overlay pulse
            if (biteOverlay) {
              aboutTl.to(
                biteOverlay,
                { opacity: 0.45, duration: 0.2, yoyo: true, repeat: 1, ease: 'power2.inOut' },
                'step4+=0.15'
              );
            }
          }
        }

        // --- 3. Features Section (#features) mouse tilt interaction ---
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

            // Interactive 3D hover/tilt effects on cards
            featureCards.forEach(card => {
              card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                const px = x / (rect.width / 2);
                const py = y / (rect.height / 2);
                
                gsap.to(card, {
                  rotateY: px * 12,
                  rotateX: -py * 12,
                  transformPerspective: 800,
                  ease: 'power1.out',
                  duration: 0.3,
                  overwrite: 'auto'
                });
              });

              card.addEventListener('mouseleave', () => {
                gsap.to(card, {
                  rotateY: 0,
                  rotateX: 0,
                  ease: 'power2.out',
                  duration: 0.5,
                  overwrite: 'auto'
                });
              });
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
              filter: 'drop-shadow(0 0 10px rgba(59,130,246,0.45))',
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
