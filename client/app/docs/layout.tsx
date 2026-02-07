'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Menu, BarChart3, ChevronRight } from 'lucide-react';
import { ModeToggle } from '@/components/mode-toggle';
import { useState } from 'react';

const docsConfig = {
    sidebarNav: [
        {
            title: "Getting Started",
            items: [
                { title: "Introduction", href: "#introduction" },
                { title: "Quick Start", href: "#quick-start" },
                { title: "Installation", href: "#installation" },
            ],
        },
        {
            title: "API Reference",
            items: [
                { title: "Authentication", href: "#authentication" },
                { title: "Endpoints", href: "#endpoints" },
                { title: "Errors", href: "#errors" },
            ],
        },
        {
            title: "Guides",
            items: [
                { title: "Dashboard Overview", href: "#dashboard-overview" },
                { title: "Security & Privacy", href: "#security" },
                { title: "FAQ", href: "#faq" },
            ],
        },
    ],
};

interface DocsSidebarProps extends React.HTMLAttributes<HTMLDivElement> {
    items: typeof docsConfig.sidebarNav;
}

function DocsSidebar({ items, className, ...props }: DocsSidebarProps) {
    const pathname = usePathname();

    return (
        <div className={cn("w-full", className)} {...props}>
            {items.map((group, index) => (
                <div key={index} className="pb-4">
                    <h4 className="mb-1 rounded-md px-2 py-1 text-sm font-semibold">{group.title}</h4>
                    {group.items?.length && (
                        <div className="grid grid-flow-row auto-rows-max text-sm">
                            {group.items.map((item, i) => (
                                <Link
                                    key={i}
                                    href={item.href}
                                    className={cn(
                                        "group flex w-full items-center rounded-md border border-transparent px-2 py-1.5 hover:underline",
                                        pathname === item.href
                                            ? "font-medium text-foreground"
                                            : "text-muted-foreground"
                                    )}
                                >
                                    {item.title}
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}

export default function DocsLayout({ children }: { children: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="flex min-h-screen flex-col">
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container flex h-14 items-center">
                    <div className="mr-4 hidden md:flex">
                        <Link href="/" className="mr-6 flex items-center space-x-2">
                            <div className="h-6 w-6 rounded-md bg-primary flex items-center justify-center text-primary-foreground">
                                <BarChart3 className="h-4 w-4" />
                            </div>
                            <span className="hidden font-bold sm:inline-block">DataPulse</span>
                        </Link>
                        <nav className="flex items-center space-x-6 text-sm font-medium">
                            <Link href="/docs" className="transition-colors hover:text-foreground/80 text-foreground">Documentation</Link>
                            <Link href="/dashboard" className="transition-colors hover:text-foreground/80 text-foreground/60">Dashboard</Link>
                        </nav>
                    </div>
                    <Sheet open={isOpen} onOpenChange={setIsOpen}>
                        <SheetTrigger asChild>
                            <Button variant="ghost" className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden">
                                <Menu className="h-5 w-5" />
                                <span className="sr-only">Toggle Menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="pr-0">
                            <SheetHeader className="px-1 text-left">
                                <SheetTitle asChild>
                                    <Link href="/" className="flex items-center gap-2" onClick={() => setIsOpen(false)}>
                                        <div className="h-6 w-6 rounded-md bg-primary flex items-center justify-center text-primary-foreground">
                                            <BarChart3 className="h-4 w-4" />
                                        </div>
                                        <span className="font-bold">DataPulse</span>
                                    </Link>
                                </SheetTitle>
                            </SheetHeader>
                            <ScrollArea className="my-4 h-[calc(100vh-8rem)] pb-10 pl-6">
                                <DocsSidebar items={docsConfig.sidebarNav} />
                            </ScrollArea>
                        </SheetContent>
                    </Sheet>
                    <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
                        <div className="w-full flex-1 md:w-auto md:flex-none">
                            {/* Search could go here */}
                        </div>
                        <nav className="flex items-center">
                            <ModeToggle />
                        </nav>
                    </div>
                </div>
            </header>
            <div className="container flex-1 items-start md:grid md:grid-cols-[220px_1fr] md:gap-6 lg:grid-cols-[240px_1fr] lg:gap-10">
                <aside className="fixed top-14 z-30 -ml-2 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 md:sticky md:block">
                    <ScrollArea className="h-full py-6 pr-6 lg:py-8">
                        <DocsSidebar items={docsConfig.sidebarNav} />
                    </ScrollArea>
                </aside>
                <main className="relative py-6 lg:gap-10 lg:py-8 xl:grid xl:grid-cols-[1fr_300px]">
                    <div className="mx-auto w-full min-w-0">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
