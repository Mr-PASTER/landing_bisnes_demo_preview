"use client";

import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls } from "@react-three/drei";
import ConstructionAnimation from "./ConstructionAnimation";
import { Suspense } from "react";

export default function Scene() {
  return (
    <div className="w-full h-full absolute inset-0 z-0">
      <Canvas shadows camera={{ position: [12, 8, 12], fov: 40 }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <directionalLight
            position={[10, 10, 5]}
            intensity={1.5}
            castShadow
            shadow-mapSize={[2048, 2048]}
          />
          <Environment preset="city" />
          
          <ConstructionAnimation />
          
          <OrbitControls 
            enableZoom={false} 
            enablePan={false}
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={Math.PI / 2.2}
            autoRotate
            autoRotateSpeed={0.2}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
