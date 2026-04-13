import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function JourneyGSAP({ refs, domRefs, isMobile }) {
  useEffect(() => {
    // Note: rotatorRef and masterPathRef are no longer used heavily, but we destructure them out just in case
    const { shoesRef, watchRef, fabricRef, corsetRef } = refs;
    const { containerRef, card1Ref, card2Ref, card3Ref, card4Ref } = domRefs;

    if (!shoesRef.current || !containerRef.current) return;

    const ctx = gsap.context(() => {
      // 1. Initial State Setup
      // All 4 models start at scale = normal.
      // Positioned side-by-side (shelf carousel layout) at start.
      if (isMobile) {
        gsap.set(shoesRef.current.position, { x: 0, y: 1.5, z: 0 });
        gsap.set(watchRef.current.position, { x: 0, y: 0.5, z: 0 });
        gsap.set(fabricRef.current.position, { x: 0, y: -0.5, z: 0 });
        gsap.set(corsetRef.current.position, { x: 0, y: -1.5, z: 0 });
        
        // Smaller base scales for mobile so they fit vertically
        gsap.set(shoesRef.current.scale, { x: 1.5, y: 1.5, z: 1.5 });
        gsap.set(watchRef.current.scale, { x: 6, y: 6, z: 6 });
        gsap.set(fabricRef.current.scale, { x: 1.5, y: 1.5, z: 1.5 });
        gsap.set(corsetRef.current.scale, { x: 2, y: 2, z: 2 });
      } else {
        gsap.set(shoesRef.current.position, { x: -3.5, y: 0, z: -2 });
        gsap.set(watchRef.current.position, { x: -1.2, y: 0, z: 0 });
        gsap.set(fabricRef.current.position, { x: 1.2, y: 0, z: 0 });
        gsap.set(corsetRef.current.position, { x: 3.5, y: 0, z: -2 });

        // Base idle cluster scales
        gsap.set(shoesRef.current.scale, { x: 2, y: 2, z: 2 });
        gsap.set(watchRef.current.scale, { x: 6, y: 6, z: 6 });
        gsap.set(fabricRef.current.scale, { x: 1.5, y: 1.5, z: 1.5 });
        gsap.set(corsetRef.current.scale, { x: 2.5, y: 2.5, z: 2.5 });
      }
      
      // Hide all DOM cards initially
      gsap.set([card1Ref.current, card2Ref.current, card3Ref.current, card4Ref.current], { opacity: 0, y: 50 });

      // Rotate all items continuously in place
      gsap.to([shoesRef.current.rotation, watchRef.current.rotation, fabricRef.current.rotation, corsetRef.current.rotation], {
        y: Math.PI * 2,
        duration: 12,
        repeat: -1,
        ease: "none",
      });

      // 2. Build Scroll Timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1.5,
        }
      });

      // Constants for focused scale/position
      const M_SC = 1.2; // Mobile scale multiplier
      // Desktop parameters
      const focusRightX = 2.5;
      const focusLeftX = -2.5;
      const focusZ = 2;
      
      const hideScale = { x: 0, y: 0, z: 0 };
      const fadeDur = 0.5;

      // CHUNK 1: Start -> Shoes
      tl.to([watchRef.current.scale, fabricRef.current.scale, corsetRef.current.scale], { ...hideScale, duration: 1, ease: 'power2.inOut' }, 0)
        .to(shoesRef.current.position, { x: isMobile ? 0 : focusRightX, y: 0, z: isMobile ? 1 : focusZ, duration: 1, ease: 'power2.inOut' }, 0)
        .to(shoesRef.current.scale, { x: isMobile ? 2.5 : 4, y: isMobile ? 2.5 : 4, z: isMobile ? 2.5 : 4, duration: 1 }, 0)
        .to(card1Ref.current, { opacity: 1, y: 0, duration: fadeDur }, 0.5) // Card 1 ON

      // CHUNK 2: Shoes -> Watch
      tl.to(card1Ref.current, { opacity: 0, y: -50, duration: fadeDur }, 2) // Card 1 OFF
        .to(shoesRef.current.scale, { ...hideScale, duration: 1 }, 2)
        .to(shoesRef.current.position, { x: -5, duration: 1 }, 2)

        .to(watchRef.current.scale, { x: isMobile ? 9 : 14, y: isMobile ? 9 : 14, z: isMobile ? 9 : 14, duration: 1, ease: 'back.out(1.2)' }, 3)
        .to(watchRef.current.position, { x: isMobile ? 0 : focusLeftX, y: 0, z: isMobile ? 1 : focusZ, duration: 1, ease: 'power2.inOut' }, 3)
        .to(card2Ref.current, { opacity: 1, y: 0, duration: fadeDur }, 3.5); // Card 2 ON

      // CHUNK 3: Watch -> Fabric
      tl.to(card2Ref.current, { opacity: 0, y: -50, duration: fadeDur }, 5)
        .to(watchRef.current.scale, { ...hideScale, duration: 1 }, 5)
        .to(watchRef.current.position, { x: 5, duration: 1 }, 5)

        .to(fabricRef.current.scale, { x: isMobile ? 2.5 : 4, y: isMobile ? 2.5 : 4, z: isMobile ? 2.5 : 4, duration: 1, ease: 'back.out(1.2)' }, 6)
        .to(fabricRef.current.position, { x: isMobile ? 0 : focusRightX, y: 0, z: isMobile ? 1 : focusZ, duration: 1, ease: 'power2.inOut' }, 6)
        .to(card3Ref.current, { opacity: 1, y: 0, duration: fadeDur }, 6.5); // Card 3 ON

      // CHUNK 4: Fabric -> Corset
      tl.to(card3Ref.current, { opacity: 0, y: -50, duration: fadeDur }, 8)
        .to(fabricRef.current.scale, { ...hideScale, duration: 1 }, 8)
        .to(fabricRef.current.position, { x: -5, duration: 1 }, 8)

        .to(corsetRef.current.scale, { x: isMobile ? 4 : 5.5, y: isMobile ? 4 : 5.5, z: isMobile ? 4 : 5.5, duration: 1, ease: 'back.out(1.2)' }, 9)
        .to(corsetRef.current.position, { x: isMobile ? 0 : focusLeftX, y: 0, z: isMobile ? 1 : focusZ, duration: 1, ease: 'power2.inOut' }, 9)
        .to(card4Ref.current, { opacity: 1, y: 0, duration: fadeDur }, 9.5) // Card 4 ON
        
        .to(card4Ref.current, { duration: 1.5 }, 10); // Buffer hold

    }, containerRef);

    return () => ctx.revert();
  }, [refs, domRefs, isMobile]);

  return null;
}
