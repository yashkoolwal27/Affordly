import { Suspense, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, ContactShadows } from '@react-three/drei';
import { Model } from '../showcase/Models';
import JourneyGSAP from './JourneyGSAP';

export default function JourneyScene({ refs, domRefs, isMobile }) {
  // We notify parent when Scene starts mounting if necessary,
  // but since we render GSAPController inside, it aligns perfectly!

  return (
    <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <spotLight position={[5, 10, 5]} angle={0.3} penumbra={1} intensity={3} color="#00f0ff" />
      <spotLight position={[-5, 8, -5]} angle={0.4} penumbra={1} intensity={3} color="#39ff14" />
      <spotLight position={[0, -5, 5]} angle={0.5} penumbra={1} intensity={2} color="#ff00e5" />
      <Environment preset="city" />

      {/* 
        Master positioning group (piloted by MotionPath) 
        and inner rotational group (simple item spinning)
      */}
      <group ref={refs.masterPathRef}>
        <group ref={refs.rotatorRef}>
          <group ref={refs.shoesRef}>
            <Suspense fallback={null}>
              <Model type="shoes" />
            </Suspense>
          </group>
          <group ref={refs.watchRef}>
            <Suspense fallback={null}>
              <Model type="watch" />
            </Suspense>
          </group>
          <group ref={refs.fabricRef}>
            <Suspense fallback={null}>
              <Model type="fabric" />
            </Suspense>
          </group>
          <group ref={refs.corsetRef}>
            <Suspense fallback={null}>
              <Model type="corset" />
            </Suspense>
          </group>
        </group>
      </group>

      {/* Soft shadow plane matching the height */}
      <ContactShadows position={[0, -2, 0]} opacity={0.6} scale={15} blur={2.5} far={4} color="#00f0ff" />

      {/* GSAP Logic Injection */}
      <JourneyGSAP refs={refs} domRefs={domRefs} isMobile={isMobile} />
    </Canvas>
  );
}
