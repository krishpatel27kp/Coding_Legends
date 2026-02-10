'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MessageSquare, Send, User, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';

export default function ContactPage() {
    const [status, setStatus] = useState<'idle' | 'sending' | 'success'>('idle');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('sending');
        // Mock sending
        setTimeout(() => setStatus('success'), 1500);
    };

    return (
        <div className="min-h-screen bg-[#0A0A0A] text-white selection:bg-purple-500/30 overflow-hidden">
            {/* Background Glows */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-purple-600/10 rounded-full blur-[120px] -z-10" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px] -z-10" />

            {/* Header */}
            <header className="fixed top-0 z-50 w-full border-b border-white/5 bg-background/60 backdrop-blur-xl">
                <div className="container flex h-20 items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight">
                        <span className="text-purple-500">DataPulse</span> Support
                    </Link>
                    <Link href="/login">
                        <Button variant="ghost" className="rounded-full">Back to App</Button>
                    </Link>
                </div>
            </header>

            <main className="container pt-40 pb-20 px-4 md:px-6">
                <div className="grid lg:grid-cols-2 gap-16 items-start">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8">
                            Let's <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">Connect.</span>
                        </h1>
                        <p className="text-xl text-muted-foreground/80 leading-relaxed mb-12 max-w-lg">
                            Have a question, feature request, or just want to say hi? Our team is ready to help you build better data workflows.
                        </p>

                        <div className="space-y-6">
                            <ContactMethod
                                icon={<Mail className="w-5 h-5 text-purple-400" />}
                                title="Email Us"
                                description="support@datapulse.io"
                            />
                            <ContactMethod
                                icon={<MessageSquare className="w-5 h-5 text-purple-400" />}
                                title="Live Chat"
                                description="Available Mon-Fri, 9am - 5pm EST"
                            />
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <Card className="border-white/10 bg-white/5 backdrop-blur-2xl shadow-2xl rounded-3xl overflow-hidden relative">
                            <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/5 to-transparent pointer-events-none" />
                            <CardContent className="p-8 md:p-12 relative z-10">
                                {status === 'success' ? (
                                    <div className="py-12 text-center space-y-6">
                                        <div className="h-20 w-20 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto">
                                            <Send className="h-8 w-8 text-green-500" />
                                        </div>
                                        <h3 className="text-2xl font-bold">Message Sent!</h3>
                                        <p className="text-muted-foreground">We'll get back to you within 24 hours.</p>
                                        <Button onClick={() => setStatus('idle')} variant="outline" className="rounded-full">Send another message</Button>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <Label htmlFor="name">Name</Label>
                                                <div className="relative">
                                                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                                    <Input id="name" placeholder="John Doe" className="pl-10 bg-white/5 border-white/10" required />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="email">Email</Label>
                                                <div className="relative">
                                                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                                    <Input id="email" type="email" placeholder="john@example.com" className="pl-10 bg-white/5 border-white/10" required />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="message">Message</Label>
                                            <Textarea id="message" placeholder="How can we help?" className="min-h-[150px] bg-white/5 border-white/10" required />
                                        </div>
                                        <Button type="submit" className="w-full h-14 rounded-full bg-white text-black font-bold text-lg hover:bg-gray-100 transition-all hover:scale-[1.02]" disabled={status === 'sending'}>
                                            {status === 'sending' ? 'Sending...' : (
                                                <>Send Message <ChevronRight className="ml-2 h-5 w-5" /></>
                                            )}
                                        </Button>
                                    </form>
                                )}
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </main>
        </div>
    );
}

function ContactMethod({ icon, title, description }: { icon: any, title: string, description: string }) {
    return (
        <div className="flex items-center gap-4 group cursor-pointer p-4 rounded-2xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/5">
            <div className="h-12 w-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-purple-500/10 group-hover:border-purple-500/20 transition-all">
                {icon}
            </div>
            <div>
                <p className="text-sm font-bold text-white mb-0.5">{title}</p>
                <p className="text-sm text-muted-foreground">{description}</p>
            </div>
        </div>
    );
}
