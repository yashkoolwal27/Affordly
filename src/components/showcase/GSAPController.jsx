import { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function GSAPController({ refs, domRefs }) {
  const { camera } = useThree();

  useEffect(() => {
    const { shoesRef, watchRef, fabricRef, corsetRef } = refs;
    const { containerRef, text1Ref, text2Ref, text3Ref, text4Ref } = domRefs;

    // Safety check - we know the THREE groups exist because we render this component next to them
    if (!shoesRef.current || !containerRef.current) return;

    const ctx = gsap.context(() => {
      // Initial Setup
      gsap.set(shoesRef.current.scale, { x: 3, y: 3, z: 3 });
      gsap.set([watchRef.current.scale, fabricRef.current.scale, corsetRef.current.scale], { x: 0, y: 0, z: 0 }); 
      gsap.set(shoesRef.current.rotation, { y: 0 });

      // Build Master Timeline mapped to Scroll
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1, // Smooth scrubbing
        }
      });

      // SECTION 1 -> 2 (Shoes to Watch)
      tl.to(text1Ref.current, { opacity: 0, y: -50, duration: 1 }, 0)
        .to(shoesRef.current.rotation, { y: Math.PI * 2, duration: 2 }, 0)
        .to(shoesRef.current.scale, { x: 0, y: 0, z: 0, duration: 2, ease: "power2.in" }, 0)
        
        .to(watchRef.current.scale, { x: 10, y: 10, z: 10, duration: 2, ease: "power2.out" }, 1)
        .fromTo(watchRef.current.rotation, { y: -Math.PI }, { y: 0, duration: 2 }, 1)
        .fromTo(text2Ref.current, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1 }, 2);

      // SECTION 2 -> 3 (Watch to Fabric)
      tl.to(text2Ref.current, { opacity: 0, y: -50, duration: 1 }, 3)
        .to(watchRef.current.scale, { x: 0, y: 0, z: 0, duration: 2, ease: "power2.in" }, 3)
        
        .to(fabricRef.current.scale, { x: 2, y: 2, z: 2, duration: 2, ease: "power2.out" }, 4)
        .fromTo(fabricRef.current.rotation, { y: -Math.PI }, { y: 0, duration: 2 }, 4)
        .fromTo(text3Ref.current, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1 }, 5);

      // SECTION 3 -> 4 (Fabric to Corset/Bag)
      tl.to(text3Ref.current, { opacity: 0, y: -50, duration: 1 }, 6)
        .to(fabricRef.current.scale, { x: 0, y: 0, z: 0, duration: 2, ease: "power2.in" }, 6)
        
        .to(corsetRef.current.scale, { x: 4, y: 4, z: 4, duration: 2, ease: "power2.out" }, 7)
        .fromTo(corsetRef.current.rotation, { y: -Math.PI }, { y: 0, duration: 2 }, 7)
        .fromTo(text4Ref.current, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1 }, 8);

    });

    return () => ctx.revert();
  }, [refs, domRefs, camera]);

  return null;
}
