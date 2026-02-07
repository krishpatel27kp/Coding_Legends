'use client';

import { useAuth } from '@/context/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function SettingsPage() {
    const { user } = useAuth();

    return (
        <div className="space-y-8 p-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                <p className="text-muted-foreground mt-1">Manage your account preferences.</p>
            </div>

            <Card className="max-w-2xl">
                <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>Your account details.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>Email Address</Label>
                        <Input value={user?.email || ''} readOnly disabled />
                        <p className="text-xs text-muted-foreground">Contact support to change your email.</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
