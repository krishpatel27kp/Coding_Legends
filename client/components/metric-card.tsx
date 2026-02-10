'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';


interface MetricCardProps {
    title: string;
    value: string | number;
    subtitle: string;
    icon: React.ReactNode;
    trend?: {
        value: number;
        label: string;
        isPositive?: boolean;
    };
    borderColor?: string;
    onClick?: () => void;
    isLoading?: boolean;
    isStatus?: boolean;
}

export function MetricCard({
    title,
    value,
    subtitle,
    icon,
    trend,
    borderColor,
    onClick,
    isLoading,
    isStatus
}: MetricCardProps) {
    if (isLoading) {
        return (
            <Card className="h-32 bg-muted/20 animate-pulse rounded-xl border-none" />
        );
    }

    return (
        <motion.div
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            className={cn(
                "cursor-default transition-all duration-200",
                onClick && "cursor-pointer"
            )}
        >
            <Card className={cn(
                "relative overflow-hidden border-none shadow-sm h-full bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-colors",
                borderColor && `border-l-4 ${borderColor}`
            )}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
                    <div className="p-2 bg-primary/5 rounded-lg text-primary/70">
                        {icon}
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="flex items-baseline space-x-3">
                        <div className={cn(
                            "text-3xl font-bold tracking-tight",
                            isStatus && value === "Healthy" ? "text-green-500" : "text-foreground"
                        )}>
                            {value}
                        </div>
                        {isStatus && (
                            <div className="flex items-center">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                </span>
                            </div>
                        )}
                        {trend && (
                            <div className={cn(
                                "flex items-center text-xs font-medium",
                                trend.isPositive ? "text-green-500" : "text-rose-500"
                            )}>
                                {trend.isPositive ? <ArrowUpRight className="h-3 w-3 mr-0.5" /> : <ArrowDownRight className="h-3 w-3 mr-0.5" />}
                                {trend.value}%
                            </div>
                        )}
                    </div>

                    <div className="mt-2 flex items-center justify-between">
                        <p className="text-xs text-muted-foreground line-clamp-1">{subtitle}</p>
                        {trend && (
                            <div
                                title={trend.label}
                                className="text-[10px] text-muted-foreground/60 flex items-center bg-muted/30 px-1.5 py-0.5 rounded cursor-help"
                            >
                                <TrendingUp className="h-2.5 w-2.5 mr-1" />
                                Insight
                            </div>
                        )}
                    </div>
                </CardContent>

                {/* Subtle background decoration */}
                <div className="absolute -right-4 -bottom-4 opacity-[0.03] scale-150 rotate-12 pointer-events-none">
                    {icon}
                </div>
            </Card>
        </motion.div>
    );
}
