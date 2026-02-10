'use client';

import { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { useAuth } from '@/context/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
    Plus,
    BarChart3,
    Activity,
    ExternalLink,
    ChevronRight,
    Clock,
    TrendingUp,
    Users,
    Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { API_ENDPOINTS } from '@/lib/config';
import { ProjectAvatar } from '@/components/project-avatar';
import { EmptyState } from '@/components/empty-state';
import TodaysInsight from '@/components/todays-insight';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Mock Data for the chart - eventually integrate real analytics
const data = [
    { name: 'Mon', submissions: 40 },
    { name: 'Tue', submissions: 30 },
    { name: 'Wed', submissions: 20 },
    { name: 'Thu', submissions: 27 },
    { name: 'Fri', submissions: 18 },
    { name: 'Sat', submissions: 23 },
    { name: 'Sun', submissions: 34 },
];

export default function DashboardPage() {
    const { token } = useAuth();
    const [projects, setProjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [chartData, setChartData] = useState<any[]>([]);

    useEffect(() => {
        if (token) {
            setLoading(true);
            // Fetch Projects
            axios.get(API_ENDPOINTS.projects, {
                headers: { Authorization: `Bearer ${token}` }
            }).then(res => {
                setProjects(res.data);

                // Fetch Submissions for Chart (All projects)
                // Note: We need an endpoint for aggregate stats or we fetch for all projects.
                // For now, let's fetch for the first project if exists, or use a new endpoint for "all submissions"
                // Let's implement a simple fetch for "all submissions" in the backend or just loop here.
                // actually, let's use the new getAllSubmissions endpoint if we added it, or just use the first project for now as a demo.
                // Better: Fetch "all submissions" with a limit.

                return axios.get(`${API_ENDPOINTS.submissions}?limit=100`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }).then(res => {
                // Process submission data for chart (group by date)
                const submissions = res.data.data;
                const last7Days = [...Array(7)].map((_, i) => {
                    const d = new Date();
                    d.setDate(d.getDate() - i);
                    return d.toISOString().split('T')[0];
                }).reverse();

                const grouped = last7Days.map(date => {
                    const count = submissions.filter((s: any) => s.createdAt.startsWith(date)).length;
                    const dayName = new Date(date).toLocaleDateString('en-US', { weekday: 'short' });
                    return { name: dayName, submissions: count, date };
                });

                setChartData(grouped);
                setLoading(false);
            }).catch(err => {
                console.error("Failed to load dashboard data", err);
                setLoading(false);
            });
        }
    }, [token]);

    const totalSubmissions = useMemo(() =>
        projects.reduce((acc, curr) => acc + (curr._count?.submissions || 0), 0),
        [projects]);

    // Calculate trends (mock logic for now as we need historical data for real trends)
    const submissionTrend = chartData.length > 1 && chartData[6].submissions >= chartData[5].submissions ? 'up' : 'down';

    const stats = [
        {
            title: "Total Projects",
            value: projects.length,
            change: "Active",
            trend: "neutral",
            icon: Zap,
            color: "text-yellow-400",
            bg: "bg-yellow-500/10"
        },
        {
            title: "Total Submissions",
            value: totalSubmissions,
            change: submissionTrend === 'up' ? "Increasing" : "Decreasing",
            trend: submissionTrend,
            icon: BarChart3,
            color: "text-purple-400",
            bg: "bg-purple-500/10"
        },
        {
            title: "Active Users",
            value: "1", // Real user count is just the current user for this SaaS template usually
            change: "Stable",
            trend: "neutral",
            icon: Users,
            color: "text-blue-400",
            bg: "bg-blue-500/10"
        },
        {
            title: "System Health",
            value: "100%",
            change: "Optimal",
            trend: "neutral",
            icon: Activity,
            color: "text-green-400",
            bg: "bg-green-500/10"
        }
    ];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white drop-shadow-md">Overview</h1>
                    <p className="text-muted-foreground mt-1 text-lg">Your infrastructure health and performance metrics.</p>
                </div>
                <Link href="/dashboard/projects/new">
                    <Button size="lg" className="rounded-full bg-white text-black hover:bg-gray-100 shadow-[0_0_20px_-5px_rgba(255,255,255,0.4)] transition-all hover:scale-105 font-bold">
                        <Plus className="mr-2 h-5 w-5" /> New Project
                    </Button>
                </Link>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat, i) => (
                    <motion.div
                        key={stat.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                    >
                        <Card className="border-0 bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-colors duration-300">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    {stat.title}
                                </CardTitle>
                                <div className={cn("p-2 rounded-lg", stat.bg)}>
                                    <stat.icon className={cn("h-4 w-4", stat.color)} />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                                <div className="flex items-center text-xs text-muted-foreground">
                                    {stat.trend === 'up' ? <TrendingUp className="mr-1 h-3 w-3 text-green-400" /> : null}
                                    <span className={stat.trend === 'up' ? "text-green-400 font-medium" : ""}>
                                        {stat.change}
                                    </span>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* Content Grid */}
            <div className="grid gap-6 grid-cols-1 md:grid-cols-7">

                {/* Main Activity Chart */}
                <Card className="col-span-1 md:col-span-4 border-0 bg-white/5 backdrop-blur-md border border-white/10 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-transparent pointer-events-none" />
                    <CardHeader>
                        <CardTitle className="text-white">Submission Activity</CardTitle>
                        <CardDescription>Daily submission volume over the last 7 days.</CardDescription>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <div className="h-[300px] w-full min-h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData.length > 0 ? chartData : [{ name: 'No Data', submissions: 0 }]}>
                                    <defs>
                                        <linearGradient id="colorSubmissions" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <XAxis
                                        dataKey="name"
                                        stroke="#888888"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <YAxis
                                        stroke="#888888"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                        tickFormatter={(value) => `${value}`}
                                    />
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }}
                                        itemStyle={{ color: '#a78bfa' }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="submissions"
                                        stroke="#8b5cf6"
                                        fillOpacity={1}
                                        fill="url(#colorSubmissions)"
                                        strokeWidth={2}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Today's Insight / Recent Projects */}
                <div className="col-span-1 md:col-span-3 space-y-6">
                    {/* Insight */}
                    {projects.length > 0 && !loading && (
                        <div className="relative group">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-purple-600 rounded-2xl blur opacity-30 group-hover:opacity-70 transition duration-1000"></div>
                            <div className="relative">
                                {/* Ensure TodaysInsight handles number projectId or we cast/update it */}
                                <TodaysInsight projectId={projects[0]?.id as any} />
                            </div>
                        </div>
                    )}

                    {/* Quick Project List */}
                    <Card className="border-0 bg-white/5 backdrop-blur-md border border-white/10 h-full">
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between text-white">
                                <span>Recent Projects</span>
                                <Link href="/dashboard/projects" className="text-xs font-normal text-purple-400 hover:text-purple-300 transition-colors flex items-center">
                                    View All <ChevronRight className="h-3 w-3 ml-0.5" />
                                </Link>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {loading && projects.length === 0 ? (
                                    [1, 2, 3].map(i => (
                                        <div key={i} className="flex items-center gap-4">
                                            <div className="h-10 w-10 rounded-full bg-white/10 animate-pulse" />
                                            <div className="space-y-2 flex-1">
                                                <div className="h-4 w-24 bg-white/10 rounded animate-pulse" />
                                                <div className="h-3 w-16 bg-white/5 rounded animate-pulse" />
                                            </div>
                                        </div>
                                    ))
                                ) : projects.slice(0, 3).map((project) => (
                                    <Link href={`/dashboard/projects/${project.id}`} key={project.id} className="block group/item">
                                        <div className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/5">
                                            <div className="flex items-center gap-4">
                                                <ProjectAvatar name={project.name} className="h-10 w-10 text-sm" />
                                                <div>
                                                    <p className="font-medium text-sm text-white group-hover/item:text-purple-300 transition-colors">{project.name}</p>
                                                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                                                        <Clock className="h-3 w-3" />
                                                        {new Date(project.updatedAt || project.createdAt).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                            <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover/item:opacity-100 transition-all transform group-hover/item:translate-x-1" />
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Empty State Handling */}
            {!loading && projects.length === 0 && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mt-8"
                >
                    <EmptyState
                        icon={<Plus className="h-10 w-10 text-purple-400" />}
                        title="Start Your Journey"
                        description="Create your first project to unlock the power of DataPulse analytics."
                        action={{ label: "Create Project", href: "/dashboard/projects/new" }}
                    />
                </motion.div>
            )}
        </div>
    );
}
