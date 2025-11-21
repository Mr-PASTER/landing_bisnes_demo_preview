"use client";

import { useRef, useLayoutEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Group, Mesh, Vector3 } from "three";
import gsap from "gsap";

export default function HouseAnimation() {
  const houseRef = useRef<Group>(null);
  const foundationRef = useRef<Mesh>(null);
  const wallsRef = useRef<Mesh>(null);
  const roofRef = useRef<Mesh>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Initial states
      if (foundationRef.current) foundationRef.current.scale.set(0, 0, 0);
      if (wallsRef.current) wallsRef.current.scale.set(1, 0, 1);
      if (roofRef.current) roofRef.current.position.y = 10;

      const tl = gsap.timeline({ repeat: -1, repeatDelay: 2, yoyo: true });

      // Animation Sequence
      // 1. Foundation
      tl.to(foundationRef.current!.scale, {
        x: 1,
        y: 1,
        z: 1,
        duration: 1,
        ease: "back.out(1.7)",
      });

      // 2. Walls
      tl.to(wallsRef.current!.scale, {
        y: 1,
        duration: 1,
        ease: "power2.out",
      });

      // 3. Roof
      tl.to(roofRef.current!.position, {
        y: 2.5, // On top of walls (height 2 + 0.5)
        duration: 1,
        ease: "bounce.out",
      }, "-=0.5");

    }, houseRef);

    return () => ctx.revert();
  }, []);

  return (
    <group ref={houseRef} position={[0, -1, 0]}>
      {/* Foundation */}
      <mesh ref={foundationRef} position={[0, 0.1, 0]} receiveShadow>
        <boxGeometry args={[4, 0.2, 4]} />
        <meshStandardMaterial color="#555" />
      </mesh>

      {/* Walls */}
      <mesh ref={wallsRef} position={[0, 1.1, 0]} castShadow receiveShadow>
        <boxGeometry args={[3.5, 2, 3.5]} />
        <meshStandardMaterial color="#E8D5B7" />
      </mesh>

      {/* Roof */}
      <mesh ref={roofRef} position={[0, 2.5, 0]} castShadow>
        <coneGeometry args={[2.5, 1.5, 4]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>
    </group>
  );
}

