import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import { AuthRequest } from '../middleware/authMiddleware';

export const getSettings = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.userId;
        if (!userId) return res.status(401).json({ error: 'Unauthorized' });

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                email: true,
                notifyNewSubmissions: true,
                notifyMonthlyAnalytics: true,
                unsubscribeAll: true,
            }
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

        const { notifyNewSubmissions, notifyMonthlyAnalytics, unsubscribeAll } = req.body;

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                notifyNewSubmissions,
                notifyMonthlyAnalytics,
                unsubscribeAll
            },
            select: {
                notifyNewSubmissions: true,
                notifyMonthlyAnalytics: true,
                unsubscribeAll: true,
            }
        });

        res.json(updatedUser);
    } catch (error) {
        console.error('Update settings error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
