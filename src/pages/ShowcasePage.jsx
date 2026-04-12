import React, { useRef } from 'react';
import Navbar from '../components/common/Navbar';
import ShowcaseScene from '../components/showcase/ShowcaseScene';

export default function ShowcasePage() {
  const containerRef = useRef(null);
  
  // DOM overlay refs
  const text1Ref = useRef(null);
  const text2Ref = useRef(null);
  const text3Ref = useRef(null);
  const text4Ref = useRef(null);

  // THREE.js Group refs
  const shoesRef = useRef(null);
  const watchRef = useRef(null);
  const fabricRef = useRef(null);
  const corsetRef = useRef(null);

  // UI Component for overlay text chunks
  const TextOverlay = ({ refObject, title, subtitle }) => (
    <div 
      ref={refObject} 
      className="absolute inset-0 flex flex-col items-center justify-center p-8 pointer-events-none"
      style={{ opacity: 0 }} // Managed by GSAP
    >
      <h1 className="text-6xl md:text-8xl font-display font-bold text-white mb-4 text-center drop-shadow-[0_0_15px_rgba(0,240,255,0.8)] mix-blend-screen">
        {title}
      </h1>
      <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl text-center">
        {subtitle}
      </p>
      <button className="btn-neon pointer-events-auto">Shop Now</button>
    </div>
  );

  return (
    <div className="bg-dark-900 min-h-screen text-white font-sans">
      <Navbar />

      {/* 
        Scrollable Container. 
        400vh gives us plenty of scroll depth for the 4 sections.
      */}
      <div ref={containerRef} className="h-[400vh] relative pt-20">
        
        {/* Fixed Viewport containing the 3D Canvas and UI Layouts */}
        <div className="sticky top-20 left-0 w-full" style={{ height: 'calc(100vh - 5rem)' }}>
          
          {/* WebGL Canvas */}
          <div className="absolute inset-0 z-0">
            <ShowcaseScene 
              refs={{ shoesRef, watchRef, fabricRef, corsetRef }} 
              domRefs={{ containerRef, text1Ref, text2Ref, text3Ref, text4Ref }}
            />
          </div>

          {/* HTML UI Overlays layered over Canvas */}
          <div className="absolute inset-0 z-10 pointers-events-none">
            {/* The first one shouldn't have opacity: 0 initially, but we override it manually above */}
            <div ref={text1Ref} className="absolute inset-0 flex flex-col items-center justify-center p-8 pointer-events-none">
              <h1 className="text-6xl md:text-8xl font-display font-bold text-white mb-4 text-center drop-shadow-[0_0_15px_rgba(57,255,20,0.8)] mix-blend-screen">
                Premium Shoes
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl text-center">
                Step into the future with ultra-lightweigh comfort.
              </p>
              <button className="btn-neon pointer-events-auto">Shop Now</button>
            </div>

            <TextOverlay refObject={text2Ref} title="Premium Accessories" subtitle="Antique cameras and precision instruments." />
            <TextOverlay refObject={text3Ref} title="Hydration & Lifestyle" subtitle="Feel the premium comfort of our custom materials." />
            <TextOverlay refObject={text4Ref} title="Exclusive Headgear" subtitle="Accessorize with glowing perfection. Ready for anything." />
          </div>

        </div>
      </div>
    </div>
  );
}
