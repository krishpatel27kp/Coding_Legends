'use client';

import { useState } from 'react';
import { useAuth } from '@/context/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Link from 'next/link';
import axios from 'axios';
import { BarChart3, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function RegisterPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const [loading, setLoading] = useState(false);

    const API_URL = 'http://localhost:4000/api';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await axios.post(`${API_URL}/auth/register`, { email, password });
            login(res.data.token, res.data.user);
        } catch (err: any) {
            if (err.response?.data?.error && Array.isArray(err.response.data.error)) {
                setError(err.response.data.error.map((e: any) => e.message).join(', '));
            } else {
                setError(err.response?.data?.error || 'Registration failed');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-background p-4 selection:bg-primary/20">
            {/* Background Decoration */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[100px] -z-10 opacity-30 dark:opacity-20 pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                <Link href="/" className="mb-8 flex items-center justify-center gap-2 text-2xl font-bold tracking-tight">
                    <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20">
                        <BarChart3 className="h-6 w-6" />
                    </div>
                    <span>DataPulse</span>
                </Link>

                <Card className="border-border/50 shadow-xl backdrop-blur-sm bg-card/80">
                    <CardHeader className="space-y-1 text-center">
                        <CardTitle className="text-2xl">Create an account</CardTitle>
                        <CardDescription>Enter your email below to create your account</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="name@example.com"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="h-11"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="Min 6 characters"
                                    required
                                    minLength={6}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="h-11"
                                />
                            </div>

                            {error && (
                                <Alert variant="destructive" className="py-2 text-sm bg-destructive/10 text-destructive border-transparent">
                                    <AlertDescription>{error}</AlertDescription>
                                </Alert>
                            )}

                            <Button type="submit" className="w-full h-11 text-base shadow-lg shadow-primary/20" disabled={loading}>
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Creating account...
                                    </>
                                ) : 'Sign up'}
                            </Button>
                        </form>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-4 text-center text-sm text-muted-foreground">
                        <div className="text-center w-full">
                            Already have an account?{' '}
                            <Link href="/login" className="font-medium text-primary hover:underline underline-offset-4 transition-colors">
                                Sign in
                            </Link>
                        </div>
                    </CardFooter>
                </Card>
            </motion.div>
        </div>
    );
}
