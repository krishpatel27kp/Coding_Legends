import prisma from '../lib/prisma';

/**
 * Trend Detection Service
 * Analyzes submission patterns and detects trends
 */

interface TrendData {
    type: 'spike' | 'drop' | 'keyword_trend' | 'inactivity';
    message: string;
    severity: 'low' | 'medium' | 'high';
    metadata?: any;
}

/**
 * Detect submission volume trends
 */
export async function detectVolumeTrends(projectId: number): Promise<TrendData[]> {
    // ... (implementation)
    const trends: TrendData[] = [];

    try {
        const now = new Date();
        const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        const twoDaysAgo = new Date(now.getTime() - 48 * 60 * 60 * 1000);

        // Count submissions for today and yesterday
        const todayCount = await prisma.submission.count({
            where: {
                projectId: projectId,
                createdAt: { gte: yesterday },
            },
        });

        const yesterdayCount = await prisma.submission.count({
            where: {
                projectId,
                createdAt: { gte: twoDaysAgo, lt: yesterday },
            },
        });

        // ... (rest of logic)

        // Detect spike (40%+ increase)
        if (yesterdayCount > 0 && todayCount > yesterdayCount * 1.4) {
            const percentIncrease = Math.round(((todayCount - yesterdayCount) / yesterdayCount) * 100);
            trends.push({
                type: 'spike',
                message: `Submission volume increased ${percentIncrease}% compared to yesterday`,
                severity: percentIncrease > 100 ? 'high' : 'medium',
                metadata: { todayCount, yesterdayCount, percentIncrease },
            });
        }

        // Detect drop (40%+ decrease)
        if (yesterdayCount > 0 && todayCount < yesterdayCount * 0.6) {
            const percentDecrease = Math.round(((yesterdayCount - todayCount) / yesterdayCount) * 100);
            trends.push({
                type: 'drop',
                message: `Submission volume decreased ${percentDecrease}% compared to yesterday`,
                severity: percentDecrease > 60 ? 'medium' : 'low',
                metadata: { todayCount, yesterdayCount, percentDecrease },
            });
        }

        // Detect inactivity (no submissions in 24 hours)
        if (todayCount === 0 && yesterdayCount > 0) {
            trends.push({
                type: 'inactivity',
                message: 'No submissions received in the last 24 hours',
                severity: 'medium',
            });
        }

    } catch (error) {
        console.error('Volume trend detection failed:', error);
    }

    return trends;
}

/**
 * Detect keyword trends
 */
export async function detectKeywordTrends(projectId: number): Promise<TrendData[]> {
    const trends: TrendData[] = [];

    try {
        const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);

        // Get tags from recent submissions
        const recentTags = await prisma.submissionTag.findMany({
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

        // ... (rest of logic)
        // Count tag occurrences
        const tagCounts: Record<string, number> = {};
        for (const { tag } of recentTags) {
            tagCounts[tag] = (tagCounts[tag] || 0) + 1;
        }

        // Find trending tags (appearing in 3+ submissions)
        for (const [tag, count] of Object.entries(tagCounts)) {
            if (count >= 3) {
                trends.push({
                    type: 'keyword_trend',
                    message: `"${tag}" appeared in ${count} recent submissions`,
                    severity: count >= 5 ? 'high' : 'medium',
                    metadata: { tag, count },
                });
            }
        }

    } catch (error) {
        console.error('Keyword trend detection failed:', error);
    }

    return trends;
}

/**
 * Get all trends for a project
 */
export async function getProjectTrends(projectId: number): Promise<TrendData[]> {
    const volumeTrends = await detectVolumeTrends(projectId);
    const keywordTrends = await detectKeywordTrends(projectId);

    return [...volumeTrends, ...keywordTrends];
}
