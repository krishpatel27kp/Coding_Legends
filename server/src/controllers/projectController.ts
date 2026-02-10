import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { AuthRequest } from '../middleware/authMiddleware';

const createProjectSchema = z.object({
    name: z.string().min(1),
    formSchema: z.any().optional(),
    webhookUrl: z.string().url().optional().or(z.literal('')),
});

const updateProjectSchema = z.object({
    name: z.string().min(1).optional(),
    allowedOrigins: z.array(z.string()).optional(),
    formSchema: z.any().optional(),
    webhookUrl: z.string().url().optional().or(z.literal('')),
});

export const createProject = async (req: AuthRequest, res: Response) => {
    try {
        const { name, formSchema, webhookUrl } = createProjectSchema.parse(req.body);
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
                formSchema: formSchema || [],
                webhookUrl: webhookUrl || null,
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
        const id = parseInt(req.params.id as string);

        if (isNaN(id)) {
            return res.status(400).json({ error: 'Invalid project ID' });
        }

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

export const updateProject = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.userId;
        const id = parseInt(req.params.id as string);
        const { name, allowedOrigins, formSchema, webhookUrl } = updateProjectSchema.parse(req.body);

        if (isNaN(id)) {
            return res.status(400).json({ error: 'Invalid project ID' });
        }

        if (!userId) return res.status(401).json({ error: 'Unauthorized' });

        const project = await prisma.project.findUnique({ where: { id } });

        if (!project || project.userId !== userId) {
            return res.status(404).json({ error: 'Project not found' });
        }

        const updatedProject = await prisma.project.update({
            where: { id },
            data: {
                name: name !== undefined ? name : project.name,
                allowedOrigins: allowedOrigins !== undefined ? allowedOrigins : project.allowedOrigins as any,
                formSchema: formSchema !== undefined ? formSchema : project.formSchema as any,
                webhookUrl: webhookUrl !== undefined ? (webhookUrl === '' ? null : webhookUrl) : project.webhookUrl,
            },
        });

        res.json(updatedProject);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: error.issues });
        }
        console.error('Update project error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
