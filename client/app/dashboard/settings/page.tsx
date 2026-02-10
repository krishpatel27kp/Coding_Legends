'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/auth-context';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import {
    User,
    Shield,
    Bell,
    Trash2,
    Key,
    Monitor,
    Globe,
    LogOut,
    RefreshCcw,
    Mail,
    Smartphone,
    CheckCircle2,
    Calendar,
    Loader2
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { API_ENDPOINTS } from '@/lib/config';

export default function SettingsPage() {
    const { user, token, logout } = useAuth();
    const [apiKey, setApiKey] = useState('dp_live_••••••••••••••••••••••••••••••');
    const [isRegenerating, setIsRegenerating] = useState(false);

    // Notification states
    const [settings, setSettings] = useState({
        notifyNewSubmissions: true,
        notifyMonthlyAnalytics: true,
        unsubscribeAll: false
    });
    const [isLoadingSettings, setIsLoadingSettings] = useState(true);

    useEffect(() => {
        if (token) {
            axios.get(`${API_ENDPOINTS.users}/settings`, {
                headers: { Authorization: `Bearer ${token}` }
            }).then(res => {
                setSettings(res.data);
                setIsLoadingSettings(false);
            }).catch(err => {
                console.error('Failed to fetch settings', err);
                setIsLoadingSettings(false);
            });
        }
    }, [token]);

    const handleSettingChange = async (key: string, value: boolean) => {
        const newSettings = { ...settings, [key]: value };
        setSettings(newSettings); // Optimistically update

        try {
            await axios.patch(`${API_ENDPOINTS.users}/settings`, newSettings, {
                headers: { Authorization: `Bearer ${token}` }
            });
        } catch (error) {
            console.error('Failed to update settings', error);
        }
    };

    const handleRegenerateKey = () => {
        setIsRegenerating(true);
        setTimeout(() => {
            setApiKey('dp_live_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15));
            setIsRegenerating(false);
        }, 1500);
    };

    return (
        <div className="space-y-8 p-8 max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                    <p className="text-muted-foreground mt-1">Configure your workspace and security preferences.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="gap-2" onClick={logout}>
                        <LogOut className="h-4 w-4" /> Sign Out
                    </Button>
                </div>
            </div>

            <Tabs defaultValue="account" className="space-y-6">
                <TabsList className="bg-muted/50 p-1">
                    <TabsTrigger value="account" className="gap-2">
                        <User className="h-4 w-4" /> Account
                    </TabsTrigger>
                    <TabsTrigger value="security" className="gap-2">
                        <Shield className="h-4 w-4" /> Security
                    </TabsTrigger>
                    <TabsTrigger value="notifications" className="gap-2">
                        <Bell className="h-4 w-4" /> Notifications
                    </TabsTrigger>
                </TabsList>

                {/* Account Settings */}
                <TabsContent value="account" className="space-y-6">
                    <Card className="border-none shadow-sm bg-card/50">
                        <CardHeader>
                            <CardTitle>Profile Information</CardTitle>
                            <CardDescription>Manage your personal details and public profile.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Full Name</Label>
                                    <Input placeholder="Krish Patel" defaultValue="Krish Patel" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Email Address</Label>
                                    <Input value={user?.email || ''} disabled className="bg-muted/30" />
                                </div>
                            </div>
                            <div className="space-y-2 pt-2">
                                <Label>Organization Name</Label>
                                <Input defaultValue="Coding Legends" />
                            </div>
                        </CardContent>
                        <CardFooter className="border-t bg-muted/10 p-4">
                            <Button size="sm">Save Changes</Button>
                        </CardFooter>
                    </Card>
                </TabsContent>

                {/* Security Settings */}
                <TabsContent value="security" className="space-y-6">
                    <Card className="border-none shadow-sm bg-card/50">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Key className="h-5 w-5 text-primary" /> Global API Key
                            </CardTitle>
                            <CardDescription>Use this key to authenticate your server-side requests.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="relative group">
                                <Input
                                    value={apiKey}
                                    readOnly
                                    className="font-mono pr-24 bg-background/50"
                                />
                                <div className="absolute right-1 top-1 flex gap-1">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-8 group-hover:bg-muted"
                                        onClick={() => navigator.clipboard.writeText(apiKey)}
                                    >
                                        Copy
                                    </Button>
                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        className="h-8 gap-2"
                                        onClick={handleRegenerateKey}
                                        disabled={isRegenerating}
                                    >
                                        {isRegenerating ? <RefreshCcw className="h-3.5 w-3.5 animate-spin" /> : <RefreshCcw className="h-3.5 w-3.5" />}
                                        Regenerate
                                    </Button>
                                </div>
                            </div>
                            <Alert className="bg-amber-500/10 border-amber-500/20 text-amber-500">
                                <Shield className="h-4 w-4" />
                                <AlertTitle className="text-xs font-bold">Important</AlertTitle>
                                <AlertDescription className="text-xs">
                                    Anyone with this key can submit data to your projects. Keep it safe.
                                </AlertDescription>
                            </Alert>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Notifications Settings */}
                <TabsContent value="notifications" className="space-y-6">
                    <Card className="border-none shadow-sm bg-card/50">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Mail className="h-5 w-5" /> Email Notifications
                            </CardTitle>
                            <CardDescription>Configure when you want to receive emails.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6 min-h-[200px] flex flex-col justify-center">
                            {isLoadingSettings ? (
                                <div className="flex items-center justify-center py-8">
                                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                                </div>
                            ) : (
                                <>
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <Label className="text-base">New Submissions</Label>
                                            <p className="text-xs text-muted-foreground">Receive a digest when new data arrives.</p>
                                        </div>
                                        <Switch
                                            checked={settings.notifyNewSubmissions}
                                            onCheckedChange={(v) => handleSettingChange('notifyNewSubmissions', v)}
                                        />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <Label className="text-base">Monthly Analytics</Label>
                                            <p className="text-xs text-muted-foreground">A monthly summary of your data performance.</p>
                                        </div>
                                        <Switch
                                            checked={settings.notifyMonthlyAnalytics}
                                            onCheckedChange={(v) => handleSettingChange('notifyMonthlyAnalytics', v)}
                                        />
                                    </div>
                                    <div className="flex items-center justify-between border-t pt-6">
                                        <div className="space-y-0.5">
                                            <Label className="text-base text-destructive">Unsubscribe from all</Label>
                                            <p className="text-xs text-muted-foreground">Turn off all non-critical emails.</p>
                                        </div>
                                        <Switch
                                            checked={settings.unsubscribeAll}
                                            onCheckedChange={(v) => handleSettingChange('unsubscribeAll', v)}
                                        />
                                    </div>
                                </>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Danger Zone */}
            <div className="pt-8 border-t">
                <div className="bg-destructive/5 rounded-2xl border border-destructive/20 p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                        <h3 className="text-lg font-bold text-destructive flex items-center gap-2">
                            <Trash2 className="h-5 w-5" /> Danger Zone
                        </h3>
                        <p className="text-sm text-destructive/70 mt-1 max-w-md">
                            Deleting your account is permanent and cannot be undone. All your projects, submissions, and keys will be wiped.
                        </p>
                    </div>
                    <Button variant="destructive" className="font-bold h-11 px-8 shadow-lg shadow-destructive/20">
                        Delete Account
                    </Button>
                </div>
            </div>
        </div>
    );
}
