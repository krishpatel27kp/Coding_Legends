'use client';

import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/context/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Download, FileJson, FileSpreadsheet, FileText, Loader2, Calendar, History, Eye, Settings2, ShieldCheck, CheckCircle2 } from 'lucide-react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { API_ENDPOINTS, API_URL } from '@/lib/config';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import { CheckedState } from '@radix-ui/react-checkbox';

interface Project {
    id: string;
    name: string;
}

interface ExportTask {
    id: string;
    date: Date;
    format: string;
    projectName: string;
    count: number;
}

export default function ExportsPage() {
    const { token } = useAuth();
    const [projects, setProjects] = useState<Project[]>([]);
    const [selectedProject, setSelectedProject] = useState<string>('');
    const [format, setFormat] = useState<'csv' | 'json' | 'xlsx'>('csv');
    const [loading, setLoading] = useState(false);
    const [exporting, setExporting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Advanced options
    const [selectedFields, setSelectedFields] = useState<string[]>([]);
    const [includeMetadata, setIncludeMetadata] = useState(true);
    const [maskSensitive, setMaskSensitive] = useState(false);
    const [previewData, setPreviewData] = useState<any[]>([]);
    const [history, setHistory] = useState<ExportTask[]>([]);

    useEffect(() => {
        if (token) {
            fetchProjects();
            // Load mock history
            setHistory([
                { id: '1', date: new Date(Date.now() - 86400000), format: 'CSV', projectName: 'Customer Feedback', count: 124 },
                { id: '2', date: new Date(Date.now() - 172800000), format: 'JSON', projectName: 'Waitlist Signups', count: 56 }
            ]);
        }
    }, [token]);

    const fetchProjects = async () => {
        setLoading(true);
        try {
            const res = await axios.get(API_ENDPOINTS.projects, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProjects(res.data);
            if (res.data.length > 0) {
                setSelectedProject(res.data[0].id);
            }
        } catch (err) {
            console.error('Failed to fetch projects', err);
            setError('Failed to load projects.');
        } finally {
            setLoading(false);
        }
    };

    // Load preview when project changes
    useEffect(() => {
        if (selectedProject && token) {
            fetchPreview();
        }
    }, [selectedProject, token]);

    const fetchPreview = async () => {
        try {
            const res = await axios.get(`${API_URL}/api/projects/${selectedProject}/submissions?limit=5`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = res.data.data || [];
            if (data.length > 0) {
                setPreviewData(data);
                // Default select all fields if none selected
                const keys = Array.from(new Set(data.flatMap((s: any) => Object.keys(s.data))));
                setSelectedFields(keys as string[]);
            } else {
                setPreviewData([]);
                setSelectedFields([]);
            }
        } catch (err) {
            console.error('Preview failed', err);
        }
    };

    const handleExport = async () => {
        if (!selectedProject) return;
        setExporting(true);
        setError('');
        setSuccess('');

        try {
            const res = await axios.get(`${API_URL}/api/projects/${selectedProject}/submissions?limit=1000`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const submissions = res.data.data;
            const project = projects.find(p => p.id === selectedProject);
            const filename = `${project?.name || 'export'}_${new Date().toISOString().split('T')[0]}`;

            if (submissions.length === 0) {
                setError('No data to export for this project.');
                setExporting(false);
                return;
            }

            // Transform data based on selection
            const flatData = submissions.map((sub: any) => {
                const row: any = {};

                if (includeMetadata) {
                    row.id = sub.id;
                    row.submittedAt = new Date(sub.createdAt).toLocaleString();
                }

                selectedFields.forEach(field => {
                    let val = sub.data[field];
                    if (maskSensitive && (field.toLowerCase().includes('email') || field.toLowerCase().includes('phone'))) {
                        val = '*** masked ***';
                    }
                    row[field] = val;
                });

                return row;
            });

            if (format === 'json') {
                const blob = new Blob([JSON.stringify(flatData, null, 2)], { type: 'application/json' });
                downloadBlob(blob, `${filename}.json`);
            } else if (format === 'csv') {
                const worksheet = XLSX.utils.json_to_sheet(flatData);
                const csvOutput = XLSX.utils.sheet_to_csv(worksheet);
                const blob = new Blob([csvOutput], { type: 'text/csv' });
                downloadBlob(blob, `${filename}.csv`);
            } else if (format === 'xlsx') {
                const worksheet = XLSX.utils.json_to_sheet(flatData);
                const workbook = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(workbook, worksheet, "Submissions");
                XLSX.writeFile(workbook, `${filename}.xlsx`);
            }

            // Sync with history
            const newTask = {
                id: Math.random().toString(36).substring(7),
                date: new Date(),
                format: format.toUpperCase(),
                projectName: project?.name || 'Unknown',
                count: submissions.length
            };
            setHistory(prev => [newTask, ...prev]);
            setSuccess(`Successfully exported ${submissions.length} records.`);

        } catch (err) {
            console.error('Export failed', err);
            setError('Failed to export data. Please try again.');
        } finally {
            setExporting(false);
        }
    };

    const downloadBlob = (blob: Blob, filename: string) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    };

    const allAvailableFields = useMemo(() => {
        return Array.from(new Set(previewData.flatMap(s => Object.keys(s.data)))).sort();
    }, [previewData]);

    return (
        <div className="space-y-8 p-8 max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Export Data</h2>
                    <p className="text-muted-foreground mt-1">Generate high-fidelity reports from your data endpoints.</p>
                </div>
                <div className="flex items-center gap-4">
                    <Badge variant="secondary" className="px-3 py-1 gap-1">
                        <History className="h-3 w-3" /> {history.length} Previous Exports
                    </Badge>
                </div>
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
                {/* Left Column: Configuration */}
                <div className="lg:col-span-1 space-y-6">
                    <Card className="border-none bg-card/50 shadow-sm overflow-hidden">
                        <CardHeader className="bg-muted/30">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Settings2 className="h-4 w-4 text-primary" /> Configuration
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6 pt-6">
                            <div className="space-y-2">
                                <Label>Project Source</Label>
                                <Select value={selectedProject} onValueChange={setSelectedProject} disabled={loading}>
                                    <SelectTrigger className="bg-background/50">
                                        <SelectValue placeholder="Select a project" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {projects.map(p => (
                                            <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label>Select Fields</Label>
                                <div className="grid gap-2 bg-muted/20 p-3 rounded-xl border border-dashed text-xs">
                                    {allAvailableFields.length === 0 && (
                                        <span className="text-muted-foreground italic">No fields detected</span>
                                    )}
                                    {allAvailableFields.map(field => (
                                        <div key={field} className="flex items-center gap-2 hover:bg-background/50 p-1 rounded transition-colors group">
                                            <Checkbox
                                                id={`field-${field}`}
                                                checked={selectedFields.includes(field)}
                                                onCheckedChange={(checked: CheckedState) => {
                                                    if (checked) setSelectedFields([...selectedFields, field]);
                                                    else setSelectedFields(selectedFields.filter(f => f !== field));
                                                }}
                                            />
                                            <label htmlFor={`field-${field}`} className="cursor-pointer font-medium group-hover:text-primary transition-colors capitalize">
                                                {field}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-4 pt-2">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label className="text-sm font-semibold">Include Metadata</Label>
                                        <p className="text-[10px] text-muted-foreground">ID, Timestamp, Source</p>
                                    </div>
                                    <Checkbox checked={includeMetadata} onCheckedChange={(v: CheckedState) => setIncludeMetadata(!!v)} />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label className="text-sm font-semibold flex items-center gap-1.5">
                                            <ShieldCheck className="h-3 w-3 text-green-500" /> Mask PII
                                        </Label>
                                        <p className="text-[10px] text-muted-foreground">Auto-hide email & phone</p>
                                    </div>
                                    <Checkbox checked={maskSensitive} onCheckedChange={(v: CheckedState) => setMaskSensitive(!!v)} />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Output Format</Label>
                                <div className="grid grid-cols-3 gap-2">
                                    {(['csv', 'xlsx', 'json'] as const).map((fmt) => (
                                        <button
                                            key={fmt}
                                            onClick={() => setFormat(fmt)}
                                            className={cn(
                                                "flex flex-col items-center justify-center p-3 rounded-xl border text-[10px] font-bold uppercase transition-all",
                                                format === fmt ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20" : "bg-background/50 hover:bg-muted"
                                            )}
                                        >
                                            <span className="mb-1">
                                                {fmt === 'csv' && <FileText className="h-4 w-4" />}
                                                {fmt === 'xlsx' && <FileSpreadsheet className="h-4 w-4" />}
                                                {fmt === 'json' && <FileJson className="h-4 w-4" />}
                                            </span>
                                            {fmt}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="flex flex-col border-t bg-muted/10 p-6 pt-6">
                            <AnimatePresence mode="wait">
                                {error && (
                                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="w-full mb-4">
                                        <Alert variant="destructive" className="bg-destructive/10 border-none text-destructive">
                                            <AlertDescription className="text-xs font-medium">{error}</AlertDescription>
                                        </Alert>
                                    </motion.div>
                                )}
                                {success && (
                                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="w-full mb-4">
                                        <Alert className="bg-green-500/10 border-none text-green-500">
                                            <AlertDescription className="text-xs font-medium flex items-center gap-2">
                                                <CheckCircle2 className="h-3 w-3" /> {success}
                                            </AlertDescription>
                                        </Alert>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                            <Button className="w-full h-11 font-bold shadow-lg shadow-primary/20" onClick={handleExport} disabled={exporting || !selectedProject || selectedFields.length === 0}>
                                {exporting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Batch Processing...
                                    </>
                                ) : (
                                    <>
                                        <Download className="mr-2 h-4 w-4" /> Download Dataset
                                    </>
                                )}
                            </Button>
                        </CardFooter>
                    </Card>
                </div>

                {/* Right Column: Preview & History */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Preview Table */}
                    <Card className="border-none shadow-sm overflow-hidden bg-card/30">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <div>
                                <CardTitle className="text-lg">Data Preview</CardTitle>
                                <CardDescription className="text-xs">Live sample of current selection (5 rows)</CardDescription>
                            </div>
                            <Eye className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent className="overflow-x-auto">
                            <div className="min-w-full inline-block align-middle">
                                <table className="min-w-full cursor-default">
                                    <thead>
                                        <tr className="border-b border-muted/50">
                                            {includeMetadata && <th className="px-4 py-3 text-left text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Metadata</th>}
                                            {selectedFields.map(f => (
                                                <th key={f} className="px-4 py-3 text-left text-[10px] font-bold text-muted-foreground uppercase tracking-widest capitalize">{f}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-muted/30">
                                        {previewData.length === 0 && (
                                            <tr>
                                                <td colSpan={selectedFields.length + (includeMetadata ? 1 : 0)} className="py-12 text-center text-sm text-muted-foreground italic">
                                                    No preview data available for this project.
                                                </td>
                                            </tr>
                                        )}
                                        {previewData.map((row, i) => (
                                            <tr key={i} className="hover:bg-muted/20 transition-colors">
                                                {includeMetadata && (
                                                    <td className="px-4 py-3 whitespace-nowrap">
                                                        <div className="flex flex-col">
                                                            <span className="font-mono text-[9px] text-muted-foreground">ID: {row.id.substring(0, 6)}</span>
                                                            <span className="text-[9px] text-muted-foreground opacity-70">{formatDistanceToNow(new Date(row.createdAt), { addSuffix: true })}</span>
                                                        </div>
                                                    </td>
                                                )}
                                                {selectedFields.map(field => (
                                                    <td key={field} className="px-4 py-3 text-sm font-medium">
                                                        <span className="truncate max-w-[120px] inline-block">
                                                            {maskSensitive && (field.toLowerCase().includes('email') || field.toLowerCase().includes('phone'))
                                                                ? '••••••••'
                                                                : String(row.data[field] || '-')}
                                                        </span>
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>

                    {/* History Section */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <History className="h-4 w-4 text-primary" />
                            <h3 className="font-bold">Recent Export Logs</h3>
                        </div>
                        <div className="grid gap-3">
                            {history.map(task => (
                                <div key={task.id} className="flex items-center justify-between p-4 rounded-xl bg-muted/20 border transition-all hover:border-primary/30 group">
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-lg bg-background border flex items-center justify-center font-bold text-[10px] text-primary">
                                            {task.format}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-sm">{task.projectName}</p>
                                            <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                                                <span>{formatDistanceToNow(task.date, { addSuffix: true })}</span>
                                                <span className="h-1 w-1 rounded-full bg-muted-foreground" />
                                                <span>{task.count} records</span>
                                            </div>
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity gap-2 h-8 px-3">
                                        <Download className="h-3 w-3" /> Re-download
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
