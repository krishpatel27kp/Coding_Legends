'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/auth-context';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
    User,
    Shield,
    Bell,
    Key,
    Globe,
    LogOut,
    RefreshCcw,
    Mail,
    Loader2,
    Lock,
    Eye,
    EyeOff,
    Copy,
    Check
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { API_ENDPOINTS } from '@/lib/config';

export default function SettingsPage() {
    const { user, token, logout } = useAuth();
    const [apiKey, setApiKey] = useState('dp_live_••••••••••••••••••••••••••••••');
    const [isRegenerating, setIsRegenerating] = useState(false);
    const [isKeyVisible, setIsKeyVisible] = useState(false);
    const [copiedKey, setCopiedKey] = useState(false);

    // Notification and Profile states
    const [settings, setSettings] = useState({
        name: '',
        organization: '',
        notifyNewSubmissions: true,
        notifyMonthlyAnalytics: true,
        unsubscribeAll: false
    });
    const [isLoadingSettings, setIsLoadingSettings] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    // Password change state
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [isChangingPassword, setIsChangingPassword] = useState(false);

    useEffect(() => {
        if (token) {
            axios.get(`${API_ENDPOINTS.users}/settings`, {
                headers: { Authorization: `Bearer ${token}` }
            }).then(res => {
                setSettings({
                    name: res.data.name || '',
                    organization: res.data.organization || '',
                    notifyNewSubmissions: res.data.notifyNewSubmissions ?? true,
                    notifyMonthlyAnalytics: res.data.notifyMonthlyAnalytics ?? true,
                    unsubscribeAll: res.data.unsubscribeAll ?? false,
                });
                setIsLoadingSettings(false);
            }).catch(err => {
                console.error('Failed to fetch settings', err);
                setIsLoadingSettings(false);
            });
        }
    }, [token]);

    const handleSettingChange = async (key: string, value: any) => {
        const newSettings = { ...settings, [key]: value };
        setSettings(newSettings);

        if (typeof value === 'boolean') {
            if (!token) return;
            try {
                await axios.patch(`${API_ENDPOINTS.users}/settings`, newSettings, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } catch (error) {
                console.error('Failed to update settings', error);
            }
        }
    };

    const saveProfile = async () => {
        if (!token) {
            alert('Your session has expired. Please log in again.');
            return;
        }
        setIsSaving(true);
        try {
            await axios.patch(`${API_ENDPOINTS.users}/settings`, settings, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setIsSaving(false);
            alert('Profile updated successfully!');
        } catch (error: any) {
            console.error('Failed to save profile', error);
            setIsSaving(false);
            const message = error.response?.data?.error || 'Failed to update profile.';
            alert(message);
        }
    };

    const handleRegenerateKey = () => {
        setIsRegenerating(true);
        setTimeout(() => {
            const newKey = 'dp_live_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
            setApiKey(newKey);
            setIsRegenerating(false);
        }, 1500);
    };

    const handleCopyKey = () => {
        navigator.clipboard.writeText(apiKey);
        setCopiedKey(true);
        setTimeout(() => setCopiedKey(false), 2000);
    };

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            alert("New passwords don't match!");
            return;
        }

        setIsChangingPassword(true);
        try {
            await axios.post(`${API_ENDPOINTS.users}/change-password`, {
                currentPassword: passwordForm.currentPassword,
                newPassword: passwordForm.newPassword
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Password updated successfully!');
            setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (error: any) {
            console.error('Failed to change password', error);
            alert(error.response?.data?.error || 'Failed to update password.');
        } finally {
            setIsChangingPassword(false);
        }
    };

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 md:space-y-12 mb-10">
            {/* Header - Mobile Optimized padding and font */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 md:pb-8 border-b border-white/5">
                <div className="space-y-2">
                    <h1 className="text-3xl md:text-5xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-white/20 leading-tight">
                        Settings
                    </h1>
                    <p className="text-muted-foreground text-base md:text-lg font-medium max-w-md">
                        Manage your identity, security, and global preferences.
                    </p>
                </div>
                <Button variant="outline" size="lg" className="w-full md:w-auto rounded-full gap-2 border-white/10 hover:bg-white/5 h-12 md:h-14 px-6 md:px-8 text-sm md:text-base font-bold shadow-sm" onClick={logout}>
                    <LogOut className="h-4 w-4 md:h-5 md:w-5" /> Sign Out
                </Button>
            </div>

            {/* Grid Layout - Tiled Stack on Mobile */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 md:gap-10">

                {/* Profile Section */}
                <div className="xl:col-span-8 space-y-4 md:space-y-6">
                    <div className="flex items-center gap-3 md:gap-4">
                        <div className="h-8 w-8 md:h-10 md:w-10 rounded-lg md:rounded-xl bg-primary/10 flex items-center justify-center">
                            <User className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                        </div>
                        <h2 className="text-xl md:text-2xl font-bold tracking-tight">Profile Identity</h2>
                        <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
                    </div>

                    <Card className="border-none shadow-xl md:shadow-2xl bg-[#0A0C10] overflow-hidden">
                        <CardHeader className="bg-white/[0.02] border-b border-white/5 py-6 md:py-8 p-6 md:p-8">
                            <CardTitle className="text-lg md:text-xl font-bold">Account Information</CardTitle>
                            <CardDescription className="text-sm md:text-base mt-1 md:mt-2">Update your personal details and organizational presence.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-6 md:p-10 space-y-6 md:space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
                                <div className="space-y-3 md:space-y-4">
                                    <Label className="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground/60">Full Name</Label>
                                    <Input
                                        placeholder="Your Name"
                                        value={settings.name}
                                        onChange={(e) => handleSettingChange('name', e.target.value)}
                                        className="bg-white/5 border-white/10 h-12 md:h-14 rounded-xl md:rounded-2xl focus:bg-white/10 text-base md:text-lg transition-all"
                                    />
                                </div>
                                <div className="space-y-3 md:space-y-4">
                                    <Label className="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground/60">Email Address</Label>
                                    <div className="flex items-center gap-3 md:gap-4 h-12 md:h-14 border border-white/5 bg-white/[0.01] rounded-xl md:rounded-2xl px-4 md:px-5 text-muted-foreground/40 italic overflow-hidden">
                                        <Mail className="h-4 w-4 md:h-5 md:w-5 opacity-40 shrink-0" />
                                        <span className="text-sm md:text-base truncate">{user?.email || ''}</span>
                                        <Badge variant="outline" className="ml-auto text-[8px] md:text-[10px] uppercase font-black border-green-500/20 text-green-500 bg-green-500/5 whitespace-nowrap">Verified</Badge>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-3 md:space-y-4">
                                <Label className="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground/60">Organization</Label>
                                <div className="relative">
                                    <Globe className="absolute left-4 md:left-5 top-1/2 -translate-y-1/2 h-4 w-4 md:h-5 md:w-5 text-muted-foreground/30" />
                                    <Input
                                        placeholder="Your Organization"
                                        value={settings.organization}
                                        onChange={(e) => handleSettingChange('organization', e.target.value)}
                                        className="pl-12 md:pl-14 bg-white/5 border-white/10 h-12 md:h-14 rounded-xl md:rounded-2xl focus:bg-white/10 text-base md:text-lg transition-all"
                                    />
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="bg-white/[0.02] border-t border-white/5 p-6 md:p-8">
                            <Button size="lg" onClick={saveProfile} disabled={isSaving} className="w-full md:w-auto rounded-xl md:rounded-2xl px-8 md:px-12 h-12 md:h-14 font-black transition-all hover:scale-[1.02] active:scale-95 shadow-xl md:shadow-2xl shadow-primary/20">
                                {isSaving && <Loader2 className="mr-2 md:mr-3 h-4 w-4 md:h-5 md:w-5 animate-spin" />}
                                Update Profile
                            </Button>
                        </CardFooter>
                    </Card>
                </div>

                {/* Right Column - System Info - Mobile Optimized Grid */}
                <div className="xl:col-span-4 space-y-4 md:space-y-6">
                    <div className="flex items-center gap-4">
                        <h2 className="text-[10px] md:text-sm font-black uppercase tracking-[0.3em] text-muted-foreground/60">Workspace</h2>
                        <div className="h-px flex-1 bg-white/5" />
                    </div>
                    <div className="p-6 md:p-8 rounded-2xl md:rounded-[2rem] bg-gradient-to-br from-white/[0.03] to-transparent border border-white/5 space-y-6 md:space-y-8 shadow-inner">
                        <div className="space-y-3 md:space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] md:text-xs font-bold text-muted-foreground">Status</span>
                                <Badge className="bg-green-500/10 text-green-500 border border-green-500/20 rounded-full px-2 md:px-3 py-0.5 md:py-1 text-[8px] md:text-[10px] font-black uppercase">Live</Badge>
                            </div>
                            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full w-[95%] bg-green-500/50 shadow-[0_0_8px_rgba(34,197,94,0.4)]" />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-3 md:p-4 rounded-xl md:rounded-2xl bg-white/[0.02] border border-white/5">
                                <p className="text-[8px] md:text-[10px] font-black text-muted-foreground/40 uppercase mb-1">Region</p>
                                <p className="text-xs md:text-sm font-bold truncate">AP South 1</p>
                            </div>
                            <div className="p-3 md:p-4 rounded-xl md:rounded-2xl bg-white/[0.02] border border-white/5">
                                <p className="text-[8px] md:text-[10px] font-black text-muted-foreground/40 uppercase mb-1">Plan</p>
                                <p className="text-xs md:text-sm font-bold">Pro Edge</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Security Section */}
                <div className="xl:col-span-6 space-y-4 md:space-y-6">
                    <div className="flex items-center gap-3 md:gap-4">
                        <div className="h-8 w-8 md:h-10 md:w-10 rounded-lg md:rounded-xl bg-primary/10 flex items-center justify-center">
                            <Lock className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                        </div>
                        <h2 className="text-xl md:text-2xl font-bold tracking-tight">Security</h2>
                        <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:gap-8">
                        {/* API Access */}
                        <Card className="border-none shadow-xl md:shadow-2xl bg-[#0A0C10]">
                            <CardHeader className="bg-white/[0.02] border-b border-white/5 p-6 md:p-8">
                                <CardTitle className="text-base md:text-lg flex items-center gap-3">
                                    <Key className="h-4 w-4 md:h-5 md:w-5 text-primary" /> Global Ingestion Key
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 md:p-8 space-y-6 md:space-y-8">
                                <div className="relative group">
                                    <Input
                                        value={isKeyVisible ? apiKey : '••••••••••••••••••••••••••••••'}
                                        readOnly
                                        className="font-mono h-14 md:h-16 pr-24 md:pr-32 bg-black/40 border-white/10 rounded-xl md:rounded-2xl text-sm md:text-base tracking-widest overflow-hidden"
                                    />
                                    <div className="absolute right-1 md:right-2 top-1 md:top-2 flex gap-1">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-12 w-10 md:w-12 p-0 rounded-lg md:rounded-xl hover:bg-white/10 transition-colors"
                                            onClick={() => setIsKeyVisible(!isKeyVisible)}
                                        >
                                            {isKeyVisible ? <EyeOff className="h-4 w-4 md:h-5 md:w-5 text-muted-foreground" /> : <Eye className="h-4 w-4 md:h-5 md:w-5 text-muted-foreground" />}
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-12 w-10 md:w-12 p-0 rounded-lg md:rounded-xl hover:bg-white/10 transition-colors"
                                            onClick={handleCopyKey}
                                        >
                                            {copiedKey ? <Check className="h-4 w-4 md:h-5 md:w-5 text-green-400" /> : <Copy className="h-4 w-4 md:h-5 md:w-5 text-muted-foreground" />}
                                        </Button>
                                    </div>
                                </div>
                                <Button
                                    variant="secondary"
                                    className="w-full h-12 md:h-14 rounded-xl md:rounded-2xl gap-2 md:gap-3 font-black text-sm md:text-base shadow-lg active:scale-95 transition-all"
                                    onClick={handleRegenerateKey}
                                    disabled={isRegenerating}
                                >
                                    {isRegenerating ? <RefreshCcw className="h-4 w-4 md:h-5 md:w-5 animate-spin" /> : <RefreshCcw className="h-4 w-4 md:h-5 md:w-5" />}
                                    Rotate Access Key
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Password Stacked */}
                        <Card className="border-none shadow-xl md:shadow-2xl bg-[#0A0C10]">
                            <form onSubmit={handlePasswordChange}>
                                <CardHeader className="bg-white/[0.02] border-b border-white/5 p-6 md:p-8">
                                    <CardTitle className="text-base md:text-lg flex items-center gap-3">
                                        <Shield className="h-4 w-4 md:h-5 md:w-5 text-primary" /> Update Password
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-6 md:p-8 space-y-4 md:space-y-5">
                                    <Input
                                        type="password"
                                        placeholder="Current Password"
                                        value={passwordForm.currentPassword}
                                        onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                                        className="h-12 md:h-14 bg-black/40 border-white/10 rounded-xl md:rounded-2xl px-5 md:px-6 text-sm"
                                        required
                                    />
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                                        <Input
                                            type="password"
                                            placeholder="New Password"
                                            value={passwordForm.newPassword}
                                            onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                                            className="h-12 md:h-14 bg-black/40 border-white/10 rounded-xl md:rounded-2xl px-5 md:px-6 text-sm"
                                            required
                                        />
                                        <Input
                                            type="password"
                                            placeholder="Confirm"
                                            value={passwordForm.confirmPassword}
                                            onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                                            className="h-12 md:h-14 bg-black/40 border-white/10 rounded-xl md:rounded-2xl px-5 md:px-6 text-sm"
                                            required
                                        />
                                    </div>
                                    <Button type="submit" className="w-full h-12 md:h-14 rounded-xl md:rounded-2xl font-black text-sm md:text-base mt-2 shadow-lg active:scale-95 transition-all" disabled={isChangingPassword}>
                                        {isChangingPassword && <Loader2 className="mr-2 md:mr-3 h-4 w-4 md:h-5 md:w-5 animate-spin" />}
                                        Save New Credentials
                                    </Button>
                                </CardContent>
                            </form>
                        </Card>
                    </div>
                </div>

                {/* Notifications Section */}
                <div className="xl:col-span-6 space-y-4 md:space-y-6">
                    <div className="flex items-center gap-3 md:gap-4">
                        <div className="h-8 w-8 md:h-10 md:w-10 rounded-lg md:rounded-xl bg-primary/10 flex items-center justify-center">
                            <Bell className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                        </div>
                        <h2 className="text-xl md:text-2xl font-bold tracking-tight">Notifications</h2>
                        <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
                    </div>

                    <Card className="border-none shadow-xl md:shadow-2xl bg-[#0A0C10] h-full flex flex-col">
                        <CardHeader className="bg-white/[0.02] border-b border-white/5 p-6 md:p-8">
                            <CardTitle className="text-lg md:text-xl font-bold">Alert Preferences</CardTitle>
                            <CardDescription className="text-sm md:text-base mt-1 md:mt-2">Configure intelligent alerts and activity reports.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-6 md:p-10 space-y-8 md:space-y-12 flex-1">
                            {isLoadingSettings ? (
                                <div className="flex items-center justify-center py-16 md:py-20">
                                    <Loader2 className="h-8 w-8 md:h-10 md:w-10 animate-spin text-primary/30" />
                                </div>
                            ) : (
                                <>
                                    <div className="flex items-center justify-between group gap-4">
                                        <div className="space-y-1 md:space-y-2">
                                            <Label className="text-base md:text-lg font-bold">New Submissions</Label>
                                            <p className="text-xs md:text-sm text-muted-foreground max-w-[200px] md:max-w-xs leading-relaxed">Instant push alerts when data hits your API endpoints.</p>
                                        </div>
                                        <Switch
                                            checked={settings.notifyNewSubmissions}
                                            onCheckedChange={(v) => handleSettingChange('notifyNewSubmissions', v)}
                                            className="data-[state=checked]:bg-primary shrink-0"
                                        />
                                    </div>

                                    <div className="h-px bg-white/5" />

                                    <div className="flex items-center justify-between group gap-4">
                                        <div className="space-y-1 md:space-y-2">
                                            <Label className="text-base md:text-lg font-bold">Monthly Strategy</Label>
                                            <p className="text-xs md:text-sm text-muted-foreground max-w-[200px] md:max-w-xs leading-relaxed">Deep dive performance reports and optimization insights.</p>
                                        </div>
                                        <Switch
                                            checked={settings.notifyMonthlyAnalytics}
                                            onCheckedChange={(v) => handleSettingChange('notifyMonthlyAnalytics', v)}
                                            className="data-[state=checked]:bg-primary shrink-0"
                                        />
                                    </div>

                                    <div className="p-5 md:p-8 rounded-2xl md:rounded-3xl bg-destructive/5 border border-destructive/10 flex items-center justify-between mt-8 md:mt-12 transition-all hover:bg-destructive/10 gap-4">
                                        <div className="space-y-1 md:space-y-2">
                                            <Label className="text-sm md:text-base font-black text-destructive uppercase tracking-tighter">Total Blackout</Label>
                                            <p className="text-[10px] md:text-xs text-muted-foreground/60 italic">Silence all automated communications immediately.</p>
                                        </div>
                                        <Switch
                                            checked={settings.unsubscribeAll}
                                            onCheckedChange={(v) => handleSettingChange('unsubscribeAll', v)}
                                            className="data-[state=checked]:bg-destructive shrink-0"
                                        />
                                    </div>
                                </>
                            )}
                        </CardContent>
                    </Card>
                </div>

            </div>
        </div>
    );
}
