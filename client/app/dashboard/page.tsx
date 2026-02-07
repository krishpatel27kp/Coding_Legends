'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '@/context/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Plus, BarChart3, ListChecks, Activity, Copy, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function DashboardPage() {
    const { token } = useAuth();
    const [projects, setProjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (token) {
            axios.get('http://localhost:4000/api/projects', {
                headers: { Authorization: `Bearer ${token}` }
            }).then(res => {
                setProjects(res.data);
                setLoading(false);
            }).catch(err => {
                console.error(err);
                setLoading(false);
            });
        }
    }, [token]);

    const totalSubmissions = projects.reduce((acc, curr) => acc + (curr._count?.submissions || 0), 0);

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-8 p-8" // Added padding
        >
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Overview</h1>
                    <p className="text-muted-foreground mt-1">Welcome back! Here's what's happening today.</p>
                </div>
                <Link href="/dashboard/projects/new">
                    <Button className="gap-2"><Plus className="h-4 w-4" /> New Project</Button>
                </Link>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card className="border-l-4 border-l-blue-500 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
                        <ListChecks className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{projects.length}</div>
                        <p className="text-xs text-muted-foreground">Active endpoints</p>
                    </CardContent>
                </Card>
                <Card className="border-l-4 border-l-green-500 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Submissions</CardTitle>
                        <BarChart3 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalSubmissions}</div>
                        <p className="text-xs text-muted-foreground">Across all projects</p>
                    </CardContent>
                </Card>
                <Card className="border-l-4 border-l-purple-500 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">System Status</CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">Healthy</div>
                        <p className="text-xs text-muted-foreground">All systems operational</p>
                    </CardContent>
                </Card>
            </div>

            <div className="space-y-4">
                <h2 className="text-xl font-semibold tracking-tight">Recent Projects</h2>
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map(i => <div key={i} className="h-40 bg-muted/20 animate-pulse rounded-xl" />)}
                    </div>
                ) : projects.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 border-2 border-dashed rounded-xl bg-slate-50 dark:bg-slate-900/50">
                        <div className="bg-slate-100 p-4 rounded-full mb-4 dark:bg-slate-800">
                            <Plus className="h-8 w-8 text-slate-400" />
                        </div>
                        <h3 className="text-lg font-medium">No projects yet</h3>
                        <p className="text-muted-foreground mb-6">Create your first project to start tracking submissions.</p>
                        <Link href="/dashboard/projects/new">
                            <Button variant="outline">Create Project</Button>
                        </Link>
                    </div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {projects.map((project) => (
                            <Card key={project.id} className="hover:shadow-lg transition-all duration-200 group border-t-4 border-t-transparent hover:border-t-primary">
                                <CardHeader>
                                    <div className="flex justify-between items-start">
                                        <CardTitle className="text-lg">{project.name}</CardTitle>
                                        <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-500">
                                            <FileTextIcon className="h-4 w-4" />
                                        </div>
                                    </div>
                                    <CardDescription>Created {new Date(project.createdAt).toLocaleDateString()}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center text-sm p-2 bg-secondary/50 rounded-md">
                                            <span className="text-muted-foreground">Submissions</span>
                                            <span className="font-bold">{project._count?.submissions || 0}</span>
                                        </div>

                                        <div className="flex gap-2">
                                            <Link href={`/dashboard/projects/${project.id}`} className="w-full">
                                                <Button className="w-full" variant="secondary">
                                                    <Eye className="mr-2 h-3 w-3" /> View Data
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </motion.div>
    );
}

function FileTextIcon({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /><line x1="16" x2="8" y1="13" y2="13" /><line x1="16" x2="8" y1="17" y2="17" /><line x1="10" x2="8" y1="9" y2="9" /></svg>
    )
}
