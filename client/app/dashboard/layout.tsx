'use client';

import Link from 'next/link';
import { MobileNav } from '@/components/mobile-nav';
import { DashboardNav } from '@/components/dashboard-nav';
import { useAuth } from '@/context/auth-context';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { ModeToggle } from '@/components/mode-toggle';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, logout } = useAuth();

    return (
        <div className="flex min-h-screen flex-col">
            {/* Desktop Header */}
            <header className="sticky top-0 z-40 border-b bg-background/60 backdrop-blur-md supports-[backdrop-filter]:bg-background/40 hidden md:block">
                <div className="container flex h-16 items-center justify-between py-4">
                    <div className="flex gap-6 md:gap-10">
                        <Link href="/" className="flex items-center space-x-2">
                            <span className="inline-block font-bold text-xl">DataPulse</span>
                        </Link>
                    </div>
                    <div className="flex items-center gap-4">
                        <ModeToggle />
                        <span className="text-sm text-muted-foreground hidden lg:inline-block">{user?.email}</span>
                        <Button variant="ghost" size="sm" onClick={logout}>
                            <LogOut className="h-4 w-4 mr-2" />
                            Logout
                        </Button>
                    </div>
                </div>
            </header>

            {/* Mobile Header */}
            <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:hidden flex items-center justify-between px-6 h-14">
                <span className="font-bold text-lg">DataPulse</span>
                <Button variant="ghost" size="icon" onClick={logout}>
                    <LogOut className="h-5 w-5" />
                </Button>
            </header>

            <div className="container flex-1 items-start md:grid md:grid-cols-[220px_1fr] md:gap-6 lg:grid-cols-[240px_1fr] lg:gap-10">
                <aside className="fixed top-14 z-30 -ml-2 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 overflow-y-auto border-r md:sticky md:block">
                    <div className="py-6 pr-6 lg:py-8">
                        <DashboardNav />
                    </div>
                </aside>
                <main className="flex w-full flex-col overflow-hidden pb-20 md:pb-8 pt-6">
                    {children}
                </main>
            </div>

            <MobileNav />
        </div>
    );
}
