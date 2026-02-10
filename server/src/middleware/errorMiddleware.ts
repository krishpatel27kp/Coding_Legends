import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

export const errorMiddleware = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    console.error(`[ERROR] ${req.method} ${req.url}:`, err);

    if (err instanceof z.ZodError) {
        return res.status(400).json({
            error: 'Validation error',
            details: err.issues
        });
    }

    if (err.name === 'UnauthorizedError') {
        return res.status(401).json({ error: 'Unauthorized access' });
    }

    // Default error
    const status = err.status || 500;
    const message = err.message || 'Internal server error';

    res.status(status).json({
        error: message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};

// Helper for async routes to catch errors
export const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};
