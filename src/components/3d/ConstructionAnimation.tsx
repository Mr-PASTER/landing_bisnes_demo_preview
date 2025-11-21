"use client";

import { useRef, useLayoutEffect } from "react";
import { Group, Mesh } from "three";
import gsap from "gsap";

export default function ConstructionAnimation() {
  const containerRef = useRef<Group>(null);
  const truckRef = useRef<Group>(null);
  const craneRef = useRef<Group>(null);
  const craneCabRef = useRef<Group>(null);
  const hookRef = useRef<Group>(null);
  const ballRef = useRef<Mesh>(null);
  const carriedBlockRef = useRef<Mesh>(null);
  const buildingRef = useRef<Group>(null);
  const buildingBlocksRef = useRef<Mesh[]>([]);

  // Generate building blocks (floors)
  const floors = 4; // Reduced for concise animation
  const floorHeight = 0.6;
  
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.5 });

      // Position Calculations
      // Crane at [-2, 0, -2]
      // Truck at [3, 0, 2] -> Vector [5, 4] -> Angle ~0.9 rad
      // Building at [2, 0, -1] -> Vector [4, 1] -> Angle ~1.32 rad
      // Storage (out of frame) -> Let's say Angle PI (backwards)

      const angleTruck = 0.9;
      const angleBuilding = 1.32;
      const angleStorage = Math.PI;

      // Initial State
      if (truckRef.current) truckRef.current.position.set(12, 0, 2);
      if (buildingBlocksRef.current) {
        buildingBlocksRef.current.forEach(b => {
          if(b) {
             b.scale.set(0, 0, 0);
             b.position.y = b.userData.originalY;
             b.rotation.set(0, 0, 0);
             b.visible = false;
          }
        });
      }
      if (ballRef.current) ballRef.current.visible = false;
      if (hookRef.current) hookRef.current.visible = true;
      if (carriedBlockRef.current) carriedBlockRef.current.visible = false;
      if (craneCabRef.current) craneCabRef.current.rotation.y = 0;
      
      // --- SEQUENCE ---

      // 1. Truck Arrival
      tl.to(truckRef.current!.position, {
        x: 3,
        duration: 1.5,
        ease: "power2.out",
      });

      // 2. Construction Loop
      buildingBlocksRef.current.forEach((block, index) => {
        if (!block) return;
        
        // Rotate to Truck
        tl.to(craneCabRef.current!.rotation, {
          y: angleTruck,
          duration: 0.6,
          ease: "power2.inOut"
        });
        
        // "Pick up" visual
        tl.call(() => {
           if (carriedBlockRef.current) carriedBlockRef.current.visible = true;
        });
        // Visual bob/lift
        tl.to(carriedBlockRef.current!.position, { y: -0.5, duration: 0.2, yoyo: true, repeat: 1 }, "<");

        // Rotate to Building
        tl.to(craneCabRef.current!.rotation, {
          y: angleBuilding,
          duration: 0.6,
          ease: "power2.inOut"
        });

        // "Place" visual
        tl.call(() => {
           if (carriedBlockRef.current) carriedBlockRef.current.visible = false;
           if (block) block.visible = true;
        });

        // Block settles
        tl.to(block.scale, {
          x: 1, y: 1, z: 1,
          duration: 0.2,
          ease: "back.out(1.5)"
        });
      });

      // 3. Equip Wrecking Ball (Get from Storage)
      tl.to(craneCabRef.current!.rotation, {
        y: angleStorage,
        duration: 0.8,
        ease: "power2.inOut"
      });

      // Swap Hook for Ball
      tl.call(() => {
        if (hookRef.current) hookRef.current.visible = false;
        if (ballRef.current) ballRef.current.visible = true;
      });

      // Wait a beat (picking up)
      tl.to({}, { duration: 0.2 });

      // 4. Destruction
      // Swing to building
      tl.to(craneCabRef.current!.rotation, {
        y: angleBuilding,
        duration: 0.4,
        ease: "power1.in"
      });

      // Impact Animation
      tl.to({}, { duration: 0.1 }); // Moment of impact

      // Building Explodes
      buildingBlocksRef.current.forEach((block, i) => {
         if (!block) return;
         const randomX = (Math.random() - 0.5) * 6;
         const randomZ = (Math.random() - 0.5) * 6;
         const randomRot = (Math.random() - 0.5) * Math.PI * 2;

         tl.to(block.position, {
           y: 0.2,
           x: block.position.x + randomX,
           z: block.position.z + randomZ,
           duration: 0.8,
           ease: "power2.out",
         }, "destruction");
         
         tl.to(block.rotation, {
           x: randomRot,
           z: randomRot,
           duration: 0.8
         }, "destruction");
      });

      // Truck gets scared/leaves
      tl.to(truckRef.current!.position, {
        x: 12,
        duration: 1,
        ease: "power2.in"
      }, "destruction+=0.5");

      // 5. Reset
      // Crane back to storage to drop ball
      tl.to(craneCabRef.current!.rotation, {
        y: angleStorage,
        duration: 1,
        ease: "power1.inOut"
      });
      
      tl.call(() => {
        if (hookRef.current) hookRef.current.visible = true;
        if (ballRef.current) ballRef.current.visible = false;
      });

      // Reset Blocks (instant hidden)
      tl.to(buildingBlocksRef.current.map(b => b ? b.scale : null), {
        x: 0, y: 0, z: 0,
        duration: 0.1
      });
      tl.call(() => {
         buildingBlocksRef.current.forEach(b => {
            if(b) {
                b.visible = false;
                b.position.y = b.userData.originalY;
                b.position.x = 0;
                b.position.z = 0;
                b.rotation.set(0,0,0);
            }
         });
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <group ref={containerRef} position={[0, -2, 0]}>
      {/* --- CRANE --- */}
      <group ref={craneRef} position={[-2, 0, -2]}>
        {/* Base */}
        <mesh position={[0, 0.2, 0]}>
          <boxGeometry args={[1.5, 0.4, 1.5]} />
          <meshStandardMaterial color="#F59E0B" />
        </mesh>
        {/* Tower */}
        <mesh position={[0, 3, 0]}>
          <cylinderGeometry args={[0.1, 0.15, 6]} />
          <meshStandardMaterial color="#F59E0B" />
        </mesh>
        {/* Cabin & Jib Group */}
        <group ref={craneCabRef} position={[0, 6, 0]}>
          {/* Cabin */}
          <mesh position={[0, 0, 0]}>
             <boxGeometry args={[0.8, 0.6, 0.8]} />
             <meshStandardMaterial color="#1E40AF" />
          </mesh>
          {/* Jib (Arm) */}
          <mesh position={[0, 0.2, 1.5]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.1, 0.1, 4]} />
            <meshStandardMaterial color="#F59E0B" />
          </mesh>
          {/* Counterweight */}
          <mesh position={[0, 0, -1]}>
             <boxGeometry args={[0.8, 0.5, 1.2]} />
             <meshStandardMaterial color="#4B5563" />
          </mesh>
          
          {/* Hook Assembly (At tip z=3) */}
          <group position={[0, -1.5, 3]}>
             {/* Cable */}
             <mesh position={[0, 1.5, 0]}>
               <cylinderGeometry args={[0.02, 0.02, 3]} />
               <meshStandardMaterial color="#111" />
             </mesh>
             
             {/* Hook */}
             <group ref={hookRef}>
                <mesh position={[0, -0.2, 0]}>
                  <torusGeometry args={[0.2, 0.05, 16, 100, Math.PI]} rotation={[0, 0, Math.PI]} />
                  <meshStandardMaterial color="#555" />
                </mesh>
             </group>

             {/* Wrecking Ball */}
             <mesh ref={ballRef} position={[0, -0.5, 0]} visible={false}>
               <sphereGeometry args={[0.7, 32, 32]} />
               <meshStandardMaterial color="#333" roughness={0.4} metalness={0.8} />
             </mesh>
             
             {/* Carried Block (Visual only) */}
             <mesh ref={carriedBlockRef} position={[0, -0.5, 0]} visible={false}>
                <boxGeometry args={[1.5, 0.5, 1.5]} />
                <meshStandardMaterial color="#E8D5B7" />
             </mesh>
          </group>
        </group>
      </group>

      {/* --- TRUCK --- */}
      <group ref={truckRef} position={[12, 0, 2]}>
         <group rotation={[0, -Math.PI/2, 0]}>
            {/* Chassis */}
            <mesh position={[0, 0.4, 0]}>
            <boxGeometry args={[2.5, 0.2, 1]} />
            <meshStandardMaterial color="#333" />
            </mesh>
            {/* Cabin */}
            <mesh position={[0.8, 1, 0]}>
            <boxGeometry args={[0.8, 1, 1]} />
            <meshStandardMaterial color="#ef4444" />
            </mesh>
            {/* Bed */}
            <mesh position={[-0.5, 0.7, 0]}>
            <boxGeometry args={[1.5, 0.6, 0.9]} />
            <meshStandardMaterial color="#9ca3af" />
            </mesh>
            {/* Blocks in truck */}
            <mesh position={[-0.5, 0.9, 0]}>
                <boxGeometry args={[1.3, 0.4, 0.8]} />
                <meshStandardMaterial color="#E8D5B7" />
            </mesh>
            {/* Wheels */}
            <mesh position={[0.8, 0.25, 0.5]} rotation={[Math.PI/2, 0, 0]}>
                <cylinderGeometry args={[0.25, 0.25, 0.2]} />
                <meshStandardMaterial color="black" />
            </mesh>
            <mesh position={[0.8, 0.25, -0.5]} rotation={[Math.PI/2, 0, 0]}>
                <cylinderGeometry args={[0.25, 0.25, 0.2]} />
                <meshStandardMaterial color="black" />
            </mesh>
            <mesh position={[-0.8, 0.25, 0.5]} rotation={[Math.PI/2, 0, 0]}>
                <cylinderGeometry args={[0.25, 0.25, 0.2]} />
                <meshStandardMaterial color="black" />
            </mesh>
            <mesh position={[-0.8, 0.25, -0.5]} rotation={[Math.PI/2, 0, 0]}>
                <cylinderGeometry args={[0.25, 0.25, 0.2]} />
                <meshStandardMaterial color="black" />
            </mesh>
         </group>
      </group>

      {/* --- BUILDING --- */}
      <group ref={buildingRef} position={[2, 0, -1]}>
        {/* Foundation */}
        <mesh position={[0, 0.1, 0]}>
           <boxGeometry args={[2.2, 0.2, 2.2]} />
           <meshStandardMaterial color="#666" />
        </mesh>
        
        {/* Floors */}
        {Array.from({ length: floors }).map((_, i) => {
           const yPos = 0.2 + 0.3 + (i * floorHeight); 
           return (
             <mesh 
               key={i}
               ref={(el) => {
                 if (el) {
                    buildingBlocksRef.current[i] = el;
                    el.userData = { originalY: yPos };
                 }
               }}
               position={[0, yPos, 0]}
               scale={[0, 0, 0]}
               castShadow
               receiveShadow
               visible={false}
             >
               <boxGeometry args={[2, floorHeight - 0.05, 2]} />
               <meshStandardMaterial color="#E8D5B7" />
               {/* Simple Windows */}
               <mesh position={[0, 0, 1.01]}>
                  <planeGeometry args={[1.8, floorHeight - 0.2]} />
                  <meshStandardMaterial color="#88CCFF" />
               </mesh>
               <mesh position={[0, 0, -1.01]} rotation={[0, Math.PI, 0]}>
                  <planeGeometry args={[1.8, floorHeight - 0.2]} />
                  <meshStandardMaterial color="#88CCFF" />
               </mesh>
               <mesh position={[1.01, 0, 0]} rotation={[0, Math.PI/2, 0]}>
                  <planeGeometry args={[1.8, floorHeight - 0.2]} />
                  <meshStandardMaterial color="#88CCFF" />
               </mesh>
               <mesh position={[-1.01, 0, 0]} rotation={[0, -Math.PI/2, 0]}>
                  <planeGeometry args={[1.8, floorHeight - 0.2]} />
                  <meshStandardMaterial color="#88CCFF" />
               </mesh>
             </mesh>
           );
        })}
      </group>
      
      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]} receiveShadow>
        <planeGeometry args={[40, 40]} />
        <meshStandardMaterial color="#e5e7eb" />
      </mesh>
    </group>
  );
}

