'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import {
    Table,
    TableHeader,
    TableBody,
    TableHead,
    TableRow,
    TableCell,
} from '@/components/ui/table-primitives';
import { formatDistanceToNow } from 'date-fns';
import { Eye, Clock, Hash } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import InsightBadge from '@/components/insight-badge';

interface Submission {
    id: string;
    data: Record<string, any>;
    createdAt: string;
    project?: {
        name: string;
    };
    status?: 'new' | 'read';
    tags?: Array<{ id: string; tag: string; confidence: number }>;
    insights?: Array<{ id: string; type: string; message: string }>;
}

interface SubmissionsTableProps {
    submissions: Submission[];
    showProjectName?: boolean;
    onRowClick?: (submission: Submission) => void;
}

export function SubmissionsTable({
    submissions,
    showProjectName = false,
    onRowClick
}: SubmissionsTableProps) {
    if (submissions.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 border rounded-2xl bg-muted/20 border-dashed">
                <div className="p-3 bg-muted rounded-full mb-4">
                    <Clock className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold">No submissions found</h3>
                <p className="text-muted-foreground text-sm max-w-[250px] text-center mt-1">
                    Try adjusting your filters or search query to find what you're looking for.
                </p>
            </div>
        );
    }

    // Extract headers from the first few submissions
    const dataKeys = Array.from(
        new Set(submissions.slice(0, 10).flatMap(s => Object.keys(s.data)))
    ).slice(0, 4); // Show up to 4 data columns

    return (
        <div className="rounded-xl border bg-card/30 backdrop-blur-sm overflow-hidden">
            <Table>
                <TableHeader>
                    <TableRow className="hover:bg-transparent border-b bg-muted/30">
                        <TableHead className="w-[100px]">ID</TableHead>
                        <TableHead>Date</TableHead>
                        {showProjectName && <TableHead>Project</TableHead>}
                        {dataKeys.map((key, idx) => (
                            <TableHead key={`head-${key}-${idx}`} className="capitalize">
                                {key}
                            </TableHead>
                        ))}
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {submissions.map((submission, sIdx) => (
                        <TableRow
                            key={submission.id || `sub-${sIdx}`}
                            onClick={() => onRowClick?.(submission)}
                            className={cn(
                                "group transition-colors cursor-pointer hover:bg-muted/50",
                                submission.status === 'new' && "bg-primary/5 border-l-2 border-l-primary"
                            )}
                        >
                            <TableCell className="font-mono text-[10px] text-muted-foreground">
                                <span className="flex items-center gap-1">
                                    <Hash className="h-3 w-3" />
                                    {submission.id?.substring(0, 6) || '------'}
                                </span>
                            </TableCell>
                            <TableCell className="whitespace-nowrap">
                                <div className="flex flex-col">
                                    <span className="text-sm font-medium">
                                        {formatDistanceToNow(new Date(submission.createdAt), { addSuffix: true })}
                                    </span>
                                    <span className="text-[10px] text-muted-foreground">
                                        {new Date(submission.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                            </TableCell>
                            {showProjectName && (
                                <TableCell>
                                    <Badge variant="outline" className="font-medium bg-background/50">
                                        {submission.project?.name || 'Unknown'}
                                    </Badge>
                                </TableCell>
                            )}
                            {dataKeys.map((key, kIdx) => (
                                <TableCell key={`cell-${submission.id}-${key}-${kIdx}`} className="max-w-[150px] truncate text-sm">
                                    {typeof submission.data[key] === 'object'
                                        ? JSON.stringify(submission.data[key])
                                        : String(submission.data[key] || '-')}
                                </TableCell>
                            ))}
                            <TableCell className="text-right">
                                {/* Display Intelligence Badges */}
                                <div className="flex flex-wrap gap-1 justify-end mb-2">
                                    {submission.tags?.slice(0, 2).map((tag) => (
                                        <InsightBadge key={tag.id} tag={tag.tag} variant="tag" />
                                    ))}
                                    {submission.insights?.slice(0, 1).map((insight) => (
                                        <InsightBadge key={insight.id} insight={insight} variant="insight" />
                                    ))}
                                </div>
                                <div className="flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Badge variant="secondary" className="gap-1 px-2 py-1">
                                        <Eye className="h-3 w-3" /> View
                                    </Badge>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
