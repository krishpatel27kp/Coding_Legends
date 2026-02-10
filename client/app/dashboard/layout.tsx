'use client';

import { DashboardSidebar } from '@/components/dashboard-sidebar';
import { DashboardHeader } from '@/components/dashboard-header';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen bg-transparent">
            {/* Sidebar */}
            <DashboardSidebar />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col md:pl-[90px] transition-[padding] duration-300">
                {/* Note: Padding Left handles the collapsed sidebar width (approx 80px + gap). 
                     The sidebar component handles its own width expansion. 
                     We might need a context to handle the dynamic padding if we want text-wrapping to be perfect, 
                     but for glass UI overlay feeling, a fixed margin is often cleaner. 
                     Let's start with a safe margin. */}

                <DashboardHeader />

                <main className="flex-1 px-4 md:px-10 pb-10 overflow-x-hidden">
                    <div className="max-w-7xl mx-auto w-full pt-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
