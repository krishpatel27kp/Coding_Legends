'use client';

import { motion } from 'framer-motion';
import { Shield, Lock, Eye, FileText, Globe, Bell } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-[#0A0A0A] text-white selection:bg-purple-500/30">
            {/* Header / Nav */}
            <header className="fixed top-0 z-50 w-full border-b border-white/5 bg-background/60 backdrop-blur-xl">
                <div className="container flex h-16 items-center">
                    <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight">
                        <span className="text-purple-500">DataPulse</span> Privacy
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
                        Privacy Policy
                    </h1>
                    <p className="text-muted-foreground mb-12">Last updated: February 9, 2026</p>

                    <div className="grid gap-8 mb-16">
                        <PolicySection
                            icon={<Shield className="w-5 h-5 text-purple-400" />}
                            title="Your Data is Yours"
                            content="DataPulse does not own any of the data collected through your forms. We act as a processor, ensuring your data is stored securely and delivered only to you."
                        />
                        <PolicySection
                            icon={<Lock className="w-5 h-5 text-purple-400" />}
                            title="Security Standards"
                            content="We use industry-standard AES-256 encryption at rest and TLS 1.3 in transit. Your data is protected by the same security protocols used by modern banking apps."
                        />
                    </div>

                    <div className="prose prose-invert max-w-none space-y-8">
                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">1. Data Collection</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                We collect information that you provide directly to us when you create an account, such as your email address and password. We also collect the data submitted through the endpoints you create ("Customer Data").
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">2. How We Use Information</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                We use your account information to provide, maintain, and improve our services. We use Customer Data solely to provide the services you have requested, such as storing and notifying you of form submissions.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">3. Data Sharing</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                We do not sell, trade, or otherwise transfer your Customer Data to outside parties. We only share information with trusted third parties who assist us in operating our website and conducting our business, only as long as those parties agree to keep this information confidential.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">4. Cookies</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                We use cookies for authentication purposes to keep you logged in. We do not use tracking or advertising cookies.
                            </p>
                        </section>
                    </div>
                </motion.div>
            </main>
        </div>
    );
}

function PolicySection({ icon, title, content }: { icon: any, title: string, content: string }) {
    return (
        <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
            <CardContent className="p-6 flex gap-4">
                <div className="h-10 w-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center shrink-0">
                    {icon}
                </div>
                <div>
                    <h3 className="font-bold text-white mb-1">{title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{content}</p>
                </div>
            </CardContent>
        </Card>
    );
}
