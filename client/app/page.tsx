'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/auth-context';
import { ArrowRight, BarChart3, ShieldCheck, Zap, CheckCircle2, Infinity, FileJson, Mail, Webhook } from 'lucide-react';
import { ModeToggle } from '@/components/mode-toggle';

export default function LandingPage() {
  const { user } = useAuth();

  const container: any = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item: any = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 50 } }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background selection:bg-primary/20">
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
            <div className="h-9 w-9 rounded-xl bg-primary flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20">
              <BarChart3 className="h-5 w-5" />
            </div>
            <span>DataPulse</span>
          </div>
          <nav className="flex items-center gap-4">
            <ModeToggle />
            {user ? (
              <Link href="/dashboard">
                <Button className="rounded-full px-6 shadow-md hover:shadow-lg transition-all">Dashboard</Button>
              </Link>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login">
                  <Button variant="ghost" className="rounded-full hidden sm:inline-flex">Login</Button>
                </Link>
                <Link href="/register">
                  <Button className="rounded-full shadow-md hover:shadow-lg transition-all">Get Started</Button>
                </Link>
              </div>
            )}
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="container relative grid items-center gap-8 pb-8 pt-6 md:py-20 lg:py-32">
          {/* Background Decoration */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[120px] -z-10 opacity-30 dark:opacity-20 pointer-events-none" />

          <motion.div
            className="flex flex-col items-center gap-6 text-center max-w-4xl mx-auto"
            variants={container}
            initial="hidden"
            animate="show"
          >
            <motion.div variants={item} className="inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80">
              <span className="flex h-2 w-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
              v2.0 is now live
            </motion.div>

            <motion.h1
              variants={item}
              className="text-4xl font-extrabold leading-tight tracking-tight md:text-6xl lg:leading-[1.1] text-foreground"
            >
              The Modern Backend for <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-indigo-600 dark:from-indigo-400 dark:to-primary">Frontend Forms</span>
            </motion.h1>

            <motion.p
              variants={item}
              className="max-w-[750px] text-lg text-muted-foreground sm:text-xl leading-relaxed"
            >
              Collect submissions, analyze data, and automate workflows without managing a server.
              Review submissions in a beautiful real-time dashboard.
            </motion.p>

            <motion.div
              variants={item}
              className="flex flex-col sm:flex-row gap-4 mt-8 w-full justify-center"
            >
              <Link href="/register">
                <Button size="lg" className="rounded-full h-12 px-8 text-base gap-2 shadow-xl shadow-primary/25 hover:scale-105 transition-transform w-full sm:w-auto">
                  Start Building for Free <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/docs">
                <Button variant="outline" size="lg" className="rounded-full h-12 px-8 text-base hover:bg-secondary/50 w-full sm:w-auto">
                  View Documentation
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </section>

        {/* Features Grid */}
        <section className="container py-12 md:py-24">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:gap-8"
          >
            <FeatureCard
              icon={<Zap className="h-6 w-6" />}
              title="Instant Integration"
              description="Point your form action to our API endpoint. Works with React, Vue, Svelte, or plain HTML."
            />
            <FeatureCard
              icon={<ShieldCheck className="h-6 w-6" />}
              title="Enterprise Security"
              description="Bank-grade encryption at rest and in transit. Built-in spam filtering and rate limiting."
            />
            <FeatureCard
              icon={<BarChart3 className="h-6 w-6" />}
              title="Actionable Insights"
              description="Visualize conversion rates, submission trends, and user demographics in real-time."
            />
          </motion.div>
        </section>

        {/* Value Prop Section */}
        <section className="py-24 relative overflow-hidden">
          {/* Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 -z-20 hidden dark:block" />
          <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-50 -z-20 dark:hidden" />

          <div className="container px-4 md:px-6 relative z-10">
            <div className="flex flex-col items-center justify-center text-center space-y-4 mb-16">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                Everything you need to scale
              </h2>
              <p className="text-muted-foreground max-w-[700px] md:text-xl">
                Focus on your product. We handle the form infrastructure.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <ScaleFeatureCard
                icon={<Infinity className="h-5 w-5" />}
                title="Unlimited Projects"
                description="Create as many projects as you need. No arbitrary limits on your creativity."
              />
              <ScaleFeatureCard
                icon={<FileJson className="h-5 w-5" />}
                title="JSON & CSV Export"
                description="Download your data instantly for analysis in Excel, Google Sheets, or Python."
              />
              <ScaleFeatureCard
                icon={<Mail className="h-5 w-5" />}
                title="Email Notifications"
                description="Get notified immediately when a new submission arrives. Never miss a lead."
              />
              <ScaleFeatureCard
                icon={<Webhook className="h-5 w-5" />}
                title="Webhooks & Integrations"
                description="Connect to Zapier, Slack, or your own API to trigger powerful workflows."
              />
            </div>
          </div>
        </section>
      </main>

      <footer className="py-12 border-t bg-background">
        <div className="container flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-md bg-primary/20 flex items-center justify-center text-primary">
              <BarChart3 className="h-3 w-3" />
            </div>
            <span className="font-semibold text-foreground">DataPulse</span>
          </div>
          <p>&copy; 2026 DataPulse Labs. All rights reserved.</p>
          <div className="flex gap-8">
            <Link href="#" className="hover:text-primary transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-primary transition-colors">Terms</Link>
            <Link href="#" className="hover:text-primary transition-colors">Twitter</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: any, title: string, description: string }) {
  return (
    <div className="group relative overflow-hidden rounded-3xl border bg-card p-8 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 text-primary group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-3 tracking-tight">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">
        {description}
      </p>
    </div>
  )
}

function ScaleFeatureCard({ icon, title, description }: { icon: any, title: string, description: string }) {
  return (
    <div className="flex flex-col items-start p-6 bg-card/50 backdrop-blur-sm rounded-2xl border border-white/10 shadow-sm hover:shadow-md transition-all duration-300 hover:bg-card/80 group">
      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary group-hover:scale-110 transition-transform duration-200 shadow-inner shadow-primary/20">
        {icon}
      </div>
      <span className="font-semibold text-lg mb-2">{title}</span>
      <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
    </div>
  )
}
