import { Suspense, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, ContactShadows, OrbitControls } from '@react-three/drei';
import { Model } from './Models';
import GSAPController from './GSAPController';

export default function ShowcaseScene({ refs, domRefs }) {
  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
      {/* Premium Dark Lighting Setup */}
      <color attach="background" args={['#0a0a0f']} />
      <ambientLight intensity={0.4} />
      <spotLight position={[5, 5, 5]} angle={0.25} penumbra={1} intensity={2} color="#00f0ff" />
      <spotLight position={[-5, 5, -5]} angle={0.25} penumbra={1} intensity={2} color="#39ff14" />
      <Environment preset="city" />

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

      {/* Add soft shadows at the base */}
      <ContactShadows position={[0, -1.2, 0]} opacity={0.8} scale={10} blur={2.5} far={4} color="#00f0ff" />
      
      {/* GSAP scroll trigger injection */}
      <GSAPController refs={refs} domRefs={domRefs} />
      
      {/* Orbit controls disabled zooming to prevent interrupting scroll */}
      <OrbitControls enableZoom={false} enablePan={false} maxPolarAngle={Math.PI / 2} />
    </Canvas>
  );
}
