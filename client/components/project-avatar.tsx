'use client';

import { cn } from '@/lib/utils';

interface ProjectAvatarProps {
    name: string;
    className?: string;
}

const COLORS = [
    'bg-blue-500/10 text-blue-500',
    'bg-indigo-500/10 text-indigo-500',
    'bg-purple-500/10 text-purple-500',
    'bg-pink-500/10 text-pink-500',
    'bg-rose-500/10 text-rose-500',
    'bg-orange-500/10 text-orange-500',
    'bg-green-500/10 text-green-500',
    'bg-emerald-500/10 text-emerald-500',
    'bg-teal-500/10 text-teal-500',
    'bg-cyan-500/10 text-cyan-500',
];

export function ProjectAvatar({ name, className }: ProjectAvatarProps) {
    const char = name.charAt(0).toUpperCase() || '?';

    // Simple hash to consistently pick a color based on the name
    const hash = name.split('').reduce((acc, curr) => acc + curr.charCodeAt(0), 0);
    const colorClass = COLORS[hash % COLORS.length];

    return (
        <div className={cn(
            "flex h-10 w-10 items-center justify-center rounded-xl font-bold text-lg shadow-inner",
            colorClass,
            className
        )}>
            {char}
        </div>
    );
}
