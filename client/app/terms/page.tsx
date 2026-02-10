'use client';

import { motion } from 'framer-motion';
import { Gavel, Scale, FileText, CheckCircle2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-[#0A0A0A] text-white selection:bg-purple-500/30">
            {/* Header / Nav */}
            <header className="fixed top-0 z-50 w-full border-b border-white/5 bg-background/60 backdrop-blur-xl">
                <div className="container flex h-16 items-center">
                    <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight">
                        <span className="text-purple-500">DataPulse</span> Terms
                    </Link>
                </div>
            </header>

            <main className="container pt-32 pb-20 px-4 md:px-6 max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1 className="text-4xl md:text-5xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
                        Terms of Service
                    </h1>
                    <p className="text-muted-foreground mb-12">Last updated: February 9, 2026</p>

                    <div className="prose prose-invert max-w-none space-y-12">
                        <section>
                            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                                <CheckCircle2 className="w-6 h-6 text-purple-400" /> 1. Acceptance of Terms
                            </h2>
                            <p className="text-muted-foreground leading-relaxed">
                                By accessing or using DataPulse, you agree to be bound by these Terms of Service. If you do not agree to all the terms and conditions of this agreement, you may not access or use our services.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                                <Scale className="w-6 h-6 text-purple-400" /> 2. Fair Use Policy
                            </h2>
                            <p className="text-muted-foreground leading-relaxed">
                                You agree to use DataPulse for lawful purposes only. You are prohibited from using the service to collect sensitive data (like unhashed passwords or raw credit card numbers) in a way that violates PCI or GDPR compliance.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                                <Gavel className="w-6 h-6 text-purple-400" /> 3. Termination
                            </h2>
                            <p className="text-muted-foreground leading-relaxed">
                                We reserve the right to suspend or terminate your account at any time for violation of these terms, including but not limited to spamming, phishing, or illegal activities.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                                <FileText className="w-6 h-6 text-purple-400" /> 4. Liability
                            </h2>
                            <p className="text-muted-foreground leading-relaxed">
                                DataPulse is provided "as is". We are not liable for any damages that may occur from the use of our services, including data loss or service interruptions.
                            </p>
                        </section>
                    </div>

                    <Card className="mt-20 border-purple-500/20 bg-purple-500/5 backdrop-blur-xl">
                        <CardContent className="p-8 text-center">
                            <h3 className="text-xl font-bold mb-4">Questions about our terms?</h3>
                            <p className="text-muted-foreground mb-6">If you have any questions, please reach out to our legal team.</p>
                            <Link href="/contact">
                                <span className="inline-block px-8 py-3 rounded-full bg-white text-black font-bold hover:bg-gray-100 transition-colors cursor-pointer">
                                    Contact Support
                                </span>
                            </Link>
                        </CardContent>
                    </Card>
                </motion.div>
            </main>
        </div>
    );
}
