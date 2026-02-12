'use client';

import { motion } from 'framer-motion';
import {
    Code2,
    ArrowLeft,
    ChevronRight,
    Puzzle,
    Package,
    Layers,
    Sparkles,
    BarChart3,
    Terminal,
    Search,
    Command,
    ExternalLink,
    Zap,
    Globe
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';

export default function SDKPage() {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="min-h-screen bg-[#050608] text-white selection:bg-cyan-500/30 font-sans overflow-x-hidden">
            {/* Mesh Background */}
            <div className="fixed inset-0 pointer-events-none -z-10">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[120px]" />
            </div>

            {/* Nav */}
            <nav className={cn(
                "fixed top-0 z-[60] w-full transition-all duration-500 border-b",
                scrolled
                    ? "bg-[#050608]/80 backdrop-blur-2xl py-3 border-white/5"
                    : "bg-transparent py-6 border-transparent"
            )}>
                <div className="container flex items-center justify-between">
                    <Link href="/docs" className="flex items-center gap-4 group">
                        <div className="h-8 w-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-cyan-500/20 group-hover:border-cyan-500/40 transition-all">
                            <ArrowLeft className="h-4 w-4 text-muted-foreground group-hover:text-cyan-400 group-hover:-translate-x-0.5 transition-all" />
                        </div>
                        <span className="font-bold text-lg tracking-tight">Developer <span className="text-cyan-500">SDKs</span></span>
                    </Link>
                    <div className="flex items-center gap-4">
                        <Link href="/dashboard">
                            <Button variant="ghost" size="sm" className="hidden sm:flex text-muted-foreground hover:text-white">Console</Button>
                        </Link>
                        <Link href="/contact">
                            <Button size="sm" className="bg-white text-black hover:bg-gray-200 rounded-full px-6 font-bold">Request Access</Button>
                        </Link>
                    </div>
                </div>
            </nav>

            <div className="container pt-40 pb-32">
                <div className="max-w-5xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-24"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-[10px] font-bold text-cyan-400 uppercase tracking-widest mb-8">
                            <Package className="h-3.5 w-3.5" /> Platform Libraries
                        </div>

                        <h1 className="text-6xl md:text-7xl font-extrabold tracking-tighter mb-8 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40">
                            Build with <span className="text-cyan-500">Precision.</span>
                        </h1>

                        <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                            Ultra-lightweight, type-safe libraries for every stack.
                            Our SDKs are built for performance first, adding zero overhead to your production bundles.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
                        <NewSDKCard
                            icon={<Code2 className="h-10 w-10 text-cyan-400" />}
                            name="React & Next.js"
                            version="v2.4.0"
                            active
                            desc="Optimized for Server Components and App Router. Includes full TypeScript support and auto-caching."
                        />
                        <NewSDKCard
                            icon={<Layers className="h-10 w-10 text-blue-400" />}
                            name="Vue / Nuxt"
                            version="v1.1.2"
                            active
                            desc="First-class support for Composition API. Built-in error boundaries and state management."
                        />
                        <NewSDKCard
                            icon={<Terminal className="h-10 w-10 text-indigo-400" />}
                            name="Node.js Core"
                            version="v3.0.0"
                            desc="Low-level ingestion client for high-scale backend services. Zero dependencies."
                        />
                        <NewSDKCard
                            icon={<Globe className="h-10 w-10 text-emerald-400" />}
                            name="Edge Client"
                            version="v0.8.0"
                            desc="Lightweight tracking for Cloudflare Workers, Vercel Edge, and Bun."
                        />
                    </div>

                    {/* Integrated Terminal Visual */}
                    <div className="relative p-1 px-1 rounded-[2.5rem] bg-gradient-to-b from-white/10 to-transparent">
                        <div className="bg-[#0A0C10] rounded-[2.4rem] overflow-hidden border border-white/5">
                            <div className="flex items-center gap-3 px-8 py-6 bg-white/[0.02] border-b border-white/5 justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-xl bg-cyan-500/10 flex items-center justify-center">
                                        <Zap className="h-5 w-5 text-cyan-400" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-white">Quick Installation</h4>
                                        <p className="text-[10px] text-muted-foreground uppercase tracking-widest">NPM / YARN / PNPM</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <div className="w-3 h-3 rounded-full bg-white/5" />
                                    <div className="w-3 h-3 rounded-full bg-white/10" />
                                </div>
                            </div>
                            <div className="p-10 font-mono text-lg bg-black/40">
                                <div className="flex items-center gap-4 text-white/40">
                                    <span>$</span>
                                    <code className="text-cyan-400">npm <span className="text-white">install</span> @datapulse/client</code>
                                </div>
                                <div className="flex items-center gap-4 mt-4 text-white/40">
                                    <span>$</span>
                                    <code className="text-indigo-400 underline underline-offset-4 decoration-indigo-500/30">datapulse-cli <span className="text-white">init</span></code>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <footer className="py-20 border-t border-white/5 bg-[#050608]/40">
                <div className="container flex flex-col items-center">
                    <BarChart3 className="h-10 w-10 text-cyan-500/20 mb-8" />
                    <p className="text-xs font-mono text-muted-foreground/30 uppercase tracking-[0.4em]">
                        DataPulse SDK Registry — Global Distributed
                    </p>
                </div>
            </footer>
        </div>
    );
}

function NewSDKCard({ icon, name, version, desc, active }: { icon: any, name: string, version: string, desc: string, active?: boolean }) {
    return (
        <div className="group relative p-10 rounded-[2.5rem] bg-[#0A0C10] border border-white/5 hover:bg-white/[0.04] transition-all duration-500 hover:-translate-y-2">
            <div className="flex items-center justify-between mb-8">
                <div className="h-16 w-16 rounded-[1.25rem] bg-white/[0.02] border border-white/5 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                    {icon}
                </div>
                {active && (
                    <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-bold text-emerald-400 uppercase tracking-widest">
                        Production Ready
                    </div>
                )}
            </div>
            <div className="text-[10px] font-mono text-cyan-500/60 uppercase tracking-widest mb-1">{version}</div>
            <h3 className="text-2xl font-extrabold mb-4 text-white tracking-tight">{name}</h3>
            <p className="text-muted-foreground/80 leading-relaxed mb-8 text-sm">{desc}</p>
            <Button variant="ghost" className="w-full rounded-2xl border border-white/5 hover:bg-white/5 hover:text-cyan-400 text-xs font-bold uppercase tracking-widest transition-all">
                View Docs <ChevronRight className="h-3 w-3 ml-2" />
            </Button>
        </div>
    );
}
