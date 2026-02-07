'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { LayoutDashboard, FileText, Settings, Database, Download } from 'lucide-react';

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
                            'group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors',
                            pathname === item.href ? 'bg-primary/10 text-primary' : 'text-muted-foreground'
                        )}
                    >
                        <Icon className={cn("mr-2 h-4 w-4", pathname === item.href ? "text-primary" : "text-muted-foreground group-hover:text-primary")} />
                        <span>{item.title}</span>
                    </Link>
                );
            })}
        </nav>
    );
}
