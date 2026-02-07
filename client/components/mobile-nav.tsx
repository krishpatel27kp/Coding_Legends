'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { LayoutDashboard, FileText, Database, Settings, User } from 'lucide-react';

const items = [
    {
        title: 'Home',
        href: '/dashboard',
        icon: LayoutDashboard,
    },
    {
        title: 'Projects',
        href: '/dashboard/projects',
        icon: FileText,
    },
    {
        title: 'Exports',
        href: '/dashboard/exports',
        icon: Database,
    },
    {
        title: 'Settings',
        href: '/dashboard/settings',
        icon: Settings,
    },
];

export function MobileNav() {
    const pathname = usePathname();

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-around border-t bg-background/60 backdrop-blur-lg px-4 pb-safe md:hidden">
            {items.map((item, index) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));

                return (
                    <Link
                        key={index}
                        href={item.href}
                        className={cn(
                            'flex flex-col items-center justify-center gap-1 text-xs font-medium transition-colors',
                            isActive
                                ? 'text-primary'
                                : 'text-muted-foreground hover:text-foreground'
                        )}
                    >
                        <Icon className={cn("h-6 w-6", isActive && "fill-current/20")} />
                        <span>{item.title}</span>
                    </Link>
                );
            })}
        </div>
    );
}
