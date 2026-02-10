import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import { AuthRequest } from '../middleware/authMiddleware';

export const submitForm = async (req: Request, res: Response) => {
    try {
        const apiKey = req.params.apiKey as string;
        const data = req.body;

        // Basic validation
        if (!data || Object.keys(data).length === 0) {
            return res.status(400).json({ error: 'Empty payload' });
        }

        // Payload size validation (e.g., max 50KB)
        const payloadSize = JSON.stringify(data).length;
        if (payloadSize > 50000) {
            return res.status(413).json({ error: 'Payload too large. Max 50KB allowed.' });
        }

        const project = await prisma.project.findUnique({
            where: { apiKey },
            include: { user: true }
        });

        if (!project) {
            return res.status(404).json({ error: 'Invalid API Key' });
        }

        // Origin Restriction Check (Using native JSON)
        const allowedOrigins = project.allowedOrigins as any as string[];

        if (allowedOrigins && allowedOrigins.length > 0) {
            const origin = req.get('Origin');
            const referer = req.get('Referer');

            const isAllowed = allowedOrigins.some((allowed: string) => {
                try {
                    const allowedHost = new URL(allowed).hostname;
                    if (origin && new URL(origin).hostname === allowedHost) return true;
                    if (referer && new URL(referer).hostname === allowedHost) return true;
                } catch (e) {
                    if (origin && origin.includes(allowed)) return true;
                    if (referer && referer.includes(allowed)) return true;
                }
                return false;
            });

            if (!isAllowed) {
                console.log(`[AUTH_BLOCKED] Request from unauthorized origin: ${origin || referer}`);
                return res.status(403).json({ error: 'Unauthorized origin' });
            }
        }

        // Capture metadata (IP, User Agent)
        const metadata = {
            ip: req.ip,
            userAgent: req.get('User-Agent'),
            referer: req.get('Referer'),
        };

        const submission = await prisma.submission.create({
            data: {
                projectId: project.id,
                data: data as any,
                metadata: metadata as any,
            },
        });

        // Trigger Webhook (async, non-blocking)
        if (project.webhookUrl) {
            import('../utils/webhookService').then(service => {
                service.triggerWebhook(project.webhookUrl!, data, { id: project.id, name: project.name })
                    .catch(err => console.error('Webhook trigger failed:', err));
            });
        }

        // Trigger Intelligence Processing (async, non-blocking)
        import('../utils/intelligenceService').then(service => {
            service.processSubmissionIntelligence(submission.id, data, project.id)
                .catch(err => console.error('Intelligence processing failed:', err));
        });

        // Trigger Notification
        if (project.user && project.user.notifyNewSubmissions && !project.user.unsubscribeAll) {
            import('../utils/emailService').then(service => {
                service.sendNewSubmissionNotification(
                    project.user.email,
                    project.name,
                    data
                ).catch(err => console.error('Failed to send notification email:', err));
            });
        }

        res.status(201).json({ message: 'Submission received', id: submission.id });
    } catch (error) {
        console.error('Submission error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const getSubmissions = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.userId;
        const projectId = parseInt(req.params.projectId as string);

        if (isNaN(projectId)) {
            return res.status(400).json({ error: 'Invalid project ID' });
        }

        if (!userId) return res.status(401).json({ error: 'Unauthorized' });

        const project = await prisma.project.findUnique({
            where: { id: projectId },
        });

        if (!project || project.userId !== userId) {
            return res.status(404).json({ error: 'Project not found or access denied' });
        }

        const limit = parseInt(req.query.limit as string) || 50;
        const offset = parseInt(req.query.offset as string) || 0;

        const submissions = await prisma.submission.findMany({
            where: { projectId },
            orderBy: { createdAt: 'desc' },
            take: limit,
            skip: offset,
            include: {
                tags: true,
                insights: true,
            },
        });

        const total = await prisma.submission.count({ where: { projectId } });

        res.json({ data: submissions, total, limit, offset });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const getAllSubmissions = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.userId;
        if (!userId) return res.status(401).json({ error: 'Unauthorized' });

        const limit = parseInt(req.query.limit as string) || 50;
        const offset = parseInt(req.query.offset as string) || 0;

        const projects = await prisma.project.findMany({
            where: { userId },
            select: { id: true, name: true }
        });

        const projectIds = projects.map(p => p.id);

        const submissions = await prisma.submission.findMany({
            where: { projectId: { in: projectIds } },
            orderBy: { createdAt: 'desc' },
            take: limit,
            skip: offset,
            include: {
                project: { select: { name: true } },
                tags: true,
                insights: true,
            }
        });

        const total = await prisma.submission.count({
            where: { projectId: { in: projectIds } }
        });

        res.json({ data: submissions, total, limit, offset });
    } catch (error) {
        console.error('Get all submissions error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
