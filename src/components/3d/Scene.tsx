"use client";

import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls } from "@react-three/drei";
import ConstructionAnimation from "./ConstructionAnimation";
import { Suspense } from "react";

export default function Scene() {
  return (
    <div className="w-full h-full absolute inset-0 z-0">
      <Canvas 
        shadows="soft"
        dpr={[1, 1.5]} // Limit pixel ratio for performance
        orthographic
        camera={{ position: [20, 20, 20], zoom: 40, near: 0.1, far: 200 }}
        gl={{ antialias: true, powerPreference: "high-performance" }}
        performance={{ min: 0.5 }} // Allow degrading quality on low FPS
      >
        <Suspense fallback={null}>
          <color attach="background" args={['#f3f4f6']} />
          <ambientLight intensity={0.7} />
          <directionalLight
            position={[10, 20, 10]}
            intensity={1.2}
            castShadow
            shadow-mapSize={[1024, 1024]} // Reduced from 2048 for performance
            shadow-camera-left={-20}
            shadow-camera-right={20}
            shadow-camera-top={20}
            shadow-camera-bottom={-20}
          />
          <Environment preset="city" />
          
          <ConstructionAnimation />
          
          <OrbitControls 
            enableZoom={true} 
            enablePan={true}
            minPolarAngle={0}
            maxPolarAngle={Math.PI / 2}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
