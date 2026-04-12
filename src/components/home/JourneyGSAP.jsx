import { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

export default function JourneyGSAP({ refs, domRefs, isMobile }) {
  const { camera } = useThree();

  useEffect(() => {
    const { masterPathRef, rotatorRef, shoesRef, watchRef, fabricRef, corsetRef } = refs;
    const { containerRef, card1Ref, card2Ref, card3Ref, card4Ref } = domRefs;

    if (!masterPathRef.current || !containerRef.current) return;

    const ctx = gsap.context(() => {
      // 1. Initial State Setup
      // Hide all items except shoes
      gsap.set(shoesRef.current.scale, { x: 3, y: 3, z: 3 });
      gsap.set([watchRef.current.scale, fabricRef.current.scale, corsetRef.current.scale], { x: 0, y: 0, z: 0 });
      gsap.set([shoesRef.current.rotation, watchRef.current.rotation, fabricRef.current.rotation, corsetRef.current.rotation], { y: 0 });
      
      // Hide all DOM cards initially
      gsap.set([card1Ref.current, card2Ref.current, card3Ref.current, card4Ref.current], { opacity: 0, y: 50 });

      // Master continuous auto-rotation
      gsap.to(rotatorRef.current.rotation, {
        y: Math.PI * 2,
        duration: 10,
        repeat: -1,
        ease: "none",
      });

      // 2. Build Scroll Timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1.5, // Super smooth scrubbing
        }
      });

      if (!isMobile) {
        // --- DESKTOP COMPLEX MOTION PATH --- //
        // Animate the master gimbal along a sweeping curved 3D path over the entire scroll duration
        // We use position object of the THREE.Group for GSAP to manipulate
        tl.to(masterPathRef.current.position, {
          motionPath: {
            path: [
              { x: 0, y: -0.5, z: 0 },         // Start
              { x: 3, y: 1.5, z: -3 },         // Deep Right
              { x: -3, y: -1.5, z: 2 },        // Front Left
              { x: 2, y: 0.5, z: 1 },          // Close Right
              { x: 0, y: -0.5, z: 2 }          // End Center Extreme Close
            ],
            type: "cubic",                     // Curves through all points smoothly
          },
          duration: 12, // Arbitrary duration covering the 4 chunks seamlessly
          ease: "none"
        }, 0);
      } else {
        // --- MOBILE SIMPLE MOTION --- //
        // Just small vertical bobs to keep it strictly on-screen for mobile
        tl.to(masterPathRef.current.position, { y: 1.5, duration: 4, ease: "sine.inOut" }, 0)
          .to(masterPathRef.current.position, { y: -1.5, duration: 4, ease: "sine.inOut" }, 4)
          .to(masterPathRef.current.position, { y: 0, z: 2, duration: 4, ease: "sine.inOut" }, 8);
      }

      // --- ITEM SWAP ANIMATIONS (Scale morphs) mapped to scroll chunks --- //
      // Chunk 0-3: Shoes to Watch
      tl.to(card1Ref.current, { opacity: 1, y: 0, duration: 0.5 }, 0.5) // Snap card 1
        .to(card1Ref.current, { opacity: 0, y: -50, duration: 0.5 }, 2.5) // Hide card 1
        .to(shoesRef.current.scale, { x: 0, y: 0, z: 0, duration: 1, ease: "power2.in" }, 2.5) // Shrink Shoes
        
        .to(watchRef.current.scale, { x: 12, y: 12, z: 12, duration: 1, ease: "back.out(1.5)" }, 3.5) // Grow Watch
        .to(card2Ref.current, { opacity: 1, y: 0, duration: 0.5 }, 3.5); // Show card 2

      // Chunk 3-6: Watch to Fabric
      tl.to(card2Ref.current, { opacity: 0, y: -50, duration: 0.5 }, 5.5)
        .to(watchRef.current.scale, { x: 0, y: 0, z: 0, duration: 1, ease: "power2.in" }, 5.5)
        
        .to(fabricRef.current.scale, { x: 3, y: 3, z: 3, duration: 1, ease: "back.out(1.5)" }, 6.5)
        .to(card3Ref.current, { opacity: 1, y: 0, duration: 0.5 }, 6.5);

      // Chunk 6-9: Fabric to Corset/Bag
      tl.to(card3Ref.current, { opacity: 0, y: -50, duration: 0.5 }, 8.5)
        .to(fabricRef.current.scale, { x: 0, y: 0, z: 0, duration: 1, ease: "power2.in" }, 8.5)
        
        .to(corsetRef.current.scale, { x: 4.5, y: 4.5, z: 4.5, duration: 1, ease: "back.out(1.5)" }, 9.5)
        .to(card4Ref.current, { opacity: 1, y: 0, duration: 0.5 }, 9.5)
        
        // Final rest for end of scroll
        .to(card4Ref.current, { duration: 2 }, 10); // Hold at end

    }, containerRef);

    return () => ctx.revert();
  }, [refs, domRefs, camera, isMobile]);

  return null;
}
