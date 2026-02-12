'use client';

import { motion } from 'framer-motion';
import { Home, ArrowLeft, BarChart3, Search } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
    return (
        <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4 selection:bg-purple-500/30">
            {/* Background Effects */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[120px]" />
            </div>

            <div className="relative z-10 text-center max-w-xl">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-white/5 border border-white/10 mb-8 shadow-2xl">
                        <BarChart3 className="h-10 w-10 text-purple-500" />
                    </div>

                    <h1 className="text-8xl font-black mb-4 tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-white/20">
                        404
                    </h1>

                    <h2 className="text-3xl font-bold mb-6 text-white tracking-tight">
                        Page Not Found
                    </h2>

                    <p className="text-muted-foreground text-lg mb-10 leading-relaxed">
                        The section you're looking for doesn't exist yet or has been moved to a
                        different frequency. Let's get you back on track.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link href="/" className="w-full sm:w-auto">
                            <Button size="lg" className="w-full sm:w-auto rounded-full bg-white text-black hover:bg-gray-200 px-8 font-bold gap-2">
                                <Home className="h-4 w-4" /> Go Home
                            </Button>
                        </Link>
                        <Button
                            variant="outline"
                            size="lg"
                            className="w-full sm:w-auto rounded-full border-white/10 text-white hover:bg-white/5 px-8 gap-2"
                            onClick={() => window.history.back()}
                        >
                            <ArrowLeft className="h-4 w-4" /> Go Back
                        </Button>
                    </div>
                </motion.div>
            </div>

            {/* Footer */}
            <div className="absolute bottom-10 left-0 right-0 text-center">
                <p className="text-xs text-muted-foreground/40 uppercase tracking-[0.3em]">
                    DataPulse Infrastructure
                </p>
            </div>
        </div>
    );
}
