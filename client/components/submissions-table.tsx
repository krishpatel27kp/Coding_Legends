'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import {
    Table as ShadcnTable,
    TableHeader,
    TableBody,
    TableFooter,
    TableHead,
    TableRow,
    TableCell,
    TableCaption,
} from '@/components/ui/table-primitives'; // We will create this next
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDistanceToNow } from 'date-fns';

interface Submission {
    id: string;
    data: Record<string, any>;
    createdAt: string;
    project?: {
        name: string;
    };
}

export function SubmissionsTable({ submissions, showProjectName = false }: { submissions: Submission[], showProjectName?: boolean }) {
    if (submissions.length === 0) {
        return (
            <div className="text-center py-12 border rounded-lg bg-slate-50 dark:bg-slate-900/50">
                <p className="text-muted-foreground">No submissions found.</p>
            </div>
        );
    }

    // Extract headers from the first submission's data keys
    // In a real app, we might want a more robust way to determine columns
    const dataKeys = Array.from(new Set(submissions.flatMap(s => Object.keys(s.data)))).slice(0, 5); // Limit to 5 columns

    return (
        <div className="rounded-md border">
            <div className="w-full overflow-auto">
                <table className="w-full caption-bottom text-sm text-left">
                    <thead className="[&_tr]:border-b">
                        <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                            <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Date</th>
                            {showProjectName && <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Project</th>}
                            {dataKeys.map(key => (
                                <th key={key} className="h-12 px-4 align-middle font-medium text-muted-foreground capitalize">
                                    {key}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="[&_tr:last-child]:border-0">
                        {submissions.map((submission) => (
                            <tr key={submission.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                <td className="p-4 align-middle font-medium">
                                    {formatDistanceToNow(new Date(submission.createdAt), { addSuffix: true })}
                                </td>
                                {showProjectName && (
                                    <td className="p-4 align-middle text-muted-foreground">
                                        {submission.project?.name || '-'}
                                    </td>
                                )}
                                {dataKeys.map(key => (
                                    <td key={key} className="p-4 align-middle">
                                        {typeof submission.data[key] === 'object'
                                            ? JSON.stringify(submission.data[key])
                                            : String(submission.data[key] || '-')}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
