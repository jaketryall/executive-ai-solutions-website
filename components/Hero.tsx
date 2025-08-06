"use client";

import { motion } from "framer-motion";
import { Canvas } from "@react-three/fiber";
import { PresentationControls, Float } from "@react-three/drei";
import { Suspense } from "react";
import * as THREE from "three";

// Anime-style character
function AnimeCharacter() {
  return (
    <Float
      speed={1}
      rotationIntensity={0.3}
      floatIntensity={1.5}
    >
      <PresentationControls
        global
        rotation={[0.13, 0.1, 0]}
        polar={[-0.4, 0.2]}
        azimuth={[-1, 0.75]}
        config={{ mass: 2, tension: 400 }}
        snap={{ mass: 4, tension: 400 }}
      >
        <group>
          {/* Anime Head - larger proportions */}
          <mesh position={[0, 2, 0]}>
            <sphereGeometry args={[0.8, 32, 32]} />
            <meshToonMaterial color="#FDB5A6" />
          </mesh>
          
          {/* Anime Hair - Blue */}
          <group position={[0, 2.3, 0]}>
            {/* Main hair */}
            <mesh position={[0, 0.2, -0.1]}>
              <sphereGeometry args={[0.85, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
              <meshToonMaterial color="#0066ff" />
            </mesh>
            {/* Hair spikes */}
            <mesh position={[0.3, 0.3, 0]} rotation={[0, 0, 0.3]}>
              <coneGeometry args={[0.2, 0.6, 4]} />
              <meshToonMaterial color="#0066ff" />
            </mesh>
            <mesh position={[-0.3, 0.3, 0]} rotation={[0, 0, -0.3]}>
              <coneGeometry args={[0.2, 0.6, 4]} />
              <meshToonMaterial color="#0066ff" />
            </mesh>
            <mesh position={[0, 0.3, -0.3]} rotation={[0.3, 0, 0]}>
              <coneGeometry args={[0.15, 0.5, 4]} />
              <meshToonMaterial color="#0052cc" />
            </mesh>
          </group>
          
          {/* Large Anime Eyes */}
          <group>
            {/* Left eye */}
            <mesh position={[-0.25, 2, 0.7]}>
              <sphereGeometry args={[0.15, 16, 16]} />
              <meshToonMaterial color="#000000" />
            </mesh>
            <mesh position={[-0.25, 2.05, 0.72]}>
              <sphereGeometry args={[0.08, 16, 16]} />
              <meshToonMaterial color="#ffffff" />
            </mesh>
            {/* Right eye */}
            <mesh position={[0.25, 2, 0.7]}>
              <sphereGeometry args={[0.15, 16, 16]} />
              <meshToonMaterial color="#000000" />
            </mesh>
            <mesh position={[0.25, 2.05, 0.72]}>
              <sphereGeometry args={[0.08, 16, 16]} />
              <meshToonMaterial color="#ffffff" />
            </mesh>
          </group>
          
          {/* Small anime nose */}
          <mesh position={[0, 1.8, 0.8]}>
            <coneGeometry args={[0.05, 0.1, 3]} />
            <meshToonMaterial color="#E89F93" />
          </mesh>
          
          {/* Anime mouth */}
          <mesh position={[0, 1.6, 0.75]}>
            <boxGeometry args={[0.15, 0.03, 0.01]} />
            <meshToonMaterial color="#E67E80" />
          </mesh>
          
          {/* Neck */}
          <mesh position={[0, 1.2, 0]}>
            <cylinderGeometry args={[0.2, 0.25, 0.5]} />
            <meshToonMaterial color="#FDB5A6" />
          </mesh>
          
          {/* Body - School uniform style */}
          <mesh position={[0, 0.2, 0]}>
            <boxGeometry args={[1.4, 1.8, 0.6]} />
            <meshToonMaterial color="#1a1a1a" />
          </mesh>
          
          {/* Collar */}
          <mesh position={[0, 1, 0.31]}>
            <boxGeometry args={[0.8, 0.2, 0.02]} />
            <meshToonMaterial color="#ffffff" />
          </mesh>
          
          {/* Tie */}
          <mesh position={[0, 0.7, 0.32]}>
            <boxGeometry args={[0.15, 0.6, 0.02]} />
            <meshToonMaterial color="#0066ff" />
          </mesh>
          
          {/* Arms */}
          <mesh position={[-0.9, 0.2, 0]}>
            <cylinderGeometry args={[0.12, 0.12, 1.4]} />
            <meshToonMaterial color="#1a1a1a" />
          </mesh>
          <mesh position={[0.9, 0.2, 0]}>
            <cylinderGeometry args={[0.12, 0.12, 1.4]} />
            <meshToonMaterial color="#1a1a1a" />
          </mesh>
          
          {/* Hands */}
          <mesh position={[-0.9, -0.6, 0]}>
            <sphereGeometry args={[0.15, 16, 16]} />
            <meshToonMaterial color="#FDB5A6" />
          </mesh>
          <mesh position={[0.9, -0.6, 0]}>
            <sphereGeometry args={[0.15, 16, 16]} />
            <meshToonMaterial color="#FDB5A6" />
          </mesh>
          
          {/* Skirt/Lower body */}
          <mesh position={[0, -0.8, 0]}>
            <cylinderGeometry args={[0.5, 0.7, 0.8, 8]} />
            <meshToonMaterial color="#0066ff" />
          </mesh>
          
          {/* Legs */}
          <mesh position={[-0.3, -2, 0]}>
            <cylinderGeometry args={[0.15, 0.12, 1.6]} />
            <meshToonMaterial color="#FDB5A6" />
          </mesh>
          <mesh position={[0.3, -2, 0]}>
            <cylinderGeometry args={[0.15, 0.12, 1.6]} />
            <meshToonMaterial color="#FDB5A6" />
          </mesh>
          
          {/* Shoes */}
          <mesh position={[-0.3, -2.9, 0.1]}>
            <boxGeometry args={[0.25, 0.15, 0.4]} />
            <meshToonMaterial color="#000000" />
          </mesh>
          <mesh position={[0.3, -2.9, 0.1]}>
            <boxGeometry args={[0.25, 0.15, 0.4]} />
            <meshToonMaterial color="#000000" />
          </mesh>
          
          {/* Floating tech accessories */}
          <Float speed={3} rotationIntensity={1} floatIntensity={2}>
            <mesh position={[1.5, 0.5, 0]}>
              <torusGeometry args={[0.25, 0.05, 16, 32]} />
              <meshToonMaterial color="#0066ff" />
            </mesh>
          </Float>
          
          {/* Holographic display */}
          <Float speed={2} rotationIntensity={0} floatIntensity={1}>
            <mesh position={[-1.5, 1, 0]}>
              <planeGeometry args={[0.8, 0.5]} />
              <meshBasicMaterial 
                color="#00ffff" 
                transparent 
                opacity={0.3}
                side={THREE.DoubleSide}
              />
            </mesh>
          </Float>
          
          {/* Energy particles */}
          {[...Array(5)].map((_, i) => (
            <Float key={i} speed={2 + i * 0.5} floatIntensity={2}>
              <mesh position={[
                Math.sin(i * 72 * Math.PI / 180) * 2,
                0.5 + i * 0.3,
                Math.cos(i * 72 * Math.PI / 180) * 2
              ]}>
                <sphereGeometry args={[0.05, 8, 8]} />
                <meshBasicMaterial color="#0066ff" />
              </mesh>
            </Float>
          ))}
        </group>
      </PresentationControls>
    </Float>
  );
}

export default function Hero() {

  return (
    <section className="relative min-h-screen bg-black overflow-hidden">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0066ff]/20 via-black to-black" />
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-bl from-cyan-400/10 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center min-h-[80vh]">
          
          {/* Left Column - Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6">
                Welcome to{" "}
                <span className="text-transparent bg-gradient-to-r from-[#0066ff] to-cyan-400 bg-clip-text">
                  Executive Web
                </span>
                <br />
                <span className="text-zinc-400 font-light italic text-4xl sm:text-5xl lg:text-6xl">
                  — Built with AI
                </span>
              </h1>
              
              <p className="text-xl text-zinc-400 font-light leading-relaxed max-w-lg">
                We build modern, fast websites powered by intelligent AI features.
              </p>
            </div>

            <motion.a
              href="#contact"
              className="inline-flex items-center px-6 py-3 bg-[#0066ff] text-white font-medium rounded-full hover:bg-[#0052cc] transition-colors duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get Started Now
              <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </motion.a>
          </motion.div>

          {/* Right Column - 3D Robot + Floating Badges */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative flex items-center justify-center"
          >
            {/* 3D Robot Scene */}
            <div className="relative w-[500px] h-[600px] lg:w-[600px] lg:h-[700px]">
              <Suspense fallback={
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-[#0066ff] text-xl">Loading 3D Robot...</div>
                </div>
              }>
                <Canvas
                  camera={{ position: [0, 0, 8], fov: 45 }}
                  style={{ background: 'transparent' }}
                >
                  <ambientLight intensity={0.5} />
                  <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
                  <pointLight position={[-10, -10, -10]} intensity={0.5} />
                  <pointLight position={[0, 0, 5]} intensity={0.5} color="#0066ff" />
                  
                  <AnimeCharacter />
                  
                  {/* Particle field */}
                  <Float speed={4} rotationIntensity={0} floatIntensity={2}>
                    <mesh position={[-3, 2, -2]}>
                      <sphereGeometry args={[0.1, 16, 16]} />
                      <meshStandardMaterial color="#0066ff" emissive="#0066ff" emissiveIntensity={2} />
                    </mesh>
                  </Float>
                  <Float speed={3} rotationIntensity={0} floatIntensity={1.5}>
                    <mesh position={[3, -1, -1]}>
                      <sphereGeometry args={[0.08, 16, 16]} />
                      <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={2} />
                    </mesh>
                  </Float>
                  <Float speed={5} rotationIntensity={0} floatIntensity={3}>
                    <mesh position={[-2, -2, 0]}>
                      <sphereGeometry args={[0.06, 16, 16]} />
                      <meshStandardMaterial color="#0066ff" emissive="#0066ff" emissiveIntensity={2} />
                    </mesh>
                  </Float>
                </Canvas>
              </Suspense>
            </div>

            {/* Floating Badges */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="absolute -top-4 -right-8 bg-zinc-900/80 backdrop-blur-sm border border-zinc-700 rounded-2xl p-4 shadow-xl"
            >
              <div className="text-center">
                <div className="text-2xl font-bold text-white mb-1">Modern websites that drive results.</div>
                <div className="flex flex-wrap gap-2 mt-3">
                  <span className="bg-[#0066ff]/20 text-[#0066ff] px-3 py-1 rounded-full text-sm font-medium">
                    Custom Websites
                  </span>
                  <span className="bg-[#0066ff]/20 text-[#0066ff] px-3 py-1 rounded-full text-sm font-medium">
                    E-commerce
                  </span>
                  <span className="bg-[#0066ff]/20 text-[#0066ff] px-3 py-1 rounded-full text-sm font-medium">
                    Web Applications
                  </span>
                  <span className="bg-[#0066ff]/20 text-[#0066ff] px-3 py-1 rounded-full text-sm font-medium">
                    AI-Powered Features
                  </span>
                  <span className="bg-[#0066ff]/20 text-[#0066ff] px-3 py-1 rounded-full text-sm font-medium">
                    SEO Optimization
                  </span>
                  <span className="bg-[#0066ff]/20 text-[#0066ff] px-3 py-1 rounded-full text-sm font-medium">
                    CMS Integration
                  </span>
                  <span className="bg-[#0066ff]/20 text-[#0066ff] px-3 py-1 rounded-full text-sm font-medium">
                    Responsive Design
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Additional floating elements */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="absolute -bottom-8 -left-8 bg-[#0066ff]/10 backdrop-blur-sm border border-[#0066ff]/20 rounded-xl p-3"
            >
              <div className="text-[#0066ff] font-medium">✓ Get Template</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 1 }}
              className="absolute top-16 -left-12 bg-blue-500/10 backdrop-blur-sm border border-blue-500/20 rounded-xl p-3"
            >
              <div className="text-blue-400 font-medium">✓ Get All Access</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 1.2 }}
              className="absolute bottom-20 right-12 bg-zinc-800/80 backdrop-blur-sm border border-zinc-600 rounded-xl p-3"
            >
              <div className="text-zinc-300 font-medium">Made in Framer</div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}