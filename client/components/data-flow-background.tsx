'use client';

import { useEffect, useRef, useState } from 'react';

interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    opacity: number;
    pulsePhase: number;
}

export function DataFlowBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationRef = useRef<number | undefined>(undefined);
    const particlesRef = useRef<Particle[]>([]);
    const [mounted, setMounted] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

    // Check for reduced motion preference
    useEffect(() => {
        setMounted(true);
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        setPrefersReducedMotion(mediaQuery.matches);

        const handleChange = (e: MediaQueryListEvent) => {
            setPrefersReducedMotion(e.matches);
        };

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);

    // Pause animation when tab is not visible
    useEffect(() => {
        const handleVisibilityChange = () => {
            setIsVisible(!document.hidden);
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
    }, []);

    useEffect(() => {
        if (!mounted || prefersReducedMotion) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d', { alpha: true });
        if (!ctx) return;

        // Set canvas size
        const updateCanvasSize = () => {
            const dpr = window.devicePixelRatio || 1;
            const rect = canvas.getBoundingClientRect();

            canvas.width = rect.width * dpr;
            canvas.height = rect.height * dpr;

            ctx.scale(dpr, dpr);
            canvas.style.width = `${rect.width}px`;
            canvas.style.height = `${rect.height}px`;
        };

        updateCanvasSize();
        window.addEventListener('resize', updateCanvasSize);

        // Determine particle count based on screen size
        const getParticleCount = () => {
            const width = window.innerWidth;
            if (width < 768) return 20; // Mobile
            if (width < 1024) return 35; // Tablet
            return 50; // Desktop
        };

        // Initialize particles
        const initParticles = () => {
            const count = getParticleCount();
            const particles: Particle[] = [];

            for (let i = 0; i < count; i++) {
                particles.push({
                    x: Math.random() * canvas.width / (window.devicePixelRatio || 1),
                    y: Math.random() * canvas.height / (window.devicePixelRatio || 1),
                    vx: (Math.random() - 0.5) * 0.3, // Very slow movement
                    vy: (Math.random() - 0.5) * 0.3,
                    size: Math.random() * 2 + 1,
                    opacity: Math.random() * 0.3 + 0.1,
                    pulsePhase: Math.random() * Math.PI * 2,
                });
            }

            particlesRef.current = particles;
        };

        initParticles();

        // Use purple/indigo colors that work in both light and dark themes
        const particleColor = '168, 162, 255'; // Light purple/indigo
        const connectionColor = '168, 162, 255';

        // Animation loop
        let lastTime = 0;
        const targetFPS = 30; // Reduced FPS for performance
        const frameInterval = 1000 / targetFPS;

        const animate = (currentTime: number) => {
            if (!isVisible) {
                animationRef.current = requestAnimationFrame(animate);
                return;
            }

            const deltaTime = currentTime - lastTime;

            if (deltaTime >= frameInterval) {
                lastTime = currentTime - (deltaTime % frameInterval);

                const rect = canvas.getBoundingClientRect();
                ctx.clearRect(0, 0, rect.width, rect.height);

                const particles = particlesRef.current;

                // Update and draw particles
                particles.forEach((particle, i) => {
                    // Update position
                    particle.x += particle.vx;
                    particle.y += particle.vy;

                    // Wrap around edges
                    if (particle.x < 0) particle.x = rect.width;
                    if (particle.x > rect.width) particle.x = 0;
                    if (particle.y < 0) particle.y = rect.height;
                    if (particle.y > rect.height) particle.y = 0;

                    // Update pulse
                    particle.pulsePhase += 0.02;
                    const pulse = Math.sin(particle.pulsePhase) * 0.15 + 0.85;

                    // Draw connections to nearby particles
                    particles.forEach((otherParticle, j) => {
                        if (i >= j) return;

                        const dx = particle.x - otherParticle.x;
                        const dy = particle.y - otherParticle.y;
                        const distance = Math.sqrt(dx * dx + dy * dy);

                        const maxDistance = 150;
                        if (distance < maxDistance) {
                            const opacity = (1 - distance / maxDistance) * 0.15 * pulse;
                            ctx.strokeStyle = `rgba(${connectionColor}, ${opacity})`;
                            ctx.lineWidth = 0.5;
                            ctx.beginPath();
                            ctx.moveTo(particle.x, particle.y);
                            ctx.lineTo(otherParticle.x, otherParticle.y);
                            ctx.stroke();
                        }
                    });

                    // Draw particle with glow
                    const particleOpacity = particle.opacity * pulse;

                    // Outer glow
                    const gradient = ctx.createRadialGradient(
                        particle.x, particle.y, 0,
                        particle.x, particle.y, particle.size * 3
                    );
                    gradient.addColorStop(0, `rgba(${particleColor}, ${particleOpacity * 0.6})`);
                    gradient.addColorStop(0.5, `rgba(${particleColor}, ${particleOpacity * 0.2})`);
                    gradient.addColorStop(1, `rgba(${particleColor}, 0)`);

                    ctx.fillStyle = gradient;
                    ctx.beginPath();
                    ctx.arc(particle.x, particle.y, particle.size * 3, 0, Math.PI * 2);
                    ctx.fill();

                    // Core particle
                    ctx.fillStyle = `rgba(${particleColor}, ${particleOpacity})`;
                    ctx.beginPath();
                    ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                    ctx.fill();
                });
            }

            animationRef.current = requestAnimationFrame(animate);
        };

        animationRef.current = requestAnimationFrame(animate);

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
            window.removeEventListener('resize', updateCanvasSize);
        };
    }, [mounted, isVisible, prefersReducedMotion]);

    // Don't render on server or if reduced motion is preferred
    if (!mounted || prefersReducedMotion) {
        return null;
    }

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none z-0"
            style={{
                opacity: 0.4,
                mixBlendMode: 'lighten',
            }}
            aria-hidden="true"
        />
    );
}
