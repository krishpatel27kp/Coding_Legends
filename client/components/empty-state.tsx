'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface EmptyStateProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    action?: {
        label: string;
        href: string;
    };
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-12 px-6 border-2 border-dashed rounded-3xl bg-card/30 backdrop-blur-sm border-muted/50 text-center"
        >
            <div className="bg-primary/10 p-5 rounded-3xl mb-6 text-primary shadow-inner shadow-primary/20">
                {icon}
            </div>
            <h3 className="text-xl font-bold mb-2 tracking-tight">{title}</h3>
            <p className="text-muted-foreground mb-8 max-w-[350px] leading-relaxed">
                {description}
            </p>
            {action && (
                <Link href={action.href}>
                    <Button className="rounded-full px-8 gap-2 shadow-lg shadow-primary/25 hover:scale-105 transition-transform">
                        {action.label} <ArrowRight className="h-4 w-4" />
                    </Button>
                </Link>
            )}
        </motion.div>
    );
}
