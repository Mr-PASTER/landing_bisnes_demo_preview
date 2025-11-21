"use client";

import { useRef, useLayoutEffect } from "react";
import { Group, Mesh, Color, Vector3 } from "three";
import { RoundedBox, Sphere, Cylinder, Box, Torus } from "@react-three/drei";
import gsap from "gsap";

const COLORS = {
  truckCab: "#3B82F6", // Bright Blue
  truckBed: "#F97316", // Bright Orange
  truckChassis: "#1F2937",
  truckWheel: "#111827",
  truckRim: "#9CA3AF",
  craneBase: "#4B5563",
  craneTower: "#FACC15", // Yellow
  craneCab: "#FACC15",
  craneJib: "#FACC15",
  craneCounterweight: "#374151",
  craneCable: "#1F2937",
  blockColors: ["#EF4444", "#10B981", "#8B5CF6", "#EC4899"], // Red, Green, Purple, Pink
  window: "#E0F2FE",
  windowFrame: "#FFFFFF",
  foundation: "#9CA3AF",
  wreckingBall: "#1F2937",
};

const BLOCK_SIZE = { x: 1.8, y: 1.2, z: 1.8 };
const FLOOR_HEIGHT = 1.2;

export default function ConstructionAnimation() {
  const containerRef = useRef<Group>(null);
  const truckRef = useRef<Group>(null);
  const craneRef = useRef<Group>(null);
  const buildingRef = useRef<Group>(null);
  const truckBodyRef = useRef<Group>(null); // For squash/stretch
  const cranePivotRef = useRef<Group>(null); // Rotates Y
  const craneHookGroupRef = useRef<Group>(null); // Moves Y (Cable + Hook)
  const cableRef = useRef<Mesh>(null); // Scales Y
  const hookRef = useRef<Group>(null); // The actual hook mesh
  const carriedBlockRef = useRef<Group>(null); // The block attached to hook
  const carriedBallRef = useRef<Group>(null); // The ball attached to hook
  const restBallRef = useRef<Group>(null); // The ball sitting on the ground

  const truckBlocksRef = useRef<(Group | null)[]>([]);
  const buildingBlocksRef = useRef<(Group | null)[]>([]);
  const debrisRef = useRef<Group[]>([]);

  // Config
  const floors = 4;

  // Positions
  const TRUCK_START_X = 25;
  const TRUCK_STOP_X = 6;
  const TRUCK_EXIT_X = -25;
  const BUILDING_POS = new Vector3(-4, 0, 0);
  const BALL_REST_POS = new Vector3(3, 0, 3); // Where the ball sits initially

  // Crane logic
  // Crane is at [0, 0, -5]
  const CRANE_POS = new Vector3(0, 0, -5);

  const getAngle = (target: Vector3) => {
    return Math.atan2(target.x - CRANE_POS.x, target.z - CRANE_POS.z);
  };

  const ANGLE_TRUCK = Math.atan2(TRUCK_STOP_X - CRANE_POS.x, 0 - CRANE_POS.z); // Truck at z=0
  const ANGLE_BUILDING = Math.atan2(BUILDING_POS.x - CRANE_POS.x, BUILDING_POS.z - CRANE_POS.z);
  const ANGLE_BALL = Math.atan2(BALL_REST_POS.x - CRANE_POS.x, BALL_REST_POS.z - CRANE_POS.z);

  // Heights
  const ANCHOR_HEIGHT = 10; // Crane (0) + Pivot (9) + Anchor (1)
  const TRUCK_BED_Y = 1.3;
  const HOOK_SAFE_HEIGHT = 8; // Safe travel height
  const CABLE_THICKNESS = 0.05;

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ repeat: -1, repeatDelay: 1 });

      // --- 0. INITIAL SETUP ---
      // Reset Visibility
      truckBlocksRef.current.forEach(b => b && (b.visible = true));
      buildingBlocksRef.current.forEach(b => {
        if (b) {
          b.visible = false;
          b.scale.set(1, 1, 1);
          b.position.set(0, b.userData.originalY, 0);
          b.rotation.set(0, 0, 0);
        }
      });
      if (carriedBlockRef.current) carriedBlockRef.current.visible = false;
      if (carriedBallRef.current) carriedBallRef.current.visible = false;
      if (restBallRef.current) restBallRef.current.visible = true;
      
      // TRUCK starts at START X
      if (truckRef.current) {
          truckRef.current.position.x = TRUCK_START_X;
          truckRef.current.rotation.y = 0; // Face +X (forward is -X movement visually if we want it to drive "forward" to left)
      }
      
      if (cranePivotRef.current) cranePivotRef.current.rotation.y = ANGLE_TRUCK; 
      if (debrisRef.current) debrisRef.current.forEach(d => d.visible = false);

      // Set Hook to High Position initially
      if (craneHookGroupRef.current && cableRef.current) {
         const startDist = ANCHOR_HEIGHT - HOOK_SAFE_HEIGHT;
         craneHookGroupRef.current.position.y = -startDist;
         cableRef.current.scale.y = startDist;
         // Ensure cable top is at 0 relative to parent, scaling down
         cableRef.current.position.y = -startDist / 2; 
      }

      // Helper to move hook (Downward Logic)
      // targetY is WORLD height we want the hook to be at
      const moveHook = (targetY: number, duration: number, ease = "power1.inOut") => {
        const dist = ANCHOR_HEIGHT - targetY;
        // Hook moves down by 'dist'
        tl.to(craneHookGroupRef.current!.position, { y: -dist, duration, ease }, "<");
        // Cable length is 'dist'
        tl.to(cableRef.current!.scale, { y: dist, duration, ease }, "<");
        // Cable position needs to be half the length down (since origin is center)
        // OR if origin is top (translate used), just scale.
        // Our cylinder geometry is translated -0.5, so pivot is at top.
        // Scale Y works directly. No position change needed if pivot is correct?
        // Let's check Geometry: translate(0, -0.5, 0).
        // If scale y=10, it extends from 0 to -10. Correct.
        // We DO NOT need to move position if pivot is at top!
        // But wait, the previous code WAS moving position. Let's fix this.
        // If pivot is at top, position should stay at 0 relative to pivot group.
      };

      // --- 1. TRUCK ARRIVAL ---
      // Truck faces -X (Left). 
      // We want it to arrive from Right (positive X) to Left.
      // So it moves from 25 to 6.
      tl.set(truckRef.current!.rotation, { y: 0 }); // Face -X (if model faces -X?)
      // Wait, chassis is Box. Front is where?
      // Cabin is at +X relative to center.
      // So if it moves to -X, the Cabin is at the back? No, Cabin at 1.2 (positive).
      // If moving -X, Cabin is trailing? That's backwards driving.
      // To drive forward to -X, Cabin should be at -X side.
      // Rotate truck 180 deg (PI).
      tl.set(truckRef.current!.rotation, { y: Math.PI }); 
      
      tl.to(truckRef.current!.position, {
        x: TRUCK_STOP_X,
        duration: 2.5,
        ease: "power2.out",
      });
      // Squash & Stretch stop
      tl.to(truckBodyRef.current!.scale, { y: 0.9, x: 1.05, z: 1.05, duration: 0.1, yoyo: true, repeat: 1 }, "-=0.2");

      // --- 2. CONSTRUCTION CYCLE ---
      for (let i = 0; i < floors; i++) {
        const truckBlock = truckBlocksRef.current[3 - i]; // Take from top
        const buildBlock = buildingBlocksRef.current[i]; // Place from bottom
        
        // Calculate Pickup Height (Truck)
        const truckStackIndex = 3 - i;
        // TRUCK_BED_Y is relative to ground?
        // Truck group is at Y=0.
        const pickupY = TRUCK_BED_Y + (truckStackIndex * BLOCK_SIZE.y) + BLOCK_SIZE.y + 0.5; // +0.5 safety margin

        // Calculate Drop Height (Building)
        const dropY = 0.2 + (i * BLOCK_SIZE.y) + BLOCK_SIZE.y + 0.2; 

        // A. Rotate to Truck
        tl.to(cranePivotRef.current!.rotation, { y: ANGLE_TRUCK, duration: 1, ease: "power2.inOut" });
        
        // B. Lower Hook to Pickup
        tl.add("pickup");
        moveHook(pickupY, 0.8, "power1.in");

        // C. Grab
        tl.call(() => {
          if (truckBlock) truckBlock.visible = false;
          if (carriedBlockRef.current) {
            carriedBlockRef.current.visible = true;
            const mesh = carriedBlockRef.current.children[0] as Mesh;
            if (mesh && mesh.material) {
               (mesh.material as any).color.set(COLORS.blockColors[i]);
            }
          }
        });
        tl.to(truckBodyRef.current!.position, { y: "-=0.05", duration: 0.1, yoyo: true, repeat: 1 });

        // D. Lift to Safe Height
        moveHook(HOOK_SAFE_HEIGHT, 0.8, "power1.out");

        // E. Rotate to Building (SQUARE PATH: Lift -> Rotate -> Drop)
        // Wait for lift to finish before rotating? No, sequential is safer for collision but slower.
        // User asked for: "Align vertically to plate, THEN drop". 
        // So we must be at Safe Height, Rotate, Then Drop.
        tl.to(cranePivotRef.current!.rotation, { y: ANGLE_BUILDING, duration: 1.5, ease: "power2.inOut" });

        // F. Lower to Building
        moveHook(dropY, 1.0, "bounce.out(0.3)"); // Slower drop

        // G. Place
        tl.call(() => {
           if (carriedBlockRef.current) carriedBlockRef.current.visible = false;
           if (buildBlock) {
             buildBlock.visible = true;
             gsap.fromTo(buildBlock.scale, { y: 0.8, x: 1.1, z: 1.1 }, { y: 1, x: 1, z: 1, duration: 0.4, ease: "elastic.out(1, 0.5)" });
           }
        });

        // H. Lift Empty
        moveHook(HOOK_SAFE_HEIGHT, 0.6, "power1.in");
      }

      // --- 3. TRUCK EXIT ---
      // Drive forward to Left (-X).
      // Truck is already facing Left (PI rotation).
      tl.to(truckRef.current!.position, { x: TRUCK_EXIT_X, duration: 3, ease: "power1.in" });

      // --- 4. EQUIP WRECKING BALL ---
      // Rotate to ball
      tl.to(cranePivotRef.current!.rotation, { y: ANGLE_BALL, duration: 1.5, ease: "power2.inOut" });
      
      // Lower to ball
      const ballY = 1.0; // Slightly higher than ground
      moveHook(ballY, 1.0);

      // Grab Ball
      tl.call(() => {
         if (restBallRef.current) restBallRef.current.visible = false;
         if (carriedBallRef.current) carriedBallRef.current.visible = true;
         if (hookRef.current) hookRef.current.visible = false; 
      });

      // Lift Ball
      const smashHeight = 5;
      moveHook(smashHeight, 1.0);

      // --- 5. SMASH ---
      // Rotate to Building
      tl.to(cranePivotRef.current!.rotation, { y: ANGLE_BUILDING - 0.5, duration: 1.2, ease: "power1.inOut" }); // Wind up
      tl.to(cranePivotRef.current!.rotation, { y: ANGLE_BUILDING, duration: 0.4, ease: "back.out(2)" }); // Swing

      // Impact
      tl.call(() => {
         buildingBlocksRef.current.forEach(b => b && (b.visible = false));
         debrisRef.current.forEach((d, i) => {
            if (d) {
                d.visible = true;
                d.position.set(BUILDING_POS.x + (Math.random()-0.5)*2, 1 + i * 1.2, BUILDING_POS.z + (Math.random()-0.5)*2);
                d.rotation.set(Math.random()*Math.PI, Math.random()*Math.PI, 0);
                
                // Ground collision check in animation
                // We animate Y to 0.2 (ground level approx)
                gsap.to(d.position, { 
                    x: d.position.x + (Math.random()-0.5) * 8,
                    y: 0.2, // LAND ON GROUND
                    z: d.position.z + (Math.random()-0.5) * 8,
                    duration: 1.5,
                    ease: "bounce.out"
                });
                gsap.to(d.rotation, {
                    x: Math.random() * 10,
                    z: Math.random() * 10,
                    duration: 1.5
                });
                gsap.to(d.scale, {
                    x: 0, y: 0, z: 0,
                    duration: 1.5,
                    delay: 0.5
                });
            }
         });
      });
      
      // Ball Recoil
      tl.to(cranePivotRef.current!.rotation, { y: ANGLE_BUILDING - 0.2, duration: 0.5, ease: "power1.inOut" });

      // --- 6. RESET ---
      // Return ball
      tl.to(cranePivotRef.current!.rotation, { y: ANGLE_BALL, duration: 2 });
      moveHook(ballY, 1.0);
      
      tl.call(() => {
         if (restBallRef.current) restBallRef.current.visible = true;
         if (carriedBallRef.current) carriedBallRef.current.visible = false;
         if (hookRef.current) hookRef.current.visible = true;
      });

      // Lift Hook
      moveHook(HOOK_SAFE_HEIGHT, 1.0);

      // Rotate to Neutral/Truck
      tl.to(cranePivotRef.current!.rotation, { y: ANGLE_TRUCK, duration: 2 });
      
      // Reset Scenes
      tl.call(() => {
          debrisRef.current.forEach(d => {
              if(d) {
                  d.visible = false;
                  d.scale.set(1,1,1);
              }
          });
          truckBlocksRef.current.forEach(b => b && (b.visible = true));
      });

    }, containerRef);

    return () => ctx.revert();
  }, [floors]);

  return (
    <group ref={containerRef} position={[0, -2, 0]}>
      {/* --- GROUND --- */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]} receiveShadow>
        <planeGeometry args={[80, 80]} />
        <meshStandardMaterial color="#f3f4f6" />
      </mesh>
      <gridHelper args={[80, 40, "#e5e7eb", "#f3f4f6"]} position={[0, -0.05, 0]} />

      {/* --- CRANE --- */}
      <group ref={craneRef} position={[CRANE_POS.x, CRANE_POS.y, CRANE_POS.z]}>
         {/* Base */}
         <RoundedBox args={[3, 0.5, 3]} radius={0.1} position={[0, 0.25, 0]}>
            <meshStandardMaterial color={COLORS.craneBase} />
         </RoundedBox>
         {/* Tower */}
         <group position={[0, 0.5, 0]}>
             <RoundedBox args={[0.8, 9, 0.8]} radius={0.05} position={[0, 4.5, 0]}>
                 <meshStandardMaterial color={COLORS.craneTower} />
             </RoundedBox>
         </group>
         
         {/* PIVOT GROUP (Cab + Jib + Hook) */}
         <group ref={cranePivotRef} position={[0, 9, 0]}>
             {/* Cab */}
             <group position={[-0.8, 0, 0.8]}>
                <RoundedBox args={[1.2, 1.5, 1.2]} radius={0.1} position={[0, 0.75, 0]}>
                    <meshStandardMaterial color={COLORS.craneCab} />
                </RoundedBox>
                {/* Window */}
                <mesh position={[0, 1, 0.61]}>
                   <planeGeometry args={[0.8, 0.8]} />
                   <meshStandardMaterial color={COLORS.window} />
                </mesh>
             </group>
             
             {/* Jib (Boom) */}
             <group position={[0, 1.2, 1]}>
                 <RoundedBox args={[1, 0.8, 2.5]} radius={0.1} position={[0, 0, -2]}>
                     <meshStandardMaterial color={COLORS.craneCounterweight} />
                 </RoundedBox>
                 <RoundedBox args={[0.6, 0.6, 10]} radius={0.05} position={[0, 0, 4]}>
                     <meshStandardMaterial color={COLORS.craneJib} />
                 </RoundedBox>
             </group>
             
             {/* HOOK MECHANISM */}
             <group position={[0, 1, 7]}>
                 {/* Cable (Scalable) */}
                 <mesh ref={cableRef} position={[0, 0, 0]}>
                     {/* Translate geometry so Pivot (0,0,0) is at TOP of cylinder */}
                     {/* Cylinder height 1. Center at 0. Top at 0.5. Shift down by 0.5. */}
                     <cylinderGeometry args={[0.03, 0.03, 1]} translate={[0, -0.5, 0]} />
                     <meshStandardMaterial color={COLORS.craneCable} />
                 </mesh>
                 
                 {/* Hook Group (Moves Up/Down) */}
                 <group ref={craneHookGroupRef} position={[0, 0, 0]}>
                     {/* The visual Hook */}
                     <group ref={hookRef}>
                        <mesh position={[0, 0.2, 0]}>
                            <cylinderGeometry args={[0.2, 0.2, 0.4]} />
                            <meshStandardMaterial color="#333" />
                        </mesh>
                        <mesh position={[0, -0.2, 0]} rotation={[0, Math.PI/2, 0]}>
                             <Torus args={[0.15, 0.04, 8, 16, Math.PI]} rotation={[0, 0, Math.PI]} >
                                <meshStandardMaterial color="#555" />
                             </Torus>
                        </mesh>
                     </group>
                     
                     {/* Carried Block (Hidden by default) */}
                     <group ref={carriedBlockRef} visible={false} position={[0, -0.8, 0]}>
                         <BuildingBlock color="#fff" />
                     </group>

                     {/* Carried Ball (Hidden by default) */}
                     <group ref={carriedBallRef} visible={false} position={[0, -1.5, 0]}>
                        <Sphere args={[0.8, 32, 32]}>
                           <meshStandardMaterial color={COLORS.wreckingBall} roughness={0.2} />
                        </Sphere>
                        {/* Chain */}
                        <mesh position={[0, 0.8, 0]}>
                             <cylinderGeometry args={[0.05, 0.05, 0.8]} />
                             <meshStandardMaterial color="#333" />
                        </mesh>
                     </group>
                 </group>
             </group>
         </group>
      </group>

      {/* --- TRUCK --- */}
      <group ref={truckRef} position={[TRUCK_START_X, 0, 0]}>
          <group ref={truckBodyRef}>
              <RoundedBox args={[4, 0.5, 2]} radius={0.1} position={[0, 0.6, 0]}>
                  <meshStandardMaterial color={COLORS.truckChassis} />
              </RoundedBox>
              {/* Cab moved to positive X */}
              <RoundedBox args={[1.5, 1.8, 2]} radius={0.2} position={[1.2, 1.6, 0]}>
                  <meshStandardMaterial color={COLORS.truckCab} />
              </RoundedBox>
              <mesh position={[1.96, 1.8, 0]} rotation={[0, Math.PI/2, 0]}>
                  <planeGeometry args={[1.6, 1]} />
                  <meshStandardMaterial color={COLORS.window} />
              </mesh>
              <RoundedBox args={[2.4, 0.4, 1.9]} radius={0.05} position={[-0.8, 0.9, 0]}>
                  <meshStandardMaterial color={COLORS.truckBed} />
              </RoundedBox>
              
              {/* Truck Blocks */}
              {Array.from({ length: floors }).map((_, i) => (
                  <group 
                    key={`truck-block-${i}`}
                    ref={el => { truckBlocksRef.current[i] = el }}
                    position={[-0.8, 1.3 + (i * BLOCK_SIZE.y) + BLOCK_SIZE.y/2 - 0.2, 0]} 
                  >
                      <BuildingBlock color={COLORS.blockColors[i]} />
                  </group>
              ))}
          </group>
          
          <Wheel position={[1.2, 0.4, 1]} />
          <Wheel position={[1.2, 0.4, -1]} />
          <Wheel position={[-1.2, 0.4, 1]} />
          <Wheel position={[-1.2, 0.4, -1]} />
      </group>

      {/* --- BUILDING AREA --- */}
      <group ref={buildingRef} position={[BUILDING_POS.x, BUILDING_POS.y, BUILDING_POS.z]}>
          <RoundedBox args={[2.5, 0.2, 2.5]} radius={0.05} position={[0, 0.1, 0]}>
              <meshStandardMaterial color={COLORS.foundation} />
          </RoundedBox>
          
          {/* Blocks */}
          {Array.from({ length: floors }).map((_, i) => (
              <group 
                key={`build-block-${i}`}
                ref={el => { buildingBlocksRef.current[i] = el }}
                visible={false}
                userData={{ originalY: 0.2 + (i * BLOCK_SIZE.y) + BLOCK_SIZE.y/2 }}
                position={[0, 0.2 + (i * BLOCK_SIZE.y) + BLOCK_SIZE.y/2, 0]}
              >
                  <BuildingBlock color={COLORS.blockColors[i]} />
              </group>
          ))}
          
          {/* Debris */}
          {Array.from({ length: 8 }).map((_, i) => (
              <group key={`debris-${i}`} ref={el => { debrisRef.current[i] = el! }} visible={false}>
                  <Box args={[0.8, 0.6, 0.8]}>
                      <meshStandardMaterial color={COLORS.blockColors[i % 4]} />
                  </Box>
              </group>
          ))}
      </group>

      {/* --- WRECKING BALL REST --- */}
      <group ref={restBallRef} position={[BALL_REST_POS.x, BALL_REST_POS.y, BALL_REST_POS.z]}>
          <Cylinder args={[0.4, 0.6, 0.5]} position={[0, 0.25, 0]}>
              <meshStandardMaterial color="#666" />
          </Cylinder>
          <Sphere args={[0.8, 32, 32]} position={[0, 1.1, 0]}>
              <meshStandardMaterial color={COLORS.wreckingBall} roughness={0.2} />
          </Sphere>
      </group>

    </group>
  );
}

// Subcomponents
function BuildingBlock({ color }: { color: string }) {
    return (
        <group>
            <RoundedBox args={[BLOCK_SIZE.x, BLOCK_SIZE.y, BLOCK_SIZE.z]} radius={0.05}>
                <meshStandardMaterial color={color} />
            </RoundedBox>
            <Window position={[0, 0, BLOCK_SIZE.z/2 + 0.01]} />
            <Window position={[0, 0, -BLOCK_SIZE.z/2 - 0.01]} />
            <Window position={[BLOCK_SIZE.x/2 + 0.01, 0, 0]} rotation={[0, Math.PI/2, 0]} />
            <Window position={[-BLOCK_SIZE.x/2 - 0.01, 0, 0]} rotation={[0, Math.PI/2, 0]} />
        </group>
    )
}

function Window({ position, rotation }: { position: any, rotation?: any }) {
    return (
        <mesh position={position} rotation={rotation}>
            <planeGeometry args={[1.2, 0.8]} />
            <meshStandardMaterial color={COLORS.window} />
        </mesh>
    )
}

function Wheel({ position }: { position: any }) {
    return (
        <group position={position} rotation={[Math.PI/2, 0, 0]}>
            <Cylinder args={[0.4, 0.4, 0.4, 16]} rotation={[0,0,0]}>
                <meshStandardMaterial color={COLORS.truckWheel} />
            </Cylinder>
            <Cylinder args={[0.2, 0.2, 0.42, 16]}>
                <meshStandardMaterial color={COLORS.truckRim} />
            </Cylinder>
        </group>
    )
}
