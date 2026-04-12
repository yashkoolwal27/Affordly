import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import JourneyScene from './JourneyScene';

export default function HomeJourneySection() {
  const containerRef = useRef(null);
  
  // THREE.js refs passed to GSAP
  const masterPathRef = useRef(null);
  const rotatorRef = useRef(null);
  const shoesRef = useRef(null);
  const watchRef = useRef(null);
  const fabricRef = useRef(null);
  const corsetRef = useRef(null);

  // DOM Card refs passed to GSAP
  const card1Ref = useRef(null);
  const card2Ref = useRef(null);
  const card3Ref = useRef(null);
  const card4Ref = useRef(null);

  const [isMobile, setIsMobile] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (!isMounted) return null; // Prevents hydration mismatches if Next.js/SSR used

  const ProductCard = ({ refObject, title, category, align = "left", alignmentClasses }) => (
    <div 
      ref={refObject} 
      className={`absolute top-1/2 -translate-y-1/2 p-6 md:p-10 pointer-events-none w-full max-w-sm lg:max-w-md ${alignmentClasses}`}
      style={{ opacity: 0 }} // Hidden initially by GSAP
    >
      <div className="glass-card p-6 md:p-8 border border-white/10 shadow-2xl relative overflow-hidden pointer-events-auto">
        {/* Glow backdrop inside card */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-neon-cyan/20 blur-3xl rounded-full" />
        
        <h3 className="text-3xl md:text-5xl font-display font-bold text-white mb-4 relative z-10">
          {title}
        </h3>
        <p className="text-gray-400 mb-6 text-sm md:text-base relative z-10">
          Experience the pinnacle of {" "}
          <span className="text-neon-cyan font-semibold">{category}</span> design 
          with our exclusive collection. Stunning visuals meet uncompromising quality.
        </p>
        
        <Link 
          to={`/products?category=${category}`} 
          className="btn-neon inline-flex relative z-10"
        >
          Shop Now
        </Link>
      </div>
    </div>
  );

  return (
    <section className="relative bg-dark-900 border-t border-white/5">
      
      {/* Intro Text pinned right above the scrolling journey */}
      <div className="pt-20 pb-10 text-center px-4">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-6xl font-display font-bold text-white mb-4"
        >
          The <span className="text-neon-cyan">Affordly</span> Journey
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-gray-400 max-w-2xl mx-auto"
        >
          Scroll to explore our premium products in an immersive 3D experience.
        </motion.p>
      </div>

      {/* GSAP Scroll Container */}
      <div ref={containerRef} className="h-[400vh] relative">
        <div className="sticky top-16 md:top-20 left-0 w-full" style={{ height: 'calc(100vh - 5rem)' }}>
          
          <div className="absolute inset-0 z-0">
            <JourneyScene 
              isMobile={isMobile}
              refs={{ masterPathRef, rotatorRef, shoesRef, watchRef, fabricRef, corsetRef }}
              domRefs={{ containerRef, card1Ref, card2Ref, card3Ref, card4Ref }}
            />
          </div>

          <div className="absolute inset-0 z-10 pointer-events-none w-full max-w-7xl mx-auto">
            {/* The alignments push the cards left or right to avoid overlapping the 3D model */}
            <ProductCard 
              refObject={card1Ref} 
              title="Premium Kicks" 
              category="shoes"
              alignmentClasses="left-4 md:left-12 lg:left-24"
            />
            <ProductCard 
              refObject={card2Ref} 
              title="Luxury Instruments" 
              category="watches"
              alignmentClasses="right-4 md:right-12 lg:right-24 left-auto"
            />
            <ProductCard 
              refObject={card3Ref} 
              title="Designer Fabrics" 
              category="fabrics"
              alignmentClasses="left-4 md:left-12 lg:left-24"
            />
            <ProductCard 
              refObject={card4Ref} 
              title="Exclusive Headgear" 
              category="corset"
              alignmentClasses="right-4 md:right-12 lg:right-24 left-auto"
            />
          </div>

        </div>
      </div>
    </section>
  );
}
