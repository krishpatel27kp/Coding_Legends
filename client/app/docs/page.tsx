'use client';

import { motion } from 'framer-motion';
import {
    Zap,
    Link as LinkIcon,
    BarChart3,
    Code2,
    Copy,
    Check,
    ArrowRight,
    Terminal,
    Database,
    Send
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export default function DocsPage() {
    const [copied, setCopied] = useState(false);

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const codeSnippet = `// Submit your data to DataPulse
fetch('https://api.datapulse.io/v1/submit/YOUR_API_KEY', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    message: 'Hello from my web app!'
  })
});`;

    return (
        <div className="min-h-screen bg-[#020408] text-white selection:bg-purple-500/30">
            {/* Minimalist Background Gradients */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-purple-600/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-600/5 rounded-full blur-[120px]" />
            </div>

            {/* Header */}
            <header className="border-b border-white/5 bg-[#020408]/80 backdrop-blur-xl sticky top-0 z-50">
                <div className="container h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 group">
                        <BarChart3 className="h-6 w-6 text-purple-500 transition-transform group-hover:scale-110" />
                        <span className="font-bold text-xl tracking-tight">DataPulse <span className="text-muted-foreground font-normal">Docs</span></span>
                    </Link>
                    <Link href="/dashboard">
                        <Button variant="ghost" className="text-sm font-medium hover:bg-white/5">Go to Dashboard</Button>
                    </Link>
                </div>
            </header>

            <main className="container py-20 max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {/* section: What is DataPulse */}
                    <section className="mb-24">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-[10px] font-bold text-purple-400 uppercase tracking-widest mb-6">
                            Introduction
                        </div>
                        <h1 className="text-5xl font-extrabold tracking-tight mb-8">What is DataPulse?</h1>
                        <p className="text-xl text-muted-foreground leading-relaxed">
                            DataPulse is an <span className="text-white font-medium">API-first form backend</span>.
                            It allows you to collect data from any frontend (React, Vue, mobile, or even static HTML)
                            without writing any backend code. We handle the database, security, and analytics for you.
                        </p>
                    </section>

                    {/* section: How it Works */}
                    <section className="mb-24">
                        <h2 className="text-3xl font-bold mb-10 flex items-center gap-3">
                            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/20 text-purple-400 text-sm">1</span>
                            How it Works
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <StepCard
                                icon={<Terminal className="h-5 w-5 text-blue-400" />}
                                title="Create Project"
                                desc="Initialize a new project in your dashboard to get a unique API endpoint."
                            />
                            <StepCard
                                icon={<LinkIcon className="h-5 w-5 text-green-400" />}
                                title="Connect API"
                                desc="Send a POST request with your data from any application or form."
                            />
                            <StepCard
                                icon={<BarChart3 className="h-5 w-5 text-purple-400" />}
                                title="Get Insights"
                                desc="Instantly view your data and trends in our premium real-time dashboard."
                            />
                        </div>
                    </section>

                    {/* section: Integration */}
                    <section className="mb-24">
                        <h2 className="text-3xl font-bold mb-10 flex items-center gap-3">
                            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/20 text-purple-400 text-sm">2</span>
                            Implementation Guide
                        </h2>

                        <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                            To send data, use a standard HTTP <code className="text-purple-400 bg-purple-500/10 px-1.5 py-0.5 rounded">POST</code> request.
                            There is no SDK required—just vanilla JavaScript or any library like Axios.
                        </p>

                        <div className="rounded-2xl border border-white/5 bg-[#0A0C10] overflow-hidden mb-12 shadow-2xl">
                            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-white/[0.02]">
                                <span className="text-xs font-mono text-muted-foreground">Standard Fetch API</span>
                                <button
                                    onClick={() => copyToClipboard(codeSnippet)}
                                    className="text-xs text-muted-foreground hover:text-white transition-colors flex items-center gap-2"
                                >
                                    {copied ? <Check className="h-3 w-3 text-green-400" /> : <Copy className="h-3 w-3" />}
                                    {copied ? 'Copied' : 'Copy'}
                                </button>
                            </div>
                            <div className="p-8 overflow-x-auto">
                                <pre className="text-sm font-mono leading-relaxed text-white">
                                    <code className="text-gray-500">// Submit your data to DataPulse</code>{'\n'}
                                    <code className="text-blue-400">fetch</code><code className="text-white">(</code><code className="text-green-400">'https://api.datapulse.io/v1/submit/YOUR_API_KEY'</code><code className="text-white">, {'{'}</code>
                                    {'\n'}  <code className="text-purple-400">method:</code> <code className="text-green-400">'POST'</code>,
                                    {'\n'}  <code className="text-purple-400">headers:</code> <code className="text-white">{'{ '}</code><code className="text-green-400">'Content-Type'</code><code className="text-white">: </code><code className="text-green-400">'application/json'</code><code className="text-white"> {'}'}</code>,
                                    {'\n'}  <code className="text-purple-400">body:</code> <code className="text-yellow-400">JSON</code>.<code className="text-blue-400">stringify</code>(<code className="text-white">{'{'}</code>
                                    {'\n'}    <code className="text-white">email: </code><code className="text-green-400">'user@example.com'</code>,
                                    {'\n'}    <code className="text-white">message: </code><code className="text-green-400">'Hello from my web app!'</code>
                                    {'\n'}  <code className="text-white">{'}'}</code>)
                                    {'\n'}<code className="text-white">{'}'}</code>);
                                </pre>
                            </div>
                        </div>

                        <div className="bg-white/[0.03] border border-white/5 p-8 rounded-2xl">
                            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                <Zap className="h-5 w-5 text-yellow-400" /> Essential Details
                            </h3>
                            <ul className="space-y-4 text-sm text-muted-foreground">
                                <li className="flex items-start gap-3">
                                    <div className="h-1.5 w-1.5 rounded-full bg-purple-500 mt-1.5" />
                                    <span><strong className="text-white">API Key:</strong> Found inside your project settings in the dashboard.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="h-1.5 w-1.5 rounded-full bg-purple-500 mt-1.5" />
                                    <span><strong className="text-white">Data Format:</strong> Any valid JSON object is accepted. We automatically index all fields.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="h-1.5 w-1.5 rounded-full bg-purple-500 mt-1.5" />
                                    <span><strong className="text-white">Security:</strong> We recommend restricting your API key usage to specific domains in the settings.</span>
                                </li>
                            </ul>
                        </div>
                    </section>

                    {/* section: Finish */}
                    <section className="text-center py-12">
                        <h2 className="text-2xl font-bold mb-4">Start collecting data now.</h2>
                        <p className="text-muted-foreground mb-8">No credit card or complex setup required.</p>
                        <div className="flex justify-center gap-4">
                            <Link href="/register">
                                <Button size="lg" className="bg-white text-black hover:bg-white/90 rounded-full px-10 font-bold">
                                    Create Free Account
                                </Button>
                            </Link>
                        </div>
                    </section>
                </motion.div>
            </main>

            <footer className="border-t border-white/5 py-12 text-center">
                <p className="text-xs text-muted-foreground/40 font-mono tracking-widest uppercase">
                    &copy; 2026 DataPulse Labs. All rights reserved.
                </p>
            </footer>
        </div>
    );
}

function StepCard({ icon, title, desc }: { icon: any, title: string, desc: string }) {
    return (
        <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 transition-colors hover:bg-white/[0.04]">
            <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center mb-6 border border-white/5">
                {icon}
            </div>
            <h3 className="font-bold mb-2 text-white">{title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
        </div>
    );
}
