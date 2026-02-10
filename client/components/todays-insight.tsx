'use client';

import { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';
import { API_URL } from '@/lib/config';
import axios from 'axios';

interface SummaryData {
    totalSubmissions: number;
    newSubmissions: number;
    topTags: Array<{ tag: string; count: number }>;
    trends: Array<{ type: string; message: string }>;
    insights: string[];
}

interface TodaysInsightProps {
    projectId?: string;
}

export default function TodaysInsight({ projectId }: TodaysInsightProps) {
    const [summary, setSummary] = useState<SummaryData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!projectId) return;

        let isMounted = true;
        const fetchSummary = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`${API_URL}/api/insights/summary/${projectId}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (isMounted) {
                    setSummary(response.data.summary);
                }
            } catch (error) {
                console.error('Failed to fetch summary:', error);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchSummary();
        return () => { isMounted = false; };
    }, [projectId]);

    if (loading) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                </div>
            </div>
        );
    }

    if (!summary) return null;

    const getTrendIcon = (type: string) => {
        if (type === 'spike') return <TrendingUp className="w-4 h-4 text-green-500" />;
        if (type === 'drop') return <TrendingDown className="w-4 h-4 text-red-500" />;
        if (type === 'inactivity') return <AlertCircle className="w-4 h-4 text-yellow-500" />;
        return null;
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Today's Insight</h3>

            <div className="space-y-3">
                {summary.insights.map((insight: string, index: number) => (
                    <p key={index} className="text-sm text-gray-700 dark:text-gray-300">
                        {insight}
                    </p>
                ))}

                {summary.trends.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <h4 className="text-sm font-medium mb-2 text-gray-900 dark:text-white">Trends</h4>
                        <div className="space-y-2">
                            {summary.trends.map((trend: { type: string; message: string }, index: number) => (
                                <div key={index} className="flex items-start gap-2">
                                    {getTrendIcon(trend.type)}
                                    <p className="text-sm text-gray-600 dark:text-gray-400">{trend.message}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {summary.topTags.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <h4 className="text-sm font-medium mb-2 text-gray-900 dark:text-white">Top Categories</h4>
                        <div className="flex flex-wrap gap-2">
                            {summary.topTags.map((tag: { tag: string; count: number }, index: number) => (
                                <span
                                    key={index}
                                    className="inline-flex items-center px-2 py-1 rounded text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                                >
                                    {tag.tag.replace(/_/g, ' ')} ({tag.count})
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
