import prisma from '../lib/prisma';
import { getProjectTrends } from './trendService';

/**
 * Summary Generation Service
 * Creates daily and weekly summaries for projects
 */

interface SummaryData {
    totalSubmissions: number;
    newSubmissions: number;
    topTags: Array<{ tag: string; count: number }>;
    trends: Array<{ type: string; message: string }>;
    insights: string[];
}

/**
 * Generate daily summary for a project
 */
export async function generateDailySummary(projectId: number): Promise<SummaryData> {
    const now = new Date();
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    // Get submission counts
    const totalSubmissions = await prisma.submission.count({
        where: { projectId: projectId },
    });

    const newSubmissions = await prisma.submission.count({
        where: {
            projectId,
            createdAt: { gte: yesterday },
        },
    });

    // Get top tags from today
    const tags = await prisma.submissionTag.findMany({
        where: {
            submission: {
                projectId,
                createdAt: { gte: yesterday },
            },
        },
        select: {
            tag: true,
        },
    });

    const tagCounts: Record<string, number> = {};
    for (const { tag } of tags) {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    }

    const topTags = Object.entries(tagCounts)
        .map(([tag, count]) => ({ tag, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 3);

    // Get trends
    const trends = await getProjectTrends(projectId);

    // Generate insights
    const insights: string[] = [];

    if (newSubmissions === 0) {
        insights.push('No new submissions today');
    } else if (newSubmissions === 1) {
        insights.push('You received 1 submission today');
    } else {
        insights.push(`You received ${newSubmissions} submissions today`);
    }

    if (topTags.length > 0) {
        const topTag = topTags[0];
        insights.push(`Most submissions were related to ${topTag.tag.replace('_', ' ')}`);
    }

    return {
        totalSubmissions,
        newSubmissions,
        topTags,
        trends: trends.map(t => ({ type: t.type, message: t.message })),
        insights,
    };
}

/**
 * Save summary to database
 */
export async function saveDailySummary(projectId: number) {
    try {
        const summary = await generateDailySummary(projectId);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        await prisma.projectSummary.upsert({
            where: {
                projectId_period_date: {
                    projectId,
                    period: 'daily',
                    date: today,
                },
            },
            update: {
                summary: summary as any,
            },
            create: {
                projectId,
                period: 'daily',
                date: today,
                summary: summary as any,
            },
        });
    } catch (error) {
        console.error('Failed to save daily summary:', error);
    }
}

/**
 * Get latest summary for a project
 */
export async function getLatestSummary(projectId: number, period: 'daily' | 'weekly' = 'daily'): Promise<SummaryData | null> {
    try {
        const summary = await prisma.projectSummary.findFirst({
            where: {
                projectId,
                period,
            },
            orderBy: {
                date: 'desc',
            },
        });

        if (!summary) {
            // Generate on-the-fly if not found
            return await generateDailySummary(projectId);
        }

        return summary.summary as any;
    } catch (error) {
        console.error('Failed to get latest summary:', error);
        return null;
    }
}
