/**
 * Application Configuration
 * Centralized configuration for environment-specific values
 */

// API URL - Uses environment variable for production, falls back to local for development
// IMPORTANT: Set NEXT_PUBLIC_API_URL in your hosting provider (Vercel, etc.)
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

// API endpoints - Standardized across the application
export const API_ENDPOINTS = {
    auth: `${API_URL}/api/auth`,
    projects: `${API_URL}/api/projects`,
    submissions: `${API_URL}/api/v1`,
    users: `${API_URL}/api/users`,
} as const;
