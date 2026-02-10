'use client';

import { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { useAuth } from '@/context/auth-context';
import { SubmissionsTable } from '@/components/submissions-table';
import { Loader2, Search, Filter, X, ArrowRight, Copy, Check, Info } from 'lucide-react';
import { API_ENDPOINTS } from '@/lib/config';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { motion, AnimatePresence } from 'framer-motion';
import InsightBadge from '@/components/insight-badge';
import SmartFilters from '@/components/smart-filters';

export default function SubmissionsPage() {
    const { token } = useAuth();
    const [submissions, setSubmissions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedProject, setSelectedProject] = useState('all');
    const [selectedSubmission, setSelectedSubmission] = useState<any>(null);
    const [copiedField, setCopiedField] = useState<string | null>(null);

    // Filter projects for the dropdown - Deduplicate by ID
    const projects = useMemo(() => {
        const projectMap = new Map();
        submissions.forEach(sub => {
            if (sub.project && sub.project.id) {
                projectMap.set(sub.project.id, sub.project);
            }
        });
        return Array.from(projectMap.values());
    }, [submissions]);

    // Filtering logic
    const filteredSubmissions = useMemo(() => {
        return submissions.filter(sub => {
            const matchesSearch = searchTerm === '' ||
                JSON.stringify(sub.data).toLowerCase().includes(searchTerm.toLowerCase()) ||
                (sub.project?.name || '').toLowerCase().includes(searchTerm.toLowerCase());

            const matchesProject = selectedProject === 'all' || sub.projectId === selectedProject;

            return matchesSearch && matchesProject;
        });
    }, [submissions, searchTerm, selectedProject]);

    useEffect(() => {
        if (token) {
            axios.get(API_ENDPOINTS.submissions, {
                headers: { Authorization: `Bearer ${token}` }
            }).then(res => {
                // Mocking some "new" status for demo purposes
                const data = (res.data.data || []).map((s: any, i: number) => ({
                    ...s,
                    status: i < 3 ? 'new' : 'read'
                }));
                setSubmissions(data);
                setLoading(false);
            }).catch(err => {
                console.error(err);
                setLoading(false);
            });
        }
    }, [token]);

    const copyToClipboard = (text: string, fieldName: string) => {
        navigator.clipboard.writeText(text);
        setCopiedField(fieldName);
        setTimeout(() => setCopiedField(null), 2000);
    };

    return (
        <div className="space-y-8 p-8 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Submissions</h1>
                    <p className="text-muted-foreground mt-1">Review and manage data collected from all your endpoints.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Badge variant="outline" className="px-3 py-1 bg-muted/30">
                        {filteredSubmissions.length} Total Records
                    </Badge>
                </div>
            </div>

            {/* Filters Bar */}
            <div className="flex flex-col md:flex-row gap-4 bg-card/50 p-4 rounded-2xl border backdrop-blur-sm">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by any field or project..."
                        className="pl-9 bg-background/50 border-muted"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {searchTerm && (
                        <button
                            onClick={() => setSearchTerm('')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                            <X className="h-3 w-3" />
                        </button>
                    )}
                </div>
                <div className="w-full md:w-[240px]">
                    <Select value={selectedProject} onValueChange={setSelectedProject}>
                        <SelectTrigger className="bg-background/50 border-muted">
                            <div className="flex items-center gap-2">
                                <Filter className="h-3.5 w-3.5 text-muted-foreground" />
                                <SelectValue placeholder="All Projects" />
                            </div>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Projects</SelectItem>
                            {projects.map(p => (
                                <SelectItem key={`proj-${p.id}`} value={p.id}>{p.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <Button variant="outline" size="icon" className="hidden md:flex">
                    <ArrowRight className="h-4 w-4" />
                </Button>
            </div>

            {/* Smart Filters */}
            {projects.length > 0 && (
                <SmartFilters
                    projectId={selectedProject === 'all' ? projects[0]?.id : selectedProject}
                    onFilterApply={(filter) => {
                        // Handle filter application
                        console.log('Filter applied:', filter);
                    }}
                />
            )}

            {/* Filter Chips - Mock Date Range for UI */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                <span className="text-xs text-muted-foreground font-medium mr-2">Quick Filters:</span>
                {['Today', 'Last 7 days', 'Last 30 days'].map((chip, idx) => (
                    <button
                        key={`chip-${idx}`}
                        className="whitespace-nowrap rounded-full border px-3 py-1 text-[11px] font-medium transition-colors hover:bg-muted bg-background/40"
                    >
                        {chip}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center p-24 bg-card/30 rounded-3xl border border-dashed">
                    <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
                    <p className="text-muted-foreground font-medium">Crunching your data...</p>
                </div>
            ) : (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                >
                    <SubmissionsTable
                        submissions={filteredSubmissions}
                        showProjectName={true}
                        onRowClick={(sub) => setSelectedSubmission(sub)}
                    />
                </motion.div>
            )}

            {/* Submission Detail Sheet */}
            <Sheet open={!!selectedSubmission} onOpenChange={() => setSelectedSubmission(null)}>
                <SheetContent className="sm:max-w-xl w-full p-0 border-l bg-card/95 backdrop-blur-xl">
                    {selectedSubmission && (
                        <div className="flex flex-col h-full">
                            <SheetHeader className="p-6 border-b bg-muted/20">
                                <div className="flex items-center gap-2 mb-2">
                                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                                        {selectedSubmission.project?.name || 'Project'}
                                    </Badge>
                                    <span className="text-xs text-muted-foreground">
                                        {new Date(selectedSubmission.createdAt).toLocaleString()}
                                    </span>
                                </div>
                                <SheetTitle className="text-2xl font-bold flex items-center gap-2">
                                    Submission Details
                                </SheetTitle>
                                <SheetDescription>
                                    View raw payload and metadata for this record.
                                </SheetDescription>
                            </SheetHeader>

                            <ScrollArea className="flex-1 p-6">
                                <div className="space-y-8">
                                    {/* Data Section */}
                                    <section className="space-y-4">
                                        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                                            <Info className="h-3 w-3" /> Form Payload
                                        </h3>
                                        <div className="grid gap-3">
                                            {Object.entries(selectedSubmission.data).map(([key, value], idx) => (
                                                <div key={`${key}-${idx}`} className="group relative bg-muted/30 p-4 rounded-xl border border-transparent hover:border-border transition-all">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <span className="text-xs font-bold capitalize text-primary/80">{key}</span>
                                                        <button
                                                            onClick={() => copyToClipboard(String(value), key)}
                                                            className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-background rounded-md"
                                                        >
                                                            {copiedField === key ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3 text-muted-foreground" />}
                                                        </button>
                                                    </div>
                                                    <p className="text-sm font-medium break-words">
                                                        {typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value)}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </section>

                                    {/* Metadata Section */}
                                    <section className="space-y-4">
                                        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Metadata</h3>
                                        <div className="bg-background/50 rounded-xl border p-4 space-y-3 font-mono text-xs">
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">ID:</span>
                                                <span className="font-medium">{selectedSubmission.id}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">Internal IP:</span>
                                                <span className="font-medium">192.168.1.*** (Masked)</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">User Agent:</span>
                                                <span className="font-medium truncate max-w-[200px]">Mozilla/5.0...</span>
                                            </div>
                                        </div>
                                    </section>
                                </div>
                            </ScrollArea>

                            <div className="p-6 border-t bg-muted/10 flex gap-3">
                                <Button variant="outline" className="flex-1" onClick={() => setSelectedSubmission(null)}>
                                    Close Panel
                                </Button>
                                <Button className="flex-1" onClick={() => copyToClipboard(JSON.stringify(selectedSubmission.data), 'json')}>
                                    {copiedField === 'json' ? 'Copied JSON!' : 'Copy Full JSON'}
                                </Button>
                            </div>
                        </div>
                    )}
                </SheetContent>
            </Sheet>
        </div>
    );
}
