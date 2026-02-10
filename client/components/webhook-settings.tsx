'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Webhook, CheckCircle2, AlertCircle } from 'lucide-react';
import axios from 'axios';
import { API_ENDPOINTS } from '@/lib/config';

interface WebhookSettingsProps {
    projectId: string;
    initialUrl: string;
    token: string;
    onSaveSuccess?: () => void;
}

export function WebhookSettings({ projectId, initialUrl, token, onSaveSuccess }: WebhookSettingsProps) {
    const [webhookUrl, setWebhookUrl] = useState(initialUrl || '');
    const [saving, setSaving] = useState(false);
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    const handleSave = async () => {
        if (!webhookUrl) return;

        // Simple URL validation
        try {
            new URL(webhookUrl);
        } catch (e) {
            setStatus('error');
            setMessage('Please enter a valid URL (starting with http:// or https://)');
            return;
        }

        setSaving(true);
        setStatus('idle');

        try {
            await axios.put(`${API_ENDPOINTS.projects}/${projectId}`, {
                webhookUrl
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setStatus('success');
            setMessage('Webhook URL updated successfully!');
            if (onSaveSuccess) onSaveSuccess();
        } catch (error: any) {
            console.error('Failed to save webhook:', error);
            setStatus('error');
            setMessage(error.response?.data?.error?.[0]?.message || 'Failed to update webhook URL');
        } finally {
            setSaving(false);
        }
    };

    const handleRemove = async () => {
        setSaving(true);
        try {
            await axios.put(`${API_ENDPOINTS.projects}/${projectId}`, {
                webhookUrl: ''
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setWebhookUrl('');
            setStatus('success');
            setMessage('Webhook removed successfully.');
            if (onSaveSuccess) onSaveSuccess();
        } catch (error) {
            setStatus('error');
            setMessage('Failed to remove webhook.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <Card className="border-white/10 bg-card/30 backdrop-blur-xl">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Webhook className="h-5 w-5 text-blue-400" /> Webhook Integration
                </CardTitle>
                <CardDescription>
                    Automatically send a POST request to your external server whenever a new submission is received.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="webhook-url">Endpoint URL</Label>
                    <Input
                        id="webhook-url"
                        placeholder="https://your-server.com/api/webhook"
                        value={webhookUrl}
                        onChange={(e) => setWebhookUrl(e.target.value)}
                        className="bg-white/5 border-white/10"
                    />
                    <p className="text-xs text-muted-foreground">
                        We will send a JSON payload with submission data and metadata.
                    </p>
                </div>

                {status !== 'idle' && (
                    <div className={`p-3 rounded-md flex items-start gap-2 text-sm ${status === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                            'bg-red-500/10 text-red-400 border border-red-500/20'
                        }`}>
                        {status === 'success' ? <CheckCircle2 className="h-4 w-4 mt-0.5" /> : <AlertCircle className="h-4 w-4 mt-0.5" />}
                        <span>{message}</span>
                    </div>
                )}
            </CardContent>
            <CardFooter className="flex justify-between border-t border-white/5 pt-6">
                <Button variant="ghost" onClick={handleRemove} disabled={saving || !initialUrl} className="text-red-400 hover:text-red-300 hover:bg-red-400/10">
                    Remove Webhook
                </Button>
                <Button onClick={handleSave} disabled={saving || !webhookUrl} className="bg-blue-600 hover:bg-blue-500 text-white font-bold">
                    {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                    Save Webhook
                </Button>
            </CardFooter>
        </Card>
    );
}
