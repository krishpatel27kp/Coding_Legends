'use client';

import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '@/context/auth-context';
import { useParams, useRouter } from 'next/navigation';
import { SubmissionsTable } from '@/components/submissions-table';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Loader2, ArrowLeft, RefreshCw, Copy, Check, Globe, Plus, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { API_ENDPOINTS, API_URL } from '@/lib/config';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { WebhookSettings } from '@/components/webhook-settings';
import { FormBuilder } from '@/components/form-builder';

export default function ProjectDetailsPage() {
    const { token } = useAuth();
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    const [project, setProject] = useState<any>(null);
    const [submissions, setSubmissions] = useState<any[]>([]);
    const [totalSubmissions, setTotalSubmissions] = useState(0);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [keysCopied, setKeysCopied] = useState(false);
    const [newOrigin, setNewOrigin] = useState('');
    const [allowedOrigins, setAllowedOrigins] = useState<string[]>([]);

    const fetchProjectData = useCallback(async () => {
        if (!token || !id) return;
        setLoading(true);
        try {
            const [projRes, subRes] = await Promise.all([
                axios.get(API_ENDPOINTS.projects, { headers: { Authorization: `Bearer ${token}` } }),
                axios.get(`${API_ENDPOINTS.submissions}/${id}`, { headers: { Authorization: `Bearer ${token}` } })
            ]);

            const foundProject = projRes.data.find((p: any) => p.id == id);
            if (!foundProject) {
                router.push('/dashboard/projects');
                return;
            }

            // Ensure JSON fields are parsed if they come as strings
            const parsedOrigins = typeof foundProject.allowedOrigins === 'string'
                ? JSON.parse(foundProject.allowedOrigins)
                : (foundProject.allowedOrigins || []);

            setProject(foundProject);
            setSubmissions(subRes.data.data);
            setTotalSubmissions(subRes.data.total || 0);
            setAllowedOrigins(Array.isArray(parsedOrigins) ? parsedOrigins : []);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, [token, id, router]);

    const handleAddOrigin = () => {
        if (!newOrigin) return;
        let originToAdd = newOrigin.trim();
        if (!originToAdd.startsWith('http')) {
            originToAdd = `https://${originToAdd}`;
        }

        if (!allowedOrigins.includes(originToAdd)) {
            setAllowedOrigins([...allowedOrigins, originToAdd]);
        }
        setNewOrigin('');
    };

    const handleRemoveOrigin = (origin: string) => {
        setAllowedOrigins(allowedOrigins.filter(o => o !== origin));
    };

    const saveProjectSettings = async () => {
        if (!token || !id) return;
        setSaving(true);
        try {
            await axios.put(`${API_ENDPOINTS.projects}/${id}`, {
                allowedOrigins
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchProjectData();
        } catch (error) {
            console.error('Failed to save settings:', error);
        } finally {
            setSaving(false);
        }
    };

    useEffect(() => {
        fetchProjectData();
    }, [fetchProjectData]);

    const copyApiKey = () => {
        if (project?.apiKey) {
            navigator.clipboard.writeText(project.apiKey);
            setKeysCopied(true);
            setTimeout(() => setKeysCopied(false), 2000);
        }
    };

    if (loading) {
        return <div className="flex justify-center p-12"><Loader2 className="h-8 w-8 animate-spin text-purple-500" /></div>;
    }

    if (!project) return null;

    return (
        <div className="space-y-8 p-8 max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <Button variant="ghost" onClick={() => router.back()} className="gap-2 pl-0 text-muted-foreground hover:text-white">
                        <ArrowLeft className="h-4 w-4" /> Back to Projects
                    </Button>
                    <h1 className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
                        {project.name}
                    </h1>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={fetchProjectData} className="border-white/10">
                        <RefreshCw className="h-4 w-4 mr-2" /> Refresh Data
                    </Button>
                </div>
            </div>

            <Tabs defaultValue="overview" className="space-y-8">
                <TabsList className="bg-white/5 border border-white/10 p-1">
                    <TabsTrigger value="overview" className="data-[state=active]:bg-purple-600">Overview</TabsTrigger>
                    <TabsTrigger value="builder" className="data-[state=active]:bg-indigo-600">Form Builder</TabsTrigger>
                    <TabsTrigger value="webhooks" className="data-[state=active]:bg-blue-600">Webhooks</TabsTrigger>
                    <TabsTrigger value="settings" className="data-[state=active]:bg-zinc-700">Settings</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-8 focus-visible:outline-none">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <Card className="border-white/10 bg-card/30 backdrop-blur-xl">
                            <CardHeader>
                                <CardTitle>Integration Details</CardTitle>
                                <CardDescription>Use these details to connect your form.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label>API Endpoint</Label>
                                    <div className="flex gap-2">
                                        <Input readOnly value={`${API_URL}/api/v1/submit/${project.apiKey}`} className="font-mono bg-white/5 border-white/10" />
                                        <Button variant="outline" size="icon" className="border-white/10" onClick={() => {
                                            navigator.clipboard.writeText(`${API_URL}/api/v1/submit/${project.apiKey}`);
                                        }}>
                                            <Copy className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>API Key</Label>
                                    <div className="flex gap-2">
                                        <Input readOnly value={project.apiKey} className="font-mono bg-white/5 border-white/10" />
                                        <Button variant="outline" size="icon" className="border-white/10" onClick={copyApiKey}>
                                            {keysCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-white/10 bg-card/30 backdrop-blur-xl">
                            <CardHeader>
                                <CardTitle>Project Status</CardTitle>
                                <CardDescription>Brief overview of your project activity.</CardDescription>
                            </CardHeader>
                            <CardContent className="flex flex-col items-center justify-center py-6 space-y-4">
                                <div className="text-5xl font-bold text-purple-400">{totalSubmissions}</div>
                                <div className="text-sm text-muted-foreground uppercase tracking-wider">Total Submissions</div>
                                <Badge variant="secondary" className="bg-green-500/10 text-green-400 border-green-500/20">Active</Badge>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold tracking-tight">Recent Submissions</h2>
                        <SubmissionsTable submissions={submissions} />
                    </div>
                </TabsContent>

                <TabsContent value="builder" className="focus-visible:outline-none">
                    <FormBuilder
                        projectId={id}
                        initialSchema={project.formSchema}
                        projectApiKey={project.apiKey}
                        token={token!}
                        onSaveSuccess={fetchProjectData}
                    />
                </TabsContent>

                <TabsContent value="webhooks" className="focus-visible:outline-none">
                    <div className="max-w-2xl">
                        <WebhookSettings
                            projectId={id}
                            initialUrl={project.webhookUrl}
                            token={token!}
                            onSaveSuccess={fetchProjectData}
                        />
                    </div>
                </TabsContent>

                <TabsContent value="settings" className="space-y-8 focus-visible:outline-none">
                    <Card className="border-white/10 bg-card/30 backdrop-blur-xl max-w-2xl">
                        <CardHeader>
                            <CardTitle className="text-xl flex items-center gap-2">
                                <Globe className="h-5 w-5 text-purple-400" /> Allowed Origins
                            </CardTitle>
                            <CardDescription>
                                Restrict submissions to these domains. Leave empty to allow all.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex gap-2">
                                <div className="flex-1">
                                    <Input
                                        placeholder="https://example.com"
                                        value={newOrigin}
                                        onChange={(e) => setNewOrigin(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleAddOrigin()}
                                        className="bg-white/5 border-white/10"
                                    />
                                </div>
                                <Button onClick={handleAddOrigin} variant="secondary">
                                    <Plus className="h-4 w-4 mr-2" /> Add
                                </Button>
                            </div>

                            <div className="space-y-3">
                                {allowedOrigins.length === 0 ? (
                                    <p className="text-sm text-muted-foreground italic">No restrictions set. All origins allowed.</p>
                                ) : (
                                    <div className="flex flex-wrap gap-2">
                                        {allowedOrigins.map((origin) => (
                                            <Badge
                                                key={origin}
                                                variant="secondary"
                                                className="px-3 py-1 bg-purple-500/10 text-purple-300 border-purple-500/20 group"
                                            >
                                                {origin}
                                                <button
                                                    onClick={() => handleRemoveOrigin(origin)}
                                                    className="ml-2 hover:text-red-400 transition-colors"
                                                >
                                                    <Trash2 className="h-3 w-3" />
                                                </button>
                                            </Badge>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </CardContent>
                        <CardFooter className="border-t border-white/5 pt-6">
                            <Button
                                onClick={saveProjectSettings}
                                disabled={saving}
                                className="ml-auto bg-purple-600 hover:bg-purple-500 text-white font-bold px-8"
                            >
                                {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                                Save Origins
                            </Button>
                        </CardFooter>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
