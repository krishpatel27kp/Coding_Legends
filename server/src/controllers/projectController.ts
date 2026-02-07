import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { AuthRequest } from '../middleware/authMiddleware';

const prisma = new PrismaClient();

const createProjectSchema = z.object({
    name: z.string().min(1),
});

export const createProject = async (req: AuthRequest, res: Response) => {
    try {
        const { name } = createProjectSchema.parse(req.body);
        const userId = req.user?.userId;

        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const apiKey = uuidv4();
        const project = await prisma.project.create({
            data: {
                name,
                apiKey,
                userId,
            },
        });

        res.status(201).json(project);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: error.issues });
        }
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const getProjects = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.userId;
        if (!userId) return res.status(401).json({ error: 'Unauthorized' });

        const projects = await prisma.project.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            include: { _count: { select: { submissions: true } } },
        });

        res.json(projects);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const regenerateApiKey = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.userId;
        const { id } = req.params;

        if (!userId) return res.status(401).json({ error: 'Unauthorized' });

        const project = await prisma.project.findUnique({ where: { id } });

        if (!project || project.userId !== userId) {
            return res.status(404).json({ error: 'Project not found' });
        }

        const newApiKey = uuidv4();
        const updatedProject = await prisma.project.update({
            where: { id },
            data: { apiKey: newApiKey },
        });

        res.json({ apiKey: updatedProject.apiKey });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};
