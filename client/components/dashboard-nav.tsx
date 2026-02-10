'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { LayoutDashboard, FileText, Settings, Database, Download } from 'lucide-react';
import { motion } from 'framer-motion';

const items = [
    {
        title: 'Overview',
        href: '/dashboard',
        icon: LayoutDashboard,
    },
    {
        title: 'Projects',
        href: '/dashboard/projects',
        icon: FileText,
    },
    {
        title: 'Submissions',
        href: '/dashboard/submissions',
        icon: Database,
    },
    {
        title: 'Exports', // Added Exports link
        href: '/dashboard/exports',
        icon: Download, // Used Download icon from lucide-react
    },
    {
        title: 'Settings',
        href: '/dashboard/settings',
        icon: Settings,
    },
];

export function DashboardNav() {
    const pathname = usePathname();

    return (
        <nav className="grid items-start gap-2 px-2 lg:px-4">
            {items.map((item, index) => {
                const Icon = item.icon;
                return (
                    <Link
                        key={index}
                        href={item.href}
                        className={cn(
                            'group relative flex items-center rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ease-out',
                            pathname === item.href
                                ? 'bg-primary/10 text-primary shadow-[inset_0_0_0_1px_rgba(var(--primary),0.1)]'
                                : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                        )}
                    >
                        {pathname === item.href && (
                            <motion.div
                                layoutId="active-pill"
                                className="absolute left-0 w-1 h-5 bg-primary rounded-full"
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            />
                        )}
                        <Icon className={cn(
                            "mr-3 h-4 w-4 transition-colors duration-200",
                            pathname === item.href ? "text-primary" : "text-muted-foreground group-hover:text-primary"
                        )} />
                        <span>{item.title}</span>
                    </Link>
                );
            })}
        </nav>
    );
}
