'use client';

import { useAuth } from '@/context/auth-context';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Bell, Search, User, CreditCard, Rocket, ShieldAlert, CheckCircle2, Info, LogOut } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Notification {
    id: string;
    title: string;
    description: string;
    time: string;
    type: 'info' | 'success' | 'warning';
    read: boolean;
}

const MOCK_NOTIFICATIONS: Notification[] = [
    {
        id: '1',
        title: 'New Submission Received',
        description: 'You received a new submission from "Contact Form V2".',
        time: '5m ago',
        type: 'success',
        read: false,
    },
    {
        id: '2',
        title: 'Project Setup Complete',
        description: 'Your project "DataPulse Pro" is now ready for ingestion.',
        time: '2h ago',
        type: 'info',
        read: false,
    },
    {
        id: '3',
        title: 'Unauthorized Origin Blocked',
        description: 'A request from "unknown-site.com" was blocked for security.',
        time: '5h ago',
        type: 'warning',
        read: true,
    },
    {
        id: '4',
        title: 'System Update',
        description: 'New intelligence features have been added to your dashboard.',
        time: '1d ago',
        type: 'info',
        read: true,
    },
];

export function DashboardHeader() {
    const { user, logout } = useAuth();
    const pathname = usePathname();
    const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const unreadCount = notifications.filter(n => !n.read).length;

    const markAllRead = () => {
        setNotifications(notifications.map(n => ({ ...n, read: true })));
    };

    const markRead = (id: string) => {
        setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
    };

    // Format pathname for breadcrumb title
    const title = pathname.split('/').pop()?.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') || 'Overview';

    if (!mounted) {
        return (
            <header className="sticky top-0 z-30 flex h-20 items-center justify-between gap-4 pl-16 pr-6 md:px-10 bg-background/60 backdrop-blur-xl border-b border-white/5 transition-all duration-300">
                <div className="flex-1 min-w-0">
                    <h2 className="text-xl md:text-2xl font-bold tracking-tight capitalize text-white drop-shadow-lg truncate">{title}</h2>
                </div>
            </header>
        );
    }

    return (
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between gap-4 pl-16 pr-6 md:px-10 bg-background/60 backdrop-blur-xl border-b border-white/5 transition-all duration-300">
            <div className="flex-1 min-w-0">
                <h2 className="text-xl md:text-2xl font-bold tracking-tight capitalize text-white drop-shadow-lg truncate">{title}</h2>
                <p className="text-muted-foreground text-xs md:text-sm hidden md:block">
                    Welcome back, {user?.name || user?.email?.split('@')[0]}
                </p>
            </div>

            <div className="flex items-center gap-4 ml-auto">
                {/* Search Bar - Glass Effect */}
                <div className="relative hidden lg:block w-72">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50 transition-colors group-focus-within:text-purple-400" />
                    <Input
                        placeholder="Quick search..."
                        className="pl-12 h-11 rounded-2xl bg-white/[0.03] border-white/5 text-sm focus:bg-white/10 transition-all focus-visible:ring-purple-500/30 font-medium"
                    />
                </div>

                {/* Notifications Dropdown */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="relative rounded-xl h-10 w-10 bg-white/5 hover:bg-white/10 border border-white/5 transition-all">
                            <Bell className="h-5 w-5 text-muted-foreground" />
                            {unreadCount > 0 && (
                                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-purple-500 text-[10px] font-bold text-white shadow-[0_0_10px_rgba(168,85,247,0.5)]">
                                    {unreadCount}
                                </span>
                            )}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-80 md:w-96 p-0 bg-[#0C0E12]/95 backdrop-blur-2xl border-white/5 shadow-2xl rounded-2xl overflow-hidden" align="end">
                        <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                            <div className="flex items-center gap-2">
                                <DropdownMenuLabel className="p-0 text-white font-bold tracking-tight">Activity Feed</DropdownMenuLabel>
                                {unreadCount > 0 && <Badge className="bg-purple-500/10 text-purple-400 border-none px-2 py-0.5 text-[9px]">{unreadCount} New</Badge>}
                            </div>
                            <Button variant="ghost" size="sm" onClick={markAllRead} className="h-8 text-[11px] font-bold text-muted-foreground hover:text-white hover:bg-white/5 rounded-lg px-2">
                                Mark all as read
                            </Button>
                        </div>
                        <ScrollArea className="h-[400px]">
                            <div className="flex flex-col">
                                {notifications.length > 0 ? (
                                    notifications.map((notif) => (
                                        <div
                                            key={notif.id}
                                            onClick={() => markRead(notif.id)}
                                            className={cn(
                                                "p-4 border-b border-white/[0.02] flex gap-4 cursor-pointer hover:bg-white/[0.03] transition-colors group",
                                                !notif.read && "bg-purple-500/[0.02]"
                                            )}
                                        >
                                            <div className={cn(
                                                "h-10 w-10 shrink-0 rounded-xl flex items-center justify-center",
                                                notif.type === 'success' && "bg-green-500/10",
                                                notif.type === 'warning' && "bg-amber-500/10",
                                                notif.type === 'info' && "bg-blue-500/10"
                                            )}>
                                                {notif.type === 'success' && <CheckCircle2 className="h-5 w-5 text-green-400" />}
                                                {notif.type === 'warning' && <ShieldAlert className="h-5 w-5 text-amber-400" />}
                                                {notif.type === 'info' && <Info className="h-5 w-5 text-blue-400" />}
                                            </div>
                                            <div className="flex-1 space-y-1">
                                                <div className="flex items-center justify-between gap-2">
                                                    <p className={cn("text-xs font-bold transition-colors", !notif.read ? "text-white" : "text-muted-foreground")}>{notif.title}</p>
                                                    <span className="text-[10px] text-muted-foreground font-medium shrink-0">{notif.time}</span>
                                                </div>
                                                <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-2">{notif.description}</p>
                                            </div>
                                            {!notif.read && (
                                                <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-1 shrink-0" />
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-20 text-center px-8">
                                        <div className="h-12 w-12 rounded-full bg-white/5 flex items-center justify-center mb-4">
                                            <Bell className="h-6 w-6 text-muted-foreground opacity-20" />
                                        </div>
                                        <p className="text-sm font-bold text-white">All caught up</p>
                                        <p className="text-xs text-muted-foreground mt-1">No new notifications at the moment.</p>
                                    </div>
                                )}
                            </div>
                        </ScrollArea>
                        <div className="p-3 border-t border-white/5 bg-white/[0.01]">
                            <Button variant="ghost" className="w-full text-[11px] font-bold text-muted-foreground hover:text-white h-9 rounded-lg">
                                View all activity logs
                            </Button>
                        </div>
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* User Profile */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="relative h-10 w-10 rounded-full overflow-hidden border-2 border-purple-500/30 p-0 hover:scale-105 transition-transform shadow-lg shadow-purple-500/10">
                            <Avatar className="h-full w-full">
                                <AvatarImage src={`https://avatar.vercel.sh/${user?.email}`} alt={user?.email || ''} />
                                <AvatarFallback>
                                    <User className="h-4 w-4" />
                                </AvatarFallback>
                            </Avatar>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-64 p-2 bg-[#0C0E12]/95 backdrop-blur-2xl border-white/5 rounded-2xl shadow-2xl" align="end" forceMount>
                        <DropdownMenuLabel className="font-normal p-3">
                            <div className="flex flex-col space-y-1">
                                <p className="text-sm font-bold leading-none text-white">
                                    {user?.name || user?.email?.split('@')[0]}
                                </p>
                                <p className="text-[11px] leading-none text-muted-foreground mt-1">
                                    {user?.email}
                                </p>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator className="bg-white/5 mx-2" />
                        <div className="p-1 space-y-1">
                            <DropdownMenuItem
                                className="flex items-center gap-3 p-3 rounded-xl cursor-pointer hover:bg-white/5 transition-colors group"
                                onClick={() => window.location.href = '/dashboard/settings'}
                            >
                                <div className="h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-purple-500/10 transition-colors">
                                    <User className="h-4 w-4 text-muted-foreground group-hover:text-purple-400" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs font-bold text-white">Profile Settings</span>
                                    <span className="text-[10px] text-muted-foreground">Manage your identity</span>
                                </div>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                className="flex items-center gap-3 p-3 rounded-xl cursor-pointer hover:bg-white/5 transition-colors group"
                                onClick={() => window.location.href = '/dashboard/billing'}
                            >
                                <div className="h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-blue-500/10 transition-colors">
                                    <CreditCard className="h-4 w-4 text-muted-foreground group-hover:text-blue-400" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs font-bold text-white">Subscription</span>
                                    <span className="text-[10px] text-muted-foreground">Plan and billing info</span>
                                </div>
                            </DropdownMenuItem>
                        </div>
                        <DropdownMenuSeparator className="bg-white/5 mx-2" />
                        <DropdownMenuItem className="p-3 rounded-xl cursor-pointer text-red-400 hover:text-red-400 hover:bg-red-500/10 focus:bg-red-500/10 flex items-center gap-3 group" onClick={logout}>
                            <div className="h-8 w-8 rounded-lg bg-red-500/5 flex items-center justify-center group-hover:bg-red-500/10 transition-colors">
                                <LogOut className="h-4 w-4 text-red-400" />
                            </div>
                            <span className="text-xs font-bold">Sign out</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}
