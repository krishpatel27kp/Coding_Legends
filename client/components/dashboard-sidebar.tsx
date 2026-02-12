'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
    LayoutDashboard,
    FolderOpen,
    FileText,
    Settings,
    BarChart3,
    LogOut,
    ChevronLeft,
    ChevronRight,
    Menu,
    Home
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/auth-context';
import { useState, useEffect } from 'react';
import { useMediaQuery } from '@/hooks/use-media-query'; // Assuming hooks exist or I'll standard check

const sidebarItems = [
    {
        title: 'Home',
        href: '/',
        icon: Home,
    },
    {
        title: 'Overview',
        href: '/dashboard',
        icon: LayoutDashboard,
    },
    {
        title: 'Projects',
        href: '/dashboard/projects',
        icon: FolderOpen,
    },
    {
        title: 'Submissions',
        href: '/dashboard/submissions',
        icon: FileText,
    },
    {
        title: 'Exports',
        href: '/dashboard/exports',
        icon: BarChart3,
    },
    {
        title: 'Settings',
        href: '/dashboard/settings',
        icon: Settings,
    },
];

export function DashboardSidebar() {
    const pathname = usePathname();
    const { logout } = useAuth();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    // Custom hook usage or simple resize listener could be used, but for now relying on CSS/state
    // For mobile, we might use a Sheet or just a fixed overlay. 
    // Let's stick to a sophisticated desktop sidebar first that matches the "Glass" aesthetic.

    const SidebarContent = () => (
        <div className="flex flex-col h-full">
            <div className={cn("flex items-center h-20 px-6 border-b border-white/10", isCollapsed ? "justify-center px-0" : "justify-between")}>
                {!isCollapsed && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center gap-2 font-bold text-xl tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400"
                    >
                        <div className="p-1.5 rounded-lg bg-white/10 border border-white/10">
                            <BarChart3 className="w-5 h-5 text-purple-400" />
                        </div>
                        DataPulse
                    </motion.div>
                )}
                {isCollapsed && (
                    <div className="p-2 rounded-xl bg-white/5 border border-white/10">
                        <BarChart3 className="w-6 h-6 text-purple-400" />
                    </div>
                )}
            </div>

            <nav className="flex-1 py-8 px-3 space-y-2 overflow-y-auto">
                {sidebarItems.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;

                    return (
                        <Link key={item.href} href={item.href} className="block group">
                            <div
                                className={cn(
                                    "relative flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300",
                                    isActive
                                        ? "bg-purple-500/20 text-white shadow-[0_0_20px_-5px_rgba(168,85,247,0.4)] border border-purple-500/30"
                                        : "text-muted-foreground hover:bg-white/5 hover:text-white"
                                )}
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-transparent rounded-2xl"
                                        initial={false}
                                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                    />
                                )}

                                <Icon className={cn("w-5 h-5 transition-transform duration-300 group-hover:scale-110", isActive ? "text-purple-300" : "text-muted-foreground group-hover:text-purple-300")} />

                                {!isCollapsed && (
                                    <motion.span
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="font-medium"
                                    >
                                        {item.title}
                                    </motion.span>
                                )}

                                {isActive && !isCollapsed && (
                                    <motion.div
                                        layoutId="glow"
                                        className="absolute right-3 w-1.5 h-1.5 rounded-full bg-purple-400 shadow-[0_0_10px_currentColor]"
                                    />
                                )}
                            </div>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-white/10">
                <Button
                    variant="ghost"
                    className={cn(
                        "w-full justify-start text-muted-foreground hover:text-red-400 hover:bg-red-500/10 transition-colors rounded-xl h-12",
                        isCollapsed && "justify-center px-0"
                    )}
                    onClick={logout}
                >
                    <LogOut className={cn("w-5 h-5", !isCollapsed && "mr-3")} />
                    {!isCollapsed && "Sign Out"}
                </Button>
            </div>
        </div>
    );

    return (
        <>
            {/* Desktop Sidebar */}
            <motion.aside
                initial={false}
                animate={{ width: isCollapsed ? 80 : 280 }}
                className="hidden md:block fixed left-4 top-4 bottom-4 z-40 bg-[#0A0A0A]/80 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl transition-all duration-300 relative group"
            >
                <div className="h-full w-full overflow-hidden">
                    <SidebarContent />
                </div>

                {/* Collapse Toggle - Now properly positioned */}
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="absolute -right-3 top-12 w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center hover:bg-purple-500 transition-colors shadow-lg shadow-purple-500/20 border border-white/20 z-50 text-white"
                    aria-label="Toggle Sidebar"
                >
                    {isCollapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
                </button>
            </motion.aside>

            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
                {isMobileOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileOpen(false)}
                            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
                        />
                        <motion.aside
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            className="fixed inset-y-0 left-0 z-50 w-72 bg-[#0A0A0A] border-r border-white/10 md:hidden"
                        >
                            <div className="relative h-full">
                                <SidebarContent />
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setIsMobileOpen(false)}
                                    className="absolute top-4 right-4 text-muted-foreground"
                                >
                                    <ChevronLeft />
                                </Button>
                            </div>
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            <Button
                variant="ghost"
                size="icon"
                className="fixed top-5 left-4 z-[100] md:hidden bg-white/5 hover:bg-white/10 border border-white/10 backdrop-blur-xl rounded-xl"
                onClick={() => setIsMobileOpen(true)}
            >
                <Menu className="w-5 h-5 text-white" />
            </Button>
        </>
    );
}
