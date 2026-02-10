import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { getProjectTrends } from '../utils/trendService';
import { getLatestSummary } from '../utils/summaryService';
import prisma from '../lib/prisma';

/**
 * Insights Controller
 * Provides endpoints for intelligence features
 */

/**
 * Get project summary
 */
/**
 * Get project summary
 */
export const getProjectSummary = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.userId;
        const projectId = parseInt(req.params.projectId as string);

        if (isNaN(projectId)) {
            return res.status(400).json({ error: 'Invalid project ID' });
        }

        if (!userId) return res.status(401).json({ error: 'Unauthorized' });

        // Verify project ownership
        const project = await prisma.project.findUnique({
            where: { id: projectId },
        });

        if (!project || project.userId !== userId) {
            return res.status(404).json({ error: 'Project not found or access denied' });
        }

        const summary = await getLatestSummary(projectId);

        res.json({ summary });
    } catch (error) {
        console.error('Get project summary error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * Get project trends
 */
export const getProjectTrendsData = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.userId;
        const projectId = parseInt(req.params.projectId as string);

        if (isNaN(projectId)) {
            return res.status(400).json({ error: 'Invalid project ID' });
        }

        if (!userId) return res.status(401).json({ error: 'Unauthorized' });

        // Verify project ownership
        const project = await prisma.project.findUnique({
            where: { id: projectId },
        });

        if (!project || project.userId !== userId) {
            return res.status(404).json({ error: 'Project not found or access denied' });
        }

        const trends = await getProjectTrends(projectId);

        res.json({ trends });
    } catch (error) {
        console.error('Get project trends error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * Get smart filter suggestions
 */
export const getFilterSuggestions = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.userId;
        const projectId = parseInt(req.params.projectId as string);

        if (isNaN(projectId)) {
            return res.status(400).json({ error: 'Invalid project ID' });
        }

        if (!userId) return res.status(401).json({ error: 'Unauthorized' });

        // Verify project ownership
        const project = await prisma.project.findUnique({
            where: { id: projectId },
        });

        if (!project || project.userId !== userId) {
            return res.status(404).json({ error: 'Project not found or access denied' });
        }

        // Get recent tags to suggest filters
        const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);

        const recentTags = await prisma.submission.findMany({
            where: {
                projectId,
                createdAt: { gte: yesterday },
            },
            select: {
                tags: {
                    select: {
                        tag: true,
                    },
                },
            },
        });

        // Count unique tags
        const tagSet = new Set<string>();
        for (const submission of recentTags) {
            for (const { tag } of submission.tags) {
                tagSet.add(tag);
            }
        }

        const suggestions = [
            { type: 'time', label: 'Last 24 hours', filter: { time: '24h' } },
            { type: 'time', label: 'Last 7 days', filter: { time: '7d' } },
            ...Array.from(tagSet).map(tag => ({
                type: 'tag',
                label: tag.replace('_', ' '),
                filter: { tag },
            })),
        ];

        res.json({ suggestions });
    } catch (error) {
        console.error('Get filter suggestions error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
