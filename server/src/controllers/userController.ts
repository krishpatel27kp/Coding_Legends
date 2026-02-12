import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import { hashPassword, comparePassword } from '../utils/auth';
import { AuthRequest } from '../middleware/authMiddleware';
import { z } from 'zod';

const passwordChangeSchema = z.object({
    currentPassword: z.string(),
    newPassword: z.string().min(6),
});

export const getSettings = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.userId;
        if (!userId) return res.status(401).json({ error: 'Unauthorized' });

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                email: true,
                name: true,
                organization: true,
                notifyNewSubmissions: true,
                notifyMonthlyAnalytics: true,
                unsubscribeAll: true,
            } as any
        });

        if (!user) {
            console.log(`[SETTINGS_ERROR] User not found for ID: ${userId}`);
            return res.status(404).json({ error: 'User not found' });
        }

        console.log(`[SETTINGS_SUCCESS] Found user: ${user.email}`);
        res.json(user);
    } catch (error) {
        console.error('Get settings error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const updateSettings = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.userId;
        if (!userId) return res.status(401).json({ error: 'Unauthorized' });

        const { name, organization, notifyNewSubmissions, notifyMonthlyAnalytics, unsubscribeAll } = req.body;

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                name,
                organization,
                notifyNewSubmissions,
                notifyMonthlyAnalytics,
                unsubscribeAll
            } as any,
            select: {
                name: true,
                organization: true,
                notifyNewSubmissions: true,
                notifyMonthlyAnalytics: true,
                unsubscribeAll: true,
            } as any
        });

        res.json(updatedUser);
    } catch (error) {
        console.error('Update settings error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
export const changePassword = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.userId;
        if (!userId) return res.status(401).json({ error: 'Unauthorized' });

        const { currentPassword, newPassword } = passwordChangeSchema.parse(req.body);

        const user = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const isValid = await comparePassword(currentPassword, user.password);
        if (!isValid) {
            return res.status(400).json({ error: 'Invalid current password' });
        }

        const hashedPassword = await hashPassword(newPassword);
        await prisma.user.update({
            where: { id: userId },
            data: { password: hashedPassword }
        });

        res.json({ message: 'Password updated successfully' });
    } catch (error) {
        console.error('Change password error:', error);
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: 'Password must be at least 6 characters' });
        }
        res.status(500).json({ error: 'Internal server error' });
    }
};
