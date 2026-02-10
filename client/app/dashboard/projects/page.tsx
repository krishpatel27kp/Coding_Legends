'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '@/context/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { Plus, Search, MoreVertical, FileText, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import { API_ENDPOINTS } from '@/lib/config';

export default function ProjectsPage() {
    const { token } = useAuth();
    const [projects, setProjects] = useState<any[]>([]);
    const [filteredProjects, setFilteredProjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        if (token) {
            axios.get(API_ENDPOINTS.projects, {
                headers: { Authorization: `Bearer ${token}` }
            }).then(res => {
                setProjects(res.data);
                setFilteredProjects(res.data);
                setLoading(false);
            }).catch(err => {
                console.error(err);
                setLoading(false);
            });
        }
    }, [token]);

    useEffect(() => {
        const lowerQuery = searchQuery.toLowerCase();
        const filtered = projects.filter(p =>
            p.name.toLowerCase().includes(lowerQuery) ||
            p.apiKey.toLowerCase().includes(lowerQuery)
        );
        setFilteredProjects(filtered);
    }, [searchQuery, projects]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-8 p-8"
        >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
                    <p className="text-muted-foreground mt-1">Manage your form tracking projects.</p>
                </div>
                <Link href="/dashboard/projects/new">
                    <Button className="w-full md:w-auto gap-2">
                        <Plus className="h-4 w-4" /> Create Project
                    </Button>
                </Link>
            </div>

            <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search projects..."
                        className="pl-8"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {loading ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="h-48 rounded-xl bg-muted/20 animate-pulse" />
                    ))}
                </div>
            ) : filteredProjects.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 border-2 border-dashed rounded-xl bg-slate-50 dark:bg-slate-900/50">
                    <div className="bg-slate-100 p-4 rounded-full mb-4 dark:bg-slate-800">
                        <FileText className="h-8 w-8 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-medium">No projects found</h3>
                    <p className="text-muted-foreground mb-6 text-center max-w-sm">
                        {searchQuery ? "No projects match your search query." : "You haven't created any projects yet."}
                    </p>
                    {!searchQuery && (
                        <Link href="/dashboard/projects/new">
                            <Button>Create your first project</Button>
                        </Link>
                    )}
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {filteredProjects.map((project) => (
                        <Card key={project.id} className="group hover:border-primary/50 transition-colors">
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <div className="space-y-1">
                                        <CardTitle className="line-clamp-1">{project.name}</CardTitle>
                                        <CardDescription className="font-mono text-xs">
                                            {project.apiKey.substring(0, 8)}...
                                        </CardDescription>
                                    </div>
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                        <MoreVertical className="h-4 w-4" />
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-col gap-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="flex flex-col gap-1">
                                            <span className="text-xs text-muted-foreground">Submissions</span>
                                            <span className="font-bold text-lg">{project._count?.submissions || 0}</span>
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <span className="text-xs text-muted-foreground">Created</span>
                                            <span className="text-sm font-medium flex items-center gap-1">
                                                <Calendar className="h-3 w-3" />
                                                {new Date(project.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                    <Link href={`/dashboard/projects/${project.id}`}>
                                        <Button variant="secondary" className="w-full">
                                            Manage Project
                                        </Button>
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </motion.div>
    );
}
