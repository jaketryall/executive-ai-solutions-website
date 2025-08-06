"use client";

import { useGLTF, useAnimations, PresentationControls, Environment } from '@react-three/drei';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

// You'll need to replace this with your actual model URL
const MODEL_URL = '/models/human.glb'; // Place your model in public/models/

export function Human3D() {
  const group = useRef<THREE.Group>(null);
  
  // For Ready Player Me avatar (example URL)
  // const { scene, animations } = useGLTF('https://models.readyplayer.me/6598e28ff3b2f5f1e5a4f4b9.glb');
  
  // For local model
  const { scene, animations } = useGLTF(MODEL_URL);
  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    // Play idle animation if available
    if (actions && actions['idle']) {
      actions['idle'].play();
    }
  }, [actions]);

  return (
    <PresentationControls
      global
      rotation={[0.13, 0.1, 0]}
      polar={[-0.4, 0.2]}
      azimuth={[-1, 0.75]}
      config={{ mass: 2, tension: 400 }}
      snap={{ mass: 4, tension: 400 }}
    >
      <group ref={group}>
        <primitive 
          object={scene} 
          scale={2.5} 
          position={[0, -3, 0]}
        />
      </group>
    </PresentationControls>
  );
}

// Preload the model
useGLTF.preload(MODEL_URL);