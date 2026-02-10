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
import { Bell, Search, User, CreditCard } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { usePathname } from 'next/navigation';

export function DashboardHeader() {
    const { user, logout } = useAuth();
    const pathname = usePathname();

    // Format pathname for breadcrumb title
    const title = pathname.split('/').pop()?.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') || 'Overview';

    return (
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between gap-4 px-12 md:px-10 bg-background/60 backdrop-blur-xl border-b border-white/5 transition-all duration-300">
            <div className="flex-1 min-w-0">
                <h2 className="text-xl md:text-2xl font-bold tracking-tight capitalize text-white drop-shadow-lg truncate">{title}</h2>
                <p className="text-muted-foreground text-xs md:text-sm hidden md:block">Welcome back, {user?.email?.split('@')[0]}</p>
            </div>

            <div className="flex items-center gap-4 ml-auto">
                {/* Search Bar - Glass Effect */}
                <div className="relative hidden md:block w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search projects..."
                        className="pl-10 h-10 rounded-full bg-white/5 border-white/10 text-sm focus:bg-white/10 transition-colors focus-visible:ring-purple-500/50"
                    />
                </div>

                {/* Notifications */}
                <Button variant="ghost" size="icon" className="rounded-full h-10 w-10 bg-white/5 hover:bg-white/10 border border-white/5">
                    <Bell className="h-5 w-5 text-muted-foreground" />
                </Button>

                {/* User Profile */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="relative h-10 w-10 rounded-full overflow-hidden border-2 border-purple-500/30 p-0 hover:scale-105 transition-transform">
                            <Avatar className="h-full w-full">
                                <AvatarImage src={`https://avatar.vercel.sh/${user?.email}`} alt={user?.email || ''} />
                                <AvatarFallback>
                                    <User className="h-4 w-4" />
                                </AvatarFallback>
                            </Avatar>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                        <DropdownMenuLabel className="font-normal">
                            <div className="flex flex-col space-y-1">
                                <p className="text-sm font-medium leading-none">{user?.email?.split('@')[0]}</p>
                                <p className="text-xs leading-none text-muted-foreground">
                                    {user?.email}
                                </p>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => window.location.href = '/dashboard/settings'}>
                            Settings
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => window.location.href = '/dashboard/billing'}>
                            <CreditCard className="mr-2 h-4 w-4" />
                            <span>Billing</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-400 focus:text-red-400" onClick={logout}>
                            Log out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}
