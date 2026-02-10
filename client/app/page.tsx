'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/auth-context';
import { ArrowRight, BarChart3, ShieldCheck, Zap, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils'; // Assuming utils exist

export default function LandingPage() {
  const { user } = useAuth();

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  return (
    <div className="flex min-h-screen flex-col font-sans selection:bg-purple-500/30">

      {/* Navbar */}
      <header className="fixed top-0 z-50 w-full border-b border-white/5 bg-background/60 backdrop-blur-xl supports-[backdrop-filter]:bg-background/30">
        <div className="container flex h-20 items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative h-10 w-10 rounded-xl bg-background border border-white/10 flex items-center justify-center text-primary shadow-2xl">
                <BarChart3 className="h-6 w-6 text-purple-500" />
              </div>
            </div>
            <span className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">DataPulse</span>
          </div>

          <nav className="flex items-center gap-6">
            {user ? (
              <Link href="/dashboard">
                <Button className="rounded-full px-8 py-6 text-base font-semibold bg-white text-black hover:bg-gray-100 shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)] transition-all hover:scale-105">
                  Dashboard
                </Button>
              </Link>
            ) : (
              <div className="flex items-center gap-4">
                <Link href="/login" className="hidden sm:block">
                  <Button variant="ghost" className="rounded-full text-base font-medium text-muted-foreground hover:text-primary hover:bg-white/5 px-6">Login</Button>
                </Link>
                <Link href="/register">
                  <Button className="rounded-full px-8 py-6 text-base font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white border-0 shadow-[0_0_30px_-5px_rgba(139,92,246,0.5)] hover:shadow-[0_0_40px_-5px_rgba(139,92,246,0.7)] transition-all hover:scale-105 hover:-translate-y-0.5">
                    Get Started Free
                  </Button>
                </Link>
              </div>
            )}
          </nav>
        </div>
      </header>

      <main className="flex-1 w-full overflow-x-hidden">

        {/* Hero Section */}
        <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 lg:pb-40 overflow-hidden">

          {/* Glow Effects */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-purple-600/20 rounded-full blur-[120px] -z-10 mix-blend-screen animate-pulse" style={{ animationDuration: '4s' }} />

          <motion.div
            className="container px-4 md:px-6 relative z-10 text-center"
            initial="hidden"
            animate="show"
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm font-medium text-purple-300 backdrop-blur-md mb-8 hover:bg-white/10 transition-colors cursor-default">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
              </span>
              API-First Data Collection
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight mb-8"
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-b from-white to-white/50">The Backend for</span>
              <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 drop-shadow-2xl">
                Modern Frontends
              </span>
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="max-w-2xl mx-auto text-xl md:text-2xl text-muted-foreground/80 leading-relaxed mb-12"
            >
              Stop building form servers. Collect data, analyze trends, and automate workflows with a
              <span className="text-white font-semibold"> single API endpoint</span>.
            </motion.p>

            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link href="/register" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto rounded-full h-14 px-10 text-lg font-bold bg-white text-black hover:bg-gray-100 shadow-[0_0_40px_-10px_rgba(255,255,255,0.4)] transition-all hover:scale-105">
                  Start Building Now <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/docs" className="w-full sm:w-auto">
                <div className="group relative w-full sm:w-auto rounded-full p-[1px] bg-gradient-to-r from-white/20 to-white/0 hover:from-white/40 hover:to-white/10 transition-all">
                  <div className="relative h-14 px-10 rounded-full bg-black/50 backdrop-blur-xl flex items-center justify-center gap-2 group-hover:bg-black/40 transition-all cursor-pointer">
                    <span className="text-lg font-medium text-white group-hover:text-purple-300 transition-colors">Documentation</span>
                    <ChevronRight className="h-4 w-4 text-white/50 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* Code Snippet Visual */}
            <motion.div
              variants={fadeInUp}
              className="mt-24 mx-auto max-w-4xl relative group"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
              <div className="relative rounded-2xl border border-white/10 bg-[#0A0A0A]/90 backdrop-blur-xl p-2 shadow-2xl">
                <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5">
                  <div className="flex gap-2">
                    <div className="h-3 w-3 rounded-full bg-red-500/50" />
                    <div className="h-3 w-3 rounded-full bg-yellow-500/50" />
                    <div className="h-3 w-3 rounded-full bg-green-500/50" />
                  </div>
                  <div className="flex-1 text-center text-xs text-muted-foreground font-mono">submit-form.js</div>
                </div>
                <div className="p-6 md:p-8 overflow-x-auto text-left">
                  <pre className="font-mono text-sm md:text-base leading-relaxed">
                    <code className="text-blue-300">await </code>
                    <code className="text-yellow-300">fetch</code>
                    <code className="text-white">(</code>
                    <code className="text-green-300">'https://api.datapulse.io/v1/submit/{`{API_KEY}`} '</code>
                    <code className="text-white">, {'{'}</code>
                    {'\n'}  <code className="text-purple-300">method:</code> <code className="text-green-300">'POST'</code>,
                    {'\n'}  <code className="text-purple-300">body:</code> <code className="text-yellow-300">JSON</code>.<code className="text-blue-300">stringify</code>(<code className="text-white">{'{'}</code>
                    {'\n'}    <code className="text-white">email: </code><code className="text-green-300">'user@example.com'</code>,
                    {'\n'}    <code className="text-white">message: </code><code className="text-green-300">'DataPulse is amazing!'</code>
                    {'\n'}  <code className="text-white">{'}'}</code>)
                    {'\n'}<code className="text-white">{'}'}</code>);
                  </pre>
                </div>
              </div>
            </motion.div>

          </motion.div>
        </section>

        {/* Features Section */}
        <section className="py-32 relative">
          <div className="container px-4 md:px-6 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <LuxuryFeatureCard
                icon={<Zap className="h-6 w-6 text-yellow-400" />}
                title="Instant Integration"
                description="Paste our endpoint into your form action. No SDKs, no config, no headaches."
              />
              <LuxuryFeatureCard
                icon={<ShieldCheck className="h-6 w-6 text-green-400" />}
                title="Bank-Grade Security"
                description="AES-256 encryption, spam filtering, and automated threat detection included."
              />
              <LuxuryFeatureCard
                icon={<BarChart3 className="h-6 w-6 text-purple-400" />}
                title="Real-Time Analytics"
                description="Visualize conversion funnels and submission trends as they happen."
              />
            </div>
          </div>
        </section>

      </main>

      <footer className="py-12 border-t border-white/5 bg-black/40 backdrop-blur-lg">
        <div className="container flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-muted-foreground/60">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-white/80" />
            <span className="font-semibold text-white/80">DataPulse</span>
          </div>
          <div className="flex gap-8">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
            <Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link>
          </div>
          <p>&copy; 2026 DataPulse Labs</p>
        </div>
      </footer>
    </div>
  );
}

function LuxuryFeatureCard({ icon, title, description }: { icon: any, title: string, description: string }) {
  return (
    <div className="group relative p-8 rounded-3xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.06] transition-all duration-500 hover:-translate-y-2">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />
      <div className="relative z-10">
        <div className="h-14 w-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 shadow-lg">
          {icon}
        </div>
        <h3 className="text-xl font-bold mb-3 text-white tracking-tight">{title}</h3>
        <p className="text-muted-foreground leading-relaxed">{description}</p>
      </div>
    </div>
  )
}
