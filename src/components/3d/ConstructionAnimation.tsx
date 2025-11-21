"use client";

import { useRef, useLayoutEffect } from "react";
import { Group, Mesh, Vector3 } from "three";
import { RoundedBox, Sphere, Cylinder, Box } from "@react-three/drei";
import gsap from "gsap";

const COLORS = {
    truckCab: "#3B82F6", // Bright Blue
    truckBed: "#F97316", // Bright Orange
    truckChassis: "#1F2937",
    truckWheel: "#111827",
    truckWheelRim: "#D1D5DB",
    truckWheelArch: "#64748B",
    craneBase: "#6B7280",
    craneTower: "#FACC15", // Yellow
    craneCab: "#FBBF24",
    craneJib: "#F59E0B",
    craneCounterweight: "#4B5563",
    craneCable: "#1F2937",
    craneHook: "#374151",
    blockColors: ["#EF4444", "#10B981", "#8B5CF6", "#EC4899"], // Red, Green, Purple, Pink
    window: "#DBEAFE",
    windowFrame: "#60A5FA",
    foundation: "#9CA3AF",
    wreckingBall: "#1F2937",
    ground: "#F3F4F6",
};

const BLOCK_SIZE = { x: 1.8, y: 1.2, z: 1.8 };

export default function ConstructionAnimation() {
    const containerRef = useRef<Group>(null);
    const truckRef = useRef<Group>(null);
    const craneRef = useRef<Group>(null);
    const buildingRef = useRef<Group>(null);
    const truckBodyRef = useRef<Group>(null);
    const cranePivotRef = useRef<Group>(null);
    const craneHookGroupRef = useRef<Group>(null);
    const cableRef = useRef<Mesh>(null);
    const hookRef = useRef<Group>(null);
    const carriedBlockRef = useRef<Group>(null);
    const carriedBallRef = useRef<Group>(null);
    const restBallRef = useRef<Group>(null);

    const truckBlocksRef = useRef<(Group | null)[]>([]);
    const buildingBlocksRef = useRef<(Group | null)[]>([]);
    const debrisRef = useRef<Mesh[]>([]);

    const floors = 4;

    // Scene positions
    const TRUCK_START_X = 25;
    const TRUCK_STOP_X = 7;
    const TRUCK_EXIT_X = -25;
    const BUILDING_POS = new Vector3(-4, 0, 0);
    const BALL_REST_POS = new Vector3(4, 0, 4);
    const CRANE_POS = new Vector3(0, 0, -5);

    // Crane angles
    const ANGLE_TRUCK = Math.atan2(TRUCK_STOP_X - CRANE_POS.x, 0 - CRANE_POS.z);
    const ANGLE_BUILDING = Math.atan2(BUILDING_POS.x - CRANE_POS.x, BUILDING_POS.z - CRANE_POS.z);
    const ANGLE_BALL = Math.atan2(BALL_REST_POS.x - CRANE_POS.x, BALL_REST_POS.z - CRANE_POS.z);

    // Heights
    const ANCHOR_HEIGHT = 10.2;
    const TRUCK_BED_Y = 1.4;
    const HOOK_SAFE_HEIGHT = 8;

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.5 });

            // --- RESET ---
            truckBlocksRef.current.forEach(b => b && (b.visible = true));
            buildingBlocksRef.current.forEach(b => {
                if (b) {
                    b.visible = false;
                    b.scale.set(1, 1, 1);
                    b.position.set(0, b.userData.originalY, 0);
                    b.rotation.set(0, 0, 0);
                }
            });
            debrisRef.current.forEach(d => {
                if (d) {
                    d.visible = false;
                    d.scale.set(1, 1, 1);
                    if (d.material && 'opacity' in d.material) {
                        (d.material as any).opacity = 1;
                    }
                }
            });

            if (carriedBlockRef.current) carriedBlockRef.current.visible = false;
            if (carriedBallRef.current) carriedBallRef.current.visible = false;
            if (restBallRef.current) restBallRef.current.visible = true;
            if (truckRef.current) {
                truckRef.current.position.set(TRUCK_START_X, 0, 0);
                truckRef.current.rotation.y = Math.PI;
            }
            if (truckBodyRef.current) {
                truckBodyRef.current.position.y = 0;
                truckBodyRef.current.scale.set(1, 1, 1);
            }
            if (cranePivotRef.current) cranePivotRef.current.rotation.y = ANGLE_TRUCK;

            // Hook initial position
            if (craneHookGroupRef.current && cableRef.current) {
                const startDist = ANCHOR_HEIGHT - HOOK_SAFE_HEIGHT;
                craneHookGroupRef.current.position.y = -startDist;
                cableRef.current.scale.y = startDist;
            }

            // Helper: Move hook
            const moveHook = (targetY: number, duration: number, ease = "power2.out") => {
                const dist = ANCHOR_HEIGHT - targetY;
                tl.to(craneHookGroupRef.current!.position, { y: -dist, duration, ease }, "<");
                tl.to(cableRef.current!.scale, { y: dist, duration, ease }, "<");
            };

            // --- 1. TRUCK ARRIVAL ---
            tl.to(truckRef.current!.position, {
                x: TRUCK_STOP_X,
                duration: 3,
                ease: "power2.out",
            });

            // Bounce animation during movement
            tl.to(truckBodyRef.current!.position, {
                y: "+=0.08",
                duration: 0.3,
                repeat: 9,
                yoyo: true,
                ease: "sine.inOut"
            }, "<");

            // Stop bounce with squash
            tl.to(truckBodyRef.current!.scale, {
                y: 0.85, x: 1.08, z: 1.08,
                duration: 0.15,
                ease: "power2.in"
            });
            tl.to(truckBodyRef.current!.scale, {
                y: 1, x: 1, z: 1,
                duration: 0.3,
                ease: "elastic.out(1, 0.4)"
            });

            tl.add("construction_start", "+=0.3");

            // --- 2. CONSTRUCTION LOOP ---
            for (let i = 0; i < floors; i++) {
                const truckBlock = truckBlocksRef.current[3 - i];
                const buildBlock = buildingBlocksRef.current[i];

                const truckStackIndex = 3 - i;
                const pickupY = TRUCK_BED_Y + (truckStackIndex * BLOCK_SIZE.y) + BLOCK_SIZE.y + 0.3;
                const dropY = 0.2 + (i * BLOCK_SIZE.y) + BLOCK_SIZE.y + 0.15;

                // A. Rotate to truck
                tl.to(cranePivotRef.current!.rotation, {
                    y: ANGLE_TRUCK,
                    duration: 1,
                    ease: "power2.inOut"
                });

                // B. Lower hook to pickup
                tl.add("pickup_" + i);
                moveHook(pickupY, 0.8, "power2.in");

                // C. Grab block
                tl.call(() => {
                    if (truckBlock) truckBlock.visible = false;
                    if (carriedBlockRef.current) {
                        carriedBlockRef.current.visible = true;
                        const mesh = carriedBlockRef.current.children[0] as Mesh;
                        if (mesh?.material) {
                            (mesh.material as any).color.set(COLORS.blockColors[i]);
                        }
                    }
                });

                // Truck suspension reaction
                tl.to(truckBodyRef.current!.position, {
                    y: "+=0.06",
                    duration: 0.12,
                    yoyo: true,
                    repeat: 1,
                    ease: "power1.inOut"
                });

                // D. Lift block
                moveHook(HOOK_SAFE_HEIGHT, 0.9, "power2.out");

                // E. Rotate to building
                tl.to(cranePivotRef.current!.rotation, {
                    y: ANGLE_BUILDING,
                    duration: 1.5,
                    ease: "power2.inOut"
                });

                // F. Lower to building
                moveHook(dropY, 1.1, "power2.inOut");

                // G. Place block with bounce
                tl.call(() => {
                    if (carriedBlockRef.current) carriedBlockRef.current.visible = false;
                    if (buildBlock) {
                        buildBlock.visible = true;
                        gsap.fromTo(
                            buildBlock.scale,
                            { y: 0.75, x: 1.15, z: 1.15 },
                            {
                                y: 1, x: 1, z: 1,
                                duration: 0.5,
                                ease: "elastic.out(1.2, 0.4)"
                            }
                        );
                    }
                });

                tl.add("placed_" + i, "+=0.2");

                // H. Lift empty hook
                moveHook(HOOK_SAFE_HEIGHT, 0.7, "power2.in");
            }

            // --- 3. TRUCK RETURN TO START ---
            tl.add("truck_return", "+=0.5");

            // Rotate to face forward direction (back to start)
            tl.to(truckRef.current!.rotation, {
                y: 0,
                duration: 1,
                ease: "power2.inOut"
            });

            tl.to(truckRef.current!.position, {
                x: TRUCK_START_X,
                duration: 3.5,
                ease: "power1.inOut"
            });

            // Return bounce
            tl.to(truckBodyRef.current!.position, {
                y: "+=0.07",
                duration: 0.28,
                repeat: 11,
                yoyo: true,
                ease: "sine.inOut"
            }, "<");

            // --- 4. EQUIP WRECKING BALL ---
            tl.to(cranePivotRef.current!.rotation, {
                y: ANGLE_BALL,
                duration: 1.8,
                ease: "power2.inOut"
            });

            const ballPickupY = 1.2;
            moveHook(ballPickupY, 1.2);

            tl.call(() => {
                if (restBallRef.current) restBallRef.current.visible = false;
                if (carriedBallRef.current) carriedBallRef.current.visible = true;
                if (hookRef.current) hookRef.current.visible = false;
            });

            // 2. Lift ball to building height
            const ballLiftY = 5.5;
            moveHook(ballLiftY, 1.2);

            // --- 5. DEMOLITION ---
            tl.add("demolition_start", "+=0.3");

            // 3. Rotate to building position (wind up)
            tl.to(cranePivotRef.current!.rotation, {
                y: ANGLE_BUILDING - 0.6,
                duration: 1.4,
                ease: "power1.inOut"
            });

            // 4. Swing forward and destroy building (ONE TIME ONLY)
            tl.add("swing_start");

            tl.to(cranePivotRef.current!.rotation, {
                y: ANGLE_BUILDING,
                duration: 0.6,
                ease: "power2.in"
            }, "swing_start");

            // Building destruction happens at peak of swing
            tl.call(() => {
                // Hide all building blocks INSTANTLY
                buildingBlocksRef.current.forEach(b => {
                    if (b) b.visible = false;
                });

                // Show and animate debris
                debrisRef.current.forEach((d, i) => {
                    if (d) {
                        d.visible = true;
                        const startX = BUILDING_POS.x + (Math.random() - 0.5) * 2;
                        const startY = 0.5 + i * 0.8;
                        const startZ = BUILDING_POS.z + (Math.random() - 0.5) * 2;

                        d.position.set(startX, startY, startZ);
                        d.rotation.set(
                            Math.random() * Math.PI,
                            Math.random() * Math.PI,
                            Math.random() * Math.PI
                        );
                        d.scale.set(1, 1, 1);

                        if (d.material && 'opacity' in d.material) {
                            (d.material as any).opacity = 1;
                        }

                        const targetX = startX + (Math.random() - 0.5) * 10;
                        const targetZ = startZ + (Math.random() - 0.5) * 10;
                        const rotX = Math.random() * 15;
                        const rotY = Math.random() * 15;
                        const rotZ = Math.random() * 15;

                        // Animate debris on main timeline
                        tl.to(d.position, {
                            x: targetX,
                            y: 0.3,
                            z: targetZ,
                            duration: 1.8,
                            ease: "power2.out"
                        }, "swing_start+=0.3");

                        tl.to(d.rotation, {
                            x: rotX,
                            y: rotY,
                            z: rotZ,
                            duration: 1.8
                        }, "swing_start+=0.3");

                        if (d.material && 'opacity' in d.material) {
                            tl.to(d.material, {
                                opacity: 0,
                                duration: 1.2
                            }, "swing_start+=0.9");
                        }

                        tl.to(d.scale, {
                            x: 0.1, y: 0.1, z: 0.1,
                            duration: 1.8
                        }, "swing_start+=0.7");
                    }
                });
            }, undefined, "swing_start+=0.3");

            // 5. Return crane back (after impact, no more swings)
            tl.to(cranePivotRef.current!.rotation, {
                y: ANGLE_BUILDING - 0.4,
                duration: 0.8,
                ease: "power2.out"
            }, "swing_start+=0.6");

            // --- 6. RETURN BALL TO GROUND ---
            tl.add("return_ball", "+=1.5");

            // 6. Rotate to ball position
            tl.to(cranePivotRef.current!.rotation, {
                y: ANGLE_BALL,
                duration: 1.8,
                ease: "power2.inOut"
            }, "return_ball");

            // Lower ball to ground
            moveHook(ballPickupY, 1.2);

            // 7. Release ball
            tl.call(() => {
                if (restBallRef.current) restBallRef.current.visible = true;
                if (carriedBallRef.current) carriedBallRef.current.visible = false;
                if (hookRef.current) hookRef.current.visible = true;
            });

            // Lift hook up
            moveHook(HOOK_SAFE_HEIGHT, 1.0);

            // 8. Return to initial position (ready for next cycle)
            tl.to(cranePivotRef.current!.rotation, {
                y: ANGLE_TRUCK,
                duration: 2,
                ease: "power2.inOut"
            });

            // Final pause before loop restarts
            tl.add("cycle_complete", "+=0.5");

            // Clean up debris before cycle restarts
            tl.call(() => {
                // Hide all debris
                debrisRef.current.forEach(d => {
                    if (d) {
                        d.visible = false;
                        d.scale.set(1, 1, 1);
                        d.position.set(0, 0, 0);
                        if (d.material && 'opacity' in d.material) {
                            (d.material as any).opacity = 1;
                        }
                    }
                });
                // Ensure truck blocks are visible for next cycle
                truckBlocksRef.current.forEach(b => b && (b.visible = true));
            });

        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <group ref={containerRef} position={[0, -2, 0]}>
            {/* GROUND */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]} receiveShadow>
                <planeGeometry args={[100, 100]} />
                <meshStandardMaterial color={COLORS.ground} />
            </mesh>
            <gridHelper args={[100, 50, "#E5E7EB", "#F3F4F6"]} position={[0, 0, 0]} />

            {/* CRANE */}
            <group ref={craneRef} position={[CRANE_POS.x, CRANE_POS.y, CRANE_POS.z]}>
                {/* Base */}
                <RoundedBox args={[3.5, 0.6, 3.5]} radius={0.15} position={[0, 0.3, 0]} castShadow>
                    <meshStandardMaterial color={COLORS.craneBase} />
                </RoundedBox>

                {/* Tower lattice */}
                <group position={[0, 0.6, 0]}>
                    <RoundedBox args={[0.9, 9.5, 0.9]} radius={0.08} position={[0, 4.75, 0]} castShadow>
                        <meshStandardMaterial color={COLORS.craneTower} />
                    </RoundedBox>
                    {/* Cross braces visual */}
                    <RoundedBox args={[0.15, 9, 0.15]} radius={0.05} position={[0.35, 4.75, 0.35]} castShadow>
                        <meshStandardMaterial color={COLORS.craneJib} />
                    </RoundedBox>
                    <RoundedBox args={[0.15, 9, 0.15]} radius={0.05} position={[-0.35, 4.75, -0.35]} castShadow>
                        <meshStandardMaterial color={COLORS.craneJib} />
                    </RoundedBox>
                </group>

                {/* PIVOT */}
                <group ref={cranePivotRef} position={[0, 9.7, 0]}>
                    {/* Cab (larger head) */}
                    <group position={[-1, 0.3, 1]}>
                        <RoundedBox args={[1.6, 2, 1.6]} radius={0.15} position={[0, 1, 0]} castShadow>
                            <meshStandardMaterial color={COLORS.craneCab} />
                        </RoundedBox>
                        {/* Windows */}
                        <mesh position={[0, 1.5, 0.81]}>
                            <planeGeometry args={[1.2, 1.2]} />
                            <meshStandardMaterial color={COLORS.window} />
                        </mesh>
                        <mesh position={[0.81, 1.5, 0]} rotation={[0, Math.PI / 2, 0]}>
                            <planeGeometry args={[1.2, 1.2]} />
                            <meshStandardMaterial color={COLORS.window} />
                        </mesh>
                    </group>

                    {/* Jib */}
                    <group position={[0, 1.5, 1.2]}>
                        {/* Counterweight */}
                        <RoundedBox args={[1.2, 1, 3]} radius={0.12} position={[0, 0, -2.5]} castShadow>
                            <meshStandardMaterial color={COLORS.craneCounterweight} />
                        </RoundedBox>
                        {/* Main boom */}
                        <RoundedBox args={[0.7, 0.7, 11]} radius={0.08} position={[0, 0, 4.5]} castShadow>
                            <meshStandardMaterial color={COLORS.craneJib} />
                        </RoundedBox>
                        {/* Boom support */}
                        <RoundedBox args={[0.4, 0.4, 11]} radius={0.05} position={[0, 0.5, 4.5]} castShadow>
                            <meshStandardMaterial color={COLORS.craneTower} />
                        </RoundedBox>
                    </group>

                    {/* HOOK MECHANISM */}
                    <group position={[0, 1.2, 8]}>
                        {/* Cable */}
                        <mesh ref={cableRef} position={[0, 0, 0]} castShadow>
                            <cylinderGeometry args={[0.04, 0.04, 1]} translate={[0, -0.5, 0]} />
                            <meshStandardMaterial color={COLORS.craneCable} />
                        </mesh>

                        {/* Hook group */}
                        <group ref={craneHookGroupRef} position={[0, 0, 0]}>
                            {/* Hook visual */}
                            <group ref={hookRef}>
                                <Cylinder args={[0.25, 0.25, 0.5, 16]} position={[0, 0.25, 0]} castShadow>
                                    <meshStandardMaterial color={COLORS.craneHook} />
                                </Cylinder>
                                <mesh position={[0, -0.15, 0]}>
                                    <torusGeometry args={[0.2, 0.06, 12, 16, Math.PI]} />
                                    <meshStandardMaterial color={COLORS.craneHook} />
                                </mesh>
                            </group>

                            {/* Carried block */}
                            <group ref={carriedBlockRef} visible={false} position={[0, -0.85, 0]}>
                                <BuildingBlock color="#fff" />
                            </group>

                            {/* Carried ball */}
                            <group ref={carriedBallRef} visible={false} position={[0, -1.6, 0]}>
                                <Sphere args={[0.85, 32, 32]} castShadow>
                                    <meshStandardMaterial color={COLORS.wreckingBall} metalness={0.3} roughness={0.7} />
                                </Sphere>
                                <Cylinder args={[0.06, 0.06, 1]} position={[0, 0.85, 0]}>
                                    <meshStandardMaterial color={COLORS.craneCable} />
                                </Cylinder>
                            </group>
                        </group>
                    </group>
                </group>
            </group>

            {/* TRUCK */}
            <group ref={truckRef} position={[TRUCK_START_X, 0, 0]}>
                <group ref={truckBodyRef}>
                    {/* Chassis */}
                    <RoundedBox args={[4.5, 0.6, 2.4]} radius={0.15} position={[0, 0.7, 0]} castShadow>
                        <meshStandardMaterial color={COLORS.truckChassis} />
                    </RoundedBox>

                    {/* Cabin with rounded forms */}
                    <RoundedBox args={[1.8, 2, 2.4]} radius={0.3} position={[1.4, 1.8, 0]} castShadow>
                        <meshStandardMaterial color={COLORS.truckCab} />
                    </RoundedBox>

                    {/* Windshield */}
                    <mesh position={[2.2, 2, 0]} rotation={[0, Math.PI / 2, 0]}>
                        <planeGeometry args={[2, 1.4]} />
                        <meshStandardMaterial color={COLORS.window} transparent opacity={0.8} />
                    </mesh>

                    {/* Bed */}
                    <RoundedBox args={[2.8, 0.5, 2.2]} radius={0.1} position={[-1, 1.1, 0]} castShadow>
                        <meshStandardMaterial color={COLORS.truckBed} />
                    </RoundedBox>

                    {/* Wheel arches */}
                    <RoundedBox args={[0.8, 0.4, 0.8]} radius={0.1} position={[1.5, 0.5, 1.3]} castShadow>
                        <meshStandardMaterial color={COLORS.truckWheelArch} />
                    </RoundedBox>
                    <RoundedBox args={[0.8, 0.4, 0.8]} radius={0.1} position={[1.5, 0.5, -1.3]} castShadow>
                        <meshStandardMaterial color={COLORS.truckWheelArch} />
                    </RoundedBox>
                    <RoundedBox args={[0.8, 0.4, 0.8]} radius={0.1} position={[-1.5, 0.5, 1.3]} castShadow>
                        <meshStandardMaterial color={COLORS.truckWheelArch} />
                    </RoundedBox>
                    <RoundedBox args={[0.8, 0.4, 0.8]} radius={0.1} position={[-1.5, 0.5, -1.3]} castShadow>
                        <meshStandardMaterial color={COLORS.truckWheelArch} />
                    </RoundedBox>

                    {/* Blocks on truck */}
                    {Array.from({ length: floors }).map((_, i) => (
                        <group
                            key={`truck-block-${i}`}
                            ref={el => { truckBlocksRef.current[i] = el }}
                            position={[-1, 1.5 + (i * BLOCK_SIZE.y) + BLOCK_SIZE.y / 2 - 0.15, 0]}
                        >
                            <BuildingBlock color={COLORS.blockColors[i]} />
                        </group>
                    ))}
                </group>

                {/* Wheels */}
                <Wheel position={[1.6, 0.45, 1.3]} />
                <Wheel position={[1.6, 0.45, -1.3]} />
                <Wheel position={[-1.6, 0.45, 1.3]} />
                <Wheel position={[-1.6, 0.45, -1.3]} />
            </group>

            {/* BUILDING SITE */}
            <group ref={buildingRef} position={[BUILDING_POS.x, BUILDING_POS.y, BUILDING_POS.z]}>
                {/* Foundation */}
                <RoundedBox args={[2.8, 0.25, 2.8]} radius={0.08} position={[0, 0.125, 0]} receiveShadow>
                    <meshStandardMaterial color={COLORS.foundation} />
                </RoundedBox>

                {/* Building blocks */}
                {Array.from({ length: floors }).map((_, i) => (
                    <group
                        key={`build-block-${i}`}
                        ref={el => { buildingBlocksRef.current[i] = el }}
                        visible={false}
                        userData={{ originalY: 0.25 + (i * BLOCK_SIZE.y) + BLOCK_SIZE.y / 2 }}
                        position={[0, 0.25 + (i * BLOCK_SIZE.y) + BLOCK_SIZE.y / 2, 0]}
                    >
                        <BuildingBlock color={COLORS.blockColors[i]} />
                    </group>
                ))}

                {/* Debris pieces */}
                {Array.from({ length: 12 }).map((_, i) => (
                    <mesh
                        key={`debris-${i}`}
                        ref={el => { if (el) debrisRef.current[i] = el }}
                        visible={false}
                        castShadow
                    >
                        <boxGeometry args={[0.7, 0.5, 0.7]} />
                        <meshStandardMaterial
                            color={COLORS.blockColors[i % 4]}
                            transparent
                            opacity={1}
                        />
                    </mesh>
                ))}
            </group>

            {/* WRECKING BALL STAND */}
            <group ref={restBallRef} position={[BALL_REST_POS.x, BALL_REST_POS.y, BALL_REST_POS.z]}>
                <Cylinder args={[0.5, 0.7, 0.6, 16]} position={[0, 0.3, 0]} castShadow receiveShadow>
                    <meshStandardMaterial color="#6B7280" />
                </Cylinder>
                <Sphere args={[0.85, 32, 32]} position={[0, 1.2, 0]} castShadow>
                    <meshStandardMaterial color={COLORS.wreckingBall} metalness={0.3} roughness={0.7} />
                </Sphere>
            </group>
        </group>
    );
}

// Building Block Component
function BuildingBlock({ color }: { color: string }) {
    return (
        <group>
            <RoundedBox args={[BLOCK_SIZE.x, BLOCK_SIZE.y, BLOCK_SIZE.z]} radius={0.08} castShadow receiveShadow>
                <meshStandardMaterial color={color} />
            </RoundedBox>

            {/* Windows - 4 sides with grid pattern */}
            {[
                { pos: [0, 0, BLOCK_SIZE.z / 2 + 0.01], rot: [0, 0, 0] },
                { pos: [0, 0, -BLOCK_SIZE.z / 2 - 0.01], rot: [0, Math.PI, 0] },
                { pos: [BLOCK_SIZE.x / 2 + 0.01, 0, 0], rot: [0, Math.PI / 2, 0] },
                { pos: [-BLOCK_SIZE.x / 2 - 0.01, 0, 0], rot: [0, -Math.PI / 2, 0] }
            ].map((config, idx) => (
                <group key={idx} position={config.pos as any} rotation={config.rot as any}>
                    {/* Window grid 2x2 */}
                    {[-0.3, 0.3].map((x, xi) =>
                        [-0.2, 0.2].map((y, yi) => (
                            <mesh key={`${xi}-${yi}`} position={[x, y, 0]}>
                                <planeGeometry args={[0.35, 0.35]} />
                                <meshStandardMaterial color={COLORS.window} />
                            </mesh>
                        ))
                    )}
                    {/* Frame */}
                    <mesh position={[0, 0, -0.005]}>
                        <planeGeometry args={[1.4, 0.9]} />
                        <meshStandardMaterial color={COLORS.windowFrame} />
                    </mesh>
                </group>
            ))}
        </group>
    );
}

// Wheel Component
function Wheel({ position }: { position: [number, number, number] }) {
    return (
        <group position={position} rotation={[Math.PI / 2, 0, 0]}>
            {/* Tire */}
            <Cylinder args={[0.45, 0.45, 0.5, 20]} castShadow>
                <meshStandardMaterial color={COLORS.truckWheel} />
            </Cylinder>
            {/* Rim */}
            <Cylinder args={[0.25, 0.25, 0.52, 20]}>
                <meshStandardMaterial color={COLORS.truckWheelRim} />
            </Cylinder>
            {/* Hub cap */}
            <Sphere args={[0.15, 16, 16]} position={[0, 0, 0.27]}>
                <meshStandardMaterial color={COLORS.truckWheelRim} metalness={0.6} />
            </Sphere>
        </group>
    );
}
