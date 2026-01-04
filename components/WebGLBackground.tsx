"use client";

import { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

// Floating geometric shape with wireframe
function FloatingShape({
  position,
  scale,
  rotationSpeed,
  geometry = "icosahedron"
}: {
  position: [number, number, number];
  scale: number;
  rotationSpeed: number;
  geometry?: "icosahedron" | "octahedron" | "tetrahedron";
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const wireframeRef = useRef<THREE.LineSegments>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += rotationSpeed * 0.002;
      meshRef.current.rotation.y += rotationSpeed * 0.003;
    }
    if (wireframeRef.current) {
      wireframeRef.current.rotation.x += rotationSpeed * 0.002;
      wireframeRef.current.rotation.y += rotationSpeed * 0.003;
    }
  });

  const GeometryComponent = {
    icosahedron: <icosahedronGeometry args={[1, 0]} />,
    octahedron: <octahedronGeometry args={[1, 0]} />,
    tetrahedron: <tetrahedronGeometry args={[1, 0]} />,
  }[geometry];

  return (
    <group position={position} scale={scale}>
      {/* Solid mesh with low opacity */}
      <mesh ref={meshRef}>
        {GeometryComponent}
        <meshBasicMaterial
          color="#b6bac5"
          transparent
          opacity={0.03}
        />
      </mesh>
      {/* Wireframe edges */}
      <lineSegments ref={wireframeRef}>
        <edgesGeometry args={[
          geometry === "icosahedron" ? new THREE.IcosahedronGeometry(1, 0) :
          geometry === "octahedron" ? new THREE.OctahedronGeometry(1, 0) :
          new THREE.TetrahedronGeometry(1, 0)
        ]} />
        <lineBasicMaterial color="#b6bac5" transparent opacity={0.3} />
      </lineSegments>
    </group>
  );
}

// Particle field
function Particles({ count = 300 }) {
  const points = useRef<THREE.Points>(null);

  const particlesPosition = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 30;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 30;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 15;
    }
    return positions;
  }, [count]);

  useFrame((state) => {
    if (points.current) {
      points.current.rotation.y = state.clock.elapsedTime * 0.015;
      points.current.rotation.x = state.clock.elapsedTime * 0.008;
    }
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={particlesPosition}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color="#b6bac5"
        transparent
        opacity={0.5}
        sizeAttenuation
      />
    </points>
  );
}

// Mouse-following camera movement
function CameraRig() {
  const { camera } = useThree();
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseRef.current.y = -(e.clientY / window.innerHeight - 0.5) * 2;
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useFrame(() => {
    const targetX = mouseRef.current.x * 0.3;
    const targetY = mouseRef.current.y * 0.3;

    camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetX, 0.02);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, 0.02);
    camera.lookAt(0, 0, 0);
  });

  return null;
}

// Main scene
function Scene() {
  return (
    <>
      {/* Particles */}
      <Particles count={200} />

      {/* Floating shapes - scattered across the view */}
      <FloatingShape position={[-4, 2, -3]} scale={1.5} rotationSpeed={0.8} geometry="icosahedron" />
      <FloatingShape position={[4, -1, -4]} scale={2} rotationSpeed={0.6} geometry="octahedron" />
      <FloatingShape position={[0, 3, -5]} scale={1.2} rotationSpeed={1} geometry="tetrahedron" />
      <FloatingShape position={[-3, -2, -2]} scale={0.8} rotationSpeed={1.2} geometry="icosahedron" />
      <FloatingShape position={[5, 1, -6]} scale={1.8} rotationSpeed={0.5} geometry="octahedron" />
      <FloatingShape position={[-5, 0, -4]} scale={1} rotationSpeed={0.9} geometry="tetrahedron" />
      <FloatingShape position={[2, -3, -3]} scale={1.3} rotationSpeed={0.7} geometry="icosahedron" />

      {/* Camera movement */}
      <CameraRig />
    </>
  );
}

export default function WebGLBackground() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="fixed inset-0 -z-10 bg-[#383e4e]" />;
  }

  return (
    <div className="fixed inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 50 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance"
        }}
        dpr={[1, 2]}
        style={{ background: "#383e4e" }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
