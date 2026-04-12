import { useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';

const MODELS = {
  shoes: '/models/shoes.glb',
  watch: '/models/watch.glb',
  fabric: '/models/fabric.glb', 
  corset: '/models/corset.glb' 
};

export function Model({ type, modelRef }) {
  const url = MODELS[type];
  const { scene } = useGLTF(url);
  const localRef = useRef();

  // Combine both refs and add a slight idle floating animation
  useFrame((state) => {
    if (localRef.current) {
      const t = state.clock.getElapsedTime();
      localRef.current.position.y = Math.sin(t * 1.5) * 0.05;
    }
  });

  return (
    <group ref={modelRef} dispose={null}>
      <group ref={localRef}>
        <primitive object={scene} />
      </group>
    </group>
  );
}

// Preload models for performance
Object.values(MODELS).forEach((url) => {
  useGLTF.preload(url);
});
