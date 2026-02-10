'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus,
    ChevronDown,
    BookOpen,
    Code2,
    Key,
    LayoutGrid
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface QuickActionItem {
    label: string;
    icon: React.ReactNode;
    href: string;
    description?: string;
}

const ACTIONS: QuickActionItem[] = [
    {
        label: 'Create Project',
        icon: <LayoutGrid className="h-4 w-4 text-blue-500" />,
        href: '/dashboard/projects/new',
        description: 'Start a new data collection endpoint'
    },
    {
        label: 'Documentation',
        icon: <BookOpen className="h-4 w-4 text-orange-500" />,
        href: '/docs',
        description: 'Learn how to integrate our API'
    },
    {
        label: 'Developer SDK',
        icon: <Code2 className="h-4 w-4 text-purple-500" />,
        href: '/docs/sdk',
        description: 'Get sample codes for React/Vue'
    },
    {
        label: 'API Keys',
        icon: <Key className="h-4 w-4 text-green-500" />,
        href: '/dashboard/settings',
        description: 'Manage your access tokens'
    }
];

export function QuickActions() {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <Button
                onClick={() => setIsOpen(!isOpen)}
                className="rounded-full px-5 gap-2 shadow-sm transition-all hover:shadow-md"
                variant={isOpen ? "secondary" : "default"}
            >
                <Plus className={cn("h-4 w-4 transition-transform", isOpen && "rotate-45")} />
                Quick Actions
                <ChevronDown className={cn("h-4 w-4 opacity-70 transition-transform", isOpen && "rotate-180")} />
            </Button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="absolute right-0 mt-3 w-72 origin-top-right rounded-2xl border bg-card/95 backdrop-blur-xl p-2 shadow-2xl z-50 overflow-hidden"
                    >
                        <div className="grid gap-1">
                            <div className="px-3 py-2 text-[10px] uppercase font-bold text-muted-foreground/60 tracking-wider">
                                Actions & Shortcuts
                            </div>
                            {ACTIONS.map((action) => (
                                <Link
                                    key={action.label}
                                    href={action.href}
                                    onClick={() => setIsOpen(false)}
                                >
                                    <motion.div
                                        whileHover={{ x: 4, backgroundColor: 'rgba(var(--primary), 0.05)' }}
                                        className="flex items-start gap-3 p-3 rounded-xl transition-colors hover:bg-muted/50 cursor-pointer group"
                                    >
                                        <div className="mt-0.5 p-1.5 rounded-lg bg-background border shadow-sm group-hover:bg-card">
                                            {action.icon}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-semibold">{action.label}</span>
                                            {action.description && (
                                                <span className="text-[10px] text-muted-foreground leading-tight mt-0.5">
                                                    {action.description}
                                                </span>
                                            )}
                                        </div>
                                    </motion.div>
                                </Link>
                            ))}
                        </div>

                        <div className="mt-2 bg-muted/30 p-3 rounded-b-xl border-t bg-slate-50/50 dark:bg-slate-900/50">
                            <p className="text-[10px] text-center text-muted-foreground">
                                Quickly manage your backend infrastructure
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
