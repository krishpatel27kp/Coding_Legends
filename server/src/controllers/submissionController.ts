import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/authMiddleware';

const prisma = new PrismaClient();

export const submitForm = async (req: Request, res: Response) => {
    try {
        const apiKey = req.params.apiKey as string;
        const data = req.body;

        // Basic validation
        if (!data || Object.keys(data).length === 0) {
            return res.status(400).json({ error: 'Empty payload' });
        }

        const project = await prisma.project.findUnique({
            where: { apiKey },
        });

        if (!project) {
            return res.status(404).json({ error: 'Invalid API Key' });
        }

        // Capture metadata (IP, User Agent) - naive implementation
        const metadata = {
            ip: req.ip,
            userAgent: req.get('User-Agent'),
            referer: req.get('Referer'),
        };

        const submission = await prisma.submission.create({
            data: {
                projectId: project.id,
                data: JSON.stringify(data),
                metadata: JSON.stringify(metadata),
            },
        });

        res.status(201).json({ message: 'Submission received', id: submission.id });
    } catch (error) {
        console.error('Submission error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const getSubmissions = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.userId;
        const projectId = req.params.projectId as string;

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
        });

        const parsedSubmissions = submissions.map(sub => ({
            ...sub,
            data: JSON.parse(sub.data),
            metadata: sub.metadata ? JSON.parse(sub.metadata) : null
        }));

        const total = await prisma.submission.count({ where: { projectId } });

        res.json({ data: parsedSubmissions, total, limit, offset });
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

        // Fetch all projects owned by user to filter submissions
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
            include: { project: { select: { name: true } } }
        });

        const parsedSubmissions = submissions.map(sub => ({
            ...sub,
            data: JSON.parse(sub.data),
            metadata: sub.metadata ? JSON.parse(sub.metadata) : null
        }));

        const total = await prisma.submission.count({
            where: { projectId: { in: projectIds } }
        });

        res.json({ data: parsedSubmissions, total, limit, offset });
    } catch (error) {
        console.error('Get all submissions error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
