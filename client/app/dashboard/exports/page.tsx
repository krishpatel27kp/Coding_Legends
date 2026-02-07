'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Download, FileJson, FileSpreadsheet, FileText, Loader2, Calendar } from 'lucide-react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface Project {
    id: string;
    name: string;
}

export default function ExportsPage() {
    const { user, token } = useAuth();
    const [projects, setProjects] = useState<Project[]>([]);
    const [selectedProject, setSelectedProject] = useState<string>('');
    const [format, setFormat] = useState<'csv' | 'json' | 'xlsx'>('csv');
    const [loading, setLoading] = useState(false);
    const [exporting, setExporting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const API_URL = 'http://localhost:4000/api';

    useEffect(() => {
        if (token) {
            fetchProjects();
        }
    }, [token]);

    const fetchProjects = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${API_URL}/projects`, {
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

    const handleExport = async () => {
        if (!selectedProject) return;
        setExporting(true);
        setError('');
        setSuccess('');

        try {
            // Fetch all submissions for the project
            // Note: In a real app with pagination, we'd need a specific endpoint to stream or fetch all.
            // For now, we'll request a large limit.
            const res = await axios.get(`${API_URL}/projects/${selectedProject}/submissions?limit=1000`, {
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

            // Flatten data for export
            const flatData = submissions.map((sub: any) => ({
                id: sub.id,
                submittedAt: new Date(sub.createdAt).toLocaleString(),
                ...sub.data, // Spread form fields
                ...sub.metadata // Spread metadata
            }));

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

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Export Data</h2>
                    <p className="text-muted-foreground">Download your form submissions in your preferred format.</p>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card className="md:col-span-1">
                    <CardHeader>
                        <CardTitle>Export Configuration</CardTitle>
                        <CardDescription>Select the data you want to export.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>Project</Label>
                            <Select value={selectedProject} onValueChange={setSelectedProject} disabled={loading}>
                                <SelectTrigger>
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
                            <Label>Format</Label>
                            <div className="grid grid-cols-3 gap-2">
                                <Button
                                    variant={format === 'csv' ? 'default' : 'outline'}
                                    className="flex flex-col h-20 gap-2"
                                    onClick={() => setFormat('csv')}
                                >
                                    <FileText className="h-6 w-6" />
                                    CSV
                                </Button>
                                <Button
                                    variant={format === 'xlsx' ? 'default' : 'outline'}
                                    className="flex flex-col h-20 gap-2"
                                    onClick={() => setFormat('xlsx')}
                                >
                                    <FileSpreadsheet className="h-6 w-6" />
                                    Excel
                                </Button>
                                <Button
                                    variant={format === 'json' ? 'default' : 'outline'}
                                    className="flex flex-col h-20 gap-2"
                                    onClick={() => setFormat('json')}
                                >
                                    <FileJson className="h-6 w-6" />
                                    JSON
                                </Button>
                            </div>
                        </div>

                        {/* Date Range Placeholder - Could implement real range picker later */}
                        <div className="space-y-2">
                            <Label>Date Range</Label>
                            <Select defaultValue="all">
                                <SelectTrigger>
                                    <SelectValue placeholder="Select range" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Time</SelectItem>
                                    <SelectItem value="7d">Last 7 Days</SelectItem>
                                    <SelectItem value="30d">Last 30 Days</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-4">
                        {error && (
                            <Alert variant="destructive">
                                <AlertTitle>Error</AlertTitle>
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}
                        {success && (
                            <Alert className="border-green-500 text-green-500">
                                <AlertTitle>Success</AlertTitle>
                                <AlertDescription>{success}</AlertDescription>
                            </Alert>
                        )}
                        <Button className="w-full" onClick={handleExport} disabled={exporting || !selectedProject}>
                            {exporting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Exporting...
                                </>
                            ) : (
                                <>
                                    <Download className="mr-2 h-4 w-4" />
                                    Download Data
                                </>
                            )}
                        </Button>
                    </CardFooter>
                </Card>

                <Card className="md:col-span-1 border-dashed shadow-none bg-muted/30">
                    <CardHeader>
                        <CardTitle className="text-base font-medium">Why Export?</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 text-sm text-muted-foreground">
                        <p>
                            <strong>Backup & Security:</strong> Keep a local copy of your data for compliance and safety.
                        </p>
                        <p>
                            <strong>Deep Analysis:</strong> Import your CSV or Excel files into tools like Tableau, PowerBI, or simple spreadsheets to uncover trends.
                        </p>
                        <p>
                            <strong>Migration:</strong> Moving to a new system? JSON export ensures you can take your raw data with you easily.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
