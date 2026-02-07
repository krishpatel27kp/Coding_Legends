'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '@/context/auth-context';
import { useParams, useRouter } from 'next/navigation';
import { SubmissionsTable } from '@/components/submissions-table';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Loader2, ArrowLeft, RefreshCw, Copy, Check } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function ProjectDetailsPage() {
    const { token } = useAuth();
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    const [project, setProject] = useState<any>(null);
    const [submissions, setSubmissions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [keysCopied, setKeysCopied] = useState(false);

    const fetchProjectData = async () => {
        if (!token || !id) return;
        setLoading(true);
        try {
            // Fetch projects to find the specific one (or create specific endpoint)
            // Ideally we should have GET /api/projects/:id
            // For now, filtering from list or expecting the API to support it would be better 
            // BUT, our current getProjects returns ALL. Let's make a quick fix or just filter client side for MVP speed

            // Let's implement client side filtering from the list for now to save backend bandwidth if the list is small
            // ACTUALLY: getSubmissions endpoint checks project access, so we can use that for validation

            // Parallel fetch
            const [projRes, subRes] = await Promise.all([
                axios.get('http://localhost:4000/api/projects', { headers: { Authorization: `Bearer ${token}` } }),
                axios.get(`http://localhost:4000/api/v1/${id}`, { headers: { Authorization: `Bearer ${token}` } })
            ]);

            const foundProject = projRes.data.find((p: any) => p.id === id);
            if (!foundProject) {
                router.push('/dashboard/projects');
                return;
            }

            setProject(foundProject);
            setSubmissions(subRes.data.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProjectData();
    }, [token, id]);

    const copyApiKey = () => {
        if (project?.apiKey) {
            navigator.clipboard.writeText(project.apiKey);
            setKeysCopied(true);
            setTimeout(() => setKeysCopied(false), 2000);
        }
    };

    if (loading) {
        return <div className="flex justify-center p-12"><Loader2 className="h-8 w-8 animate-spin" /></div>;
    }

    if (!project) return null;

    return (
        <div className="space-y-8 p-8">
            <Button variant="ghost" onClick={() => router.back()} className="gap-2 pl-0">
                <ArrowLeft className="h-4 w-4" /> Back to Projects
            </Button>

            <div className="flex flex-col md:flex-row gap-8">
                <div className="flex-1 space-y-6">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">{project.name}</h1>
                        <p className="text-muted-foreground mt-1">Project ID: {project.id}</p>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Integration Details</CardTitle>
                            <CardDescription>Use these details to connect your form.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>API Endpoint</Label>
                                <div className="flex gap-2">
                                    <Input readOnly value={`http://localhost:4000/api/v1/submit/${project.apiKey}`} className="font-mono bg-muted" />
                                    <Button variant="outline" size="icon" onClick={() => {
                                        navigator.clipboard.writeText(`http://localhost:4000/api/v1/submit/${project.apiKey}`);
                                    }}>
                                        <Copy className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>API Key</Label>
                                <div className="flex gap-2">
                                    <Input readOnly value={project.apiKey} className="font-mono bg-muted" />
                                    <Button variant="outline" size="icon" onClick={copyApiKey}>
                                        {keysCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <div>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold">Submissions</h2>
                    <Button variant="outline" size="sm" onClick={fetchProjectData}>
                        <RefreshCw className="h-4 w-4 mr-2" /> Refresh
                    </Button>
                </div>
                <SubmissionsTable submissions={submissions} />
            </div>
        </div>
    );
}
