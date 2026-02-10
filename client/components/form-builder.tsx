'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Loader2, Plus, Trash2, GripVertical, Settings2, Layout, Copy, Check, Eye } from 'lucide-react';
import { motion, Reorder } from 'framer-motion';
import axios from 'axios';
import { API_ENDPOINTS, API_URL } from '@/lib/config';

interface FormField {
    id: string;
    type: 'text' | 'email' | 'number' | 'textarea' | 'select' | 'checkbox';
    label: string;
    placeholder?: string;
    required: boolean;
}

interface FormBuilderProps {
    projectId: string;
    initialSchema: string;
    projectApiKey: string;
    token: string;
    onSaveSuccess?: () => void;
}

export function FormBuilder({ projectId, initialSchema, projectApiKey, token, onSaveSuccess }: FormBuilderProps) {
    const [fields, setFields] = useState<FormField[]>([]);
    const [saving, setSaving] = useState(false);
    const [copied, setCopied] = useState(false);
    const [previewMode, setPreviewMode] = useState(false);

    useEffect(() => {
        try {
            if (initialSchema) {
                const parsed = JSON.parse(initialSchema);
                setFields(Array.isArray(parsed) ? parsed : []);
            }
        } catch (e) {
            console.error('Failed to parse initial schema:', e);
            setFields([]);
        }
    }, [initialSchema]);

    const addField = () => {
        const newField: FormField = {
            id: Math.random().toString(36).substr(2, 9),
            type: 'text',
            label: 'New Field',
            placeholder: 'Enter hint...',
            required: false
        };
        setFields([...fields, newField]);
    };

    const removeField = (id: string) => {
        setFields(fields.filter(f => f.id !== id));
    };

    const updateField = (id: string, updates: Partial<FormField>) => {
        setFields(prev => prev.map(f => f.id === id ? { ...f, ...updates } : f));
    };

    const saveSchema = async () => {
        setSaving(true);
        try {
            await axios.put(`${API_ENDPOINTS.projects}/${projectId}`, {
                formSchema: JSON.stringify(fields)
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (onSaveSuccess) onSaveSuccess();
        } catch (error) {
            console.error('Failed to save schema:', error);
        } finally {
            setSaving(false);
        }
    };

    const copyEmbedCode = () => {
        const embedCode = `
<!-- DataPulse Form: ${projectApiKey} -->
<form action="${API_URL}/api/v1/submit/${projectApiKey}" method="POST">
  ${fields.map(field => `
  <div style="margin-bottom: 1rem;">
    <label style="display: block; margin-bottom: 0.5rem;">${field.label}${field.required ? ' *' : ''}</label>
    ${field.type === 'textarea'
                ? `<textarea name="${field.label.toLowerCase().replace(/\s+/g, '_')}" placeholder="${field.placeholder || ''}" ${field.required ? 'required' : ''} style="width: 100%; border: 1px solid #ccc; padding: 0.5rem; border-radius: 4px;"></textarea>`
                : `<input type="${field.type}" name="${field.label.toLowerCase().replace(/\s+/g, '_')}" placeholder="${field.placeholder || ''}" ${field.required ? 'required' : ''} style="width: 100%; border: 1px solid #ccc; padding: 0.5rem; border-radius: 4px;" />`
            }
  </div>`).join('')}
  <button type="submit" style="background: #6366f1; color: white; padding: 0.5rem 1rem; border: none; border-radius: 4px; cursor: pointer;">Submit</button>
</form>
        `.trim();

        navigator.clipboard.writeText(embedCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
                <Card className="border-white/10 bg-card/30 backdrop-blur-xl">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="flex items-center gap-2">
                                <Layout className="h-5 w-5 text-indigo-400" /> Visual Form Builder
                            </CardTitle>
                            <CardDescription>Drag and drop fields to design your custom form.</CardDescription>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={() => setPreviewMode(!previewMode)}>
                                {previewMode ? <Settings2 className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
                                {previewMode ? 'Design View' : 'Live Preview'}
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {previewMode ? (
                            <div className="p-6 bg-white/5 rounded-lg border border-white/10 max-w-md mx-auto space-y-4 shadow-2xl">
                                {fields.length === 0 ? (
                                    <p className="text-center text-muted-foreground py-8">No fields added yet.</p>
                                ) : (
                                    fields.map(field => (
                                        <div key={field.id} className="space-y-1.5">
                                            <Label className="text-sm font-medium">{field.label} {field.required && <span className="text-red-400">*</span>}</Label>
                                            {field.type === 'textarea' ? (
                                                <div className="w-100 min-h-[80px] rounded-md border border-white/20 bg-white/5 px-3 py-2 text-sm text-white/50">{field.placeholder}</div>
                                            ) : (
                                                <div className="w-100 h-10 rounded-md border border-white/20 bg-white/5 px-3 py-2 text-sm text-white/50 flex align-center">{field.placeholder}</div>
                                            )}
                                        </div>
                                    ))
                                )}
                                <Button className="w-full bg-indigo-600">Submit</Button>
                            </div>
                        ) : (
                            <Reorder.Group axis="y" values={fields} onReorder={setFields} className="space-y-3">
                                {fields.map((field) => (
                                    <Reorder.Item key={field.id} value={field}>
                                        <Card className="bg-white/5 border-white/10 group">
                                            <CardContent className="p-4 flex items-start gap-4">
                                                <div className="mt-2 cursor-grab active:cursor-grabbing text-muted-foreground">
                                                    <GripVertical className="h-4 w-4" />
                                                </div>
                                                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <Label className="text-xs">Field Label</Label>
                                                        <Input
                                                            value={field.label}
                                                            onChange={(e) => updateField(field.id, { label: e.target.value })}
                                                            className="bg-transparent"
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label className="text-xs">Type</Label>
                                                        <Select
                                                            value={field.type}
                                                            onValueChange={(val: any) => updateField(field.id, { type: val })}
                                                        >
                                                            <SelectTrigger className="bg-transparent">
                                                                <SelectValue />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="text">Text</SelectItem>
                                                                <SelectItem value="email">Email</SelectItem>
                                                                <SelectItem value="number">Number</SelectItem>
                                                                <SelectItem value="textarea">Message Box</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label className="text-xs">Placeholder</Label>
                                                        <Input
                                                            value={field.placeholder}
                                                            onChange={(e) => updateField(field.id, { placeholder: e.target.value })}
                                                            className="bg-transparent"
                                                        />
                                                    </div>
                                                    <div className="flex items-center space-x-2 pt-8">
                                                        <Switch
                                                            checked={field.required}
                                                            onCheckedChange={(val) => updateField(field.id, { required: val })}
                                                        />
                                                        <Label className="text-xs">Required</Label>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => removeField(field.id)}
                                                            className="ml-auto text-red-500 hover:text-red-400 hover:bg-red-400/10"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </Reorder.Item>
                                ))}
                            </Reorder.Group>
                        )}

                        {!previewMode && (
                            <Button variant="outline" onClick={addField} className="w-full border-dashed border-indigo-500/50 hover:border-indigo-500 hover:bg-indigo-500/5">
                                <Plus className="h-4 w-4 mr-2" /> Add New Field
                            </Button>
                        )}
                    </CardContent>
                    <CardFooter className="border-t border-white/5 pt-6 flex justify-end">
                        <Button onClick={saveSchema} disabled={saving} className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-8">
                            {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                            Save Changes
                        </Button>
                    </CardFooter>
                </Card>
            </div>

            <div className="space-y-6">
                <Card className="border-white/10 bg-indigo-500/5">
                    <CardHeader>
                        <CardTitle className="text-sm">Embed Code</CardTitle>
                        <CardDescription className="text-xs">Copy this HTML to use the form on your own website.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="relative group">
                            <pre className="p-3 bg-black/50 rounded-md text-[10px] text-indigo-200 overflow-x-auto h-[200px]">
                                {`<!-- DataPulse Form -->
<form action="${API_URL}/api/v1/submit/${projectApiKey}" method="POST">
${fields.map(f => `  <input type="${f.type}" name="${f.label.toLowerCase()}" />`).join('\n')}
  <button type="submit">Submit</button>
</form>`}
                            </pre>
                            <Button
                                variant="secondary"
                                size="sm"
                                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={copyEmbedCode}
                            >
                                {copied ? <Check className="h-3 w-3 mr-1" /> : <Copy className="h-3 w-3 mr-1" />}
                                {copied ? 'Copied' : 'Copy'}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
