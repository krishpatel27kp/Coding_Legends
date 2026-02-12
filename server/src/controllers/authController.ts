import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import { generateToken, hashPassword, comparePassword } from '../utils/auth';
import { z } from 'zod';

const registerSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
});

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string(),
});

export const register = async (req: Request, res: Response) => {
    try {
        const { email, password } = registerSchema.parse(req.body);

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        const hashedPassword = await hashPassword(password);
        const user = await prisma.user.create({
            data: { email, password: hashedPassword },
        });

        const token = generateToken(user.id);
        const userData = user as any;
        res.status(201).json({
            token,
            user: {
                id: userData.id,
                email: userData.email,
                name: userData.name,
                organization: userData.organization
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: error.issues });
        }
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = loginSchema.parse(req.body);

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        const isValid = await comparePassword(password, user.password);
        if (!isValid) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        const token = generateToken(user.id);
        const userData = user as any;
        res.json({
            token,
            user: {
                id: userData.id,
                email: userData.email,
                name: userData.name,
                organization: userData.organization
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: error.issues });
        }
        res.status(500).json({ error: 'Internal server error' });
    }
};
