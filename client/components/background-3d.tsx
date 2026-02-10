'use client';

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';

function Stars(props: any) {
    const ref = useRef<any>(null);

    // Custom sphere generation to avoid maath dependency issues
    const sphere = useMemo(() => {
        const count = 5000;
        const positions = new Float32Array(count * 3);
        const radius = 1.5;

        for (let i = 0; i < count; i++) {
            // Random point in sphere logic
            const u = Math.random();
            const v = Math.random();
            const theta = 2 * Math.PI * u;
            const phi = Math.acos(2 * v - 1);
            const r = Math.cbrt(Math.random()) * radius;

            const x = r * Math.sin(phi) * Math.cos(theta);
            const y = r * Math.sin(phi) * Math.sin(theta);
            const z = r * Math.cos(phi);

            positions[i * 3] = x;
            positions[i * 3 + 1] = y;
            positions[i * 3 + 2] = z;
        }

        return positions;
    }, []);

    useFrame((state, delta) => {
        if (ref.current) {
            ref.current.rotation.x -= delta / 10;
            ref.current.rotation.y -= delta / 15;
        }
    });

    return (
        <group rotation={[0, 0, Math.PI / 4]}>
            <Points ref={ref} positions={sphere} stride={3} frustumCulled={false} {...props}>
                <PointMaterial
                    transparent
                    color="#8b5cf6" // Electric Purple
                    size={0.002}
                    sizeAttenuation={true}
                    depthWrite={false}
                    opacity={0.8}
                />
            </Points>
        </group>
    );
}

function FloatingParticles() {
    const count = 150; // Increased count for better effect
    const mesh = useRef<any>(null);

    const particles = useMemo(() => {
        const temp = [];
        for (let i = 0; i < count; i++) {
            const xFactor = (Math.random() - 0.5) * 10;
            const yFactor = (Math.random() - 0.5) * 10;
            const zFactor = (Math.random() - 0.5) * 10;
            temp.push({ xFactor, yFactor, zFactor });
        }
        return temp;
    }, []);

    useFrame((state) => {
        if (!mesh.current) return;

        // Rotate the entire group gently
        mesh.current.rotation.y = state.clock.getElapsedTime() * 0.05;
        mesh.current.rotation.z = state.clock.getElapsedTime() * 0.02;
    });

    return (
        <group ref={mesh}>
            {particles.map((particle, i) => (
                <mesh key={i} position={[particle.xFactor, particle.yFactor, particle.zFactor]}>
                    <sphereGeometry args={[0.02, 8, 8]} />
                    <meshStandardMaterial
                        color={i % 2 === 0 ? "#8b5cf6" : "#6366f1"}
                        emissive="#4f46e5"
                        emissiveIntensity={0.8}
                        transparent
                        opacity={0.7}
                    />
                </mesh>
            ))}
        </group>
    );
}

export function Background3D() {
    return (
        <div className="fixed inset-0 -z-10 bg-[#020817] overflow-hidden pointer-events-none">
            {/* Gradient Overlay for depth */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/30 via-[#020817] to-purple-950/30" />

            <Canvas camera={{ position: [0, 0, 1] }} dpr={[1, 2]} gl={{ antialias: false }}>
                <React.Suspense fallback={null}>
                    <Stars />
                    <FloatingParticles />
                    <ambientLight intensity={0.5} />
                </React.Suspense>
            </Canvas>
        </div>
    );
}
