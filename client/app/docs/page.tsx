import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal, Copy, Shield, Zap, Info } from 'lucide-react';

export default function DocsPage() {
    return (
        <div className="space-y-10 pb-10">
            {/* Header */}
            <div className="space-y-2">
                <h1 className="scroll-m-20 text-4xl font-bold tracking-tight">Documentation</h1>
                <p className="text-lg text-muted-foreground">
                    Everything you need to integrate DataPulse in minutes.
                </p>
                <div className="flex items-center space-x-2 pt-4">
                    <span className="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80">v1.0.0</span>
                </div>
            </div>

            <hr className="my-6 border-muted" />

            {/* Getting Started */}
            <section id="introduction" className="space-y-4">
                <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">Getting Started</h2>
                <p className="leading-7 [&:not(:first-child)]:mt-6">
                    DataPulse is a universal form backend that lets you collect submissions from any HTML form, frontend framework, or mobile app without managing your own server.
                </p>
                <Card>
                    <CardContent className="pt-6">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <h3 className="font-bold">Universal Compatibility</h3>
                                <p className="text-sm text-muted-foreground">Works with React, Vue, Svelte, plain HTML, iOS, Android, and more.</p>
                            </div>
                            <div className="space-y-2">
                                <h3 className="font-bold">Real-time Dashboard</h3>
                                <p className="text-sm text-muted-foreground">View submissions instantly, export data, and manage your forms.</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </section>

            {/* Installation / Quick Start */}
            <section id="quick-start" className="space-y-4">
                <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight">Quick Start</h2>
                <p className="leading-7">
                    Get up and running in 3 simple steps.
                </p>

                <div className="space-y-6">
                    <div className="flex flex-col gap-2">
                        <h3 className="text-xl font-semibold tracking-tight">1. Create a Project</h3>
                        <p className="leading-7">
                            Log in to your dashboard and click <strong>Create Project</strong>. Give it a name to generate your unique API Endpoint.
                        </p>
                    </div>

                    <div className="flex flex-col gap-2">
                        <h3 className="text-xl font-semibold tracking-tight">2. Connect your Form</h3>
                        <p className="leading-7">
                            Point your form's <code>action</code> attribute to your DataPulse endpoint.
                        </p>
                        <div className="relative rounded-lg bg-slate-950 p-4 overflow-x-auto dark:bg-slate-900 border">
                            <pre className="text-sm text-slate-50">
                                <code>
                                    {`<form action="https://api.datapulse.com/v1/submit/{your-project-id}" method="POST">
  <input type="email" name="email" required />
  <textarea name="message" required></textarea>
  <button type="submit">Send</button>
</form>`}
                                </code>
                            </pre>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <h3 className="text-xl font-semibold tracking-tight">3. Check your Dashboard</h3>
                        <p className="leading-7">
                            Send a test submission. It will appear instantly in your dashboard.
                        </p>
                    </div>
                </div>
            </section>

            {/* API Reference */}
            <section id="authentication" className="space-y-4">
                <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight">API Reference</h2>

                <h3 className="text-xl font-semibold tracking-tight mt-6">Authentication</h3>
                <p className="leading-7">
                    For client-side form submissions, no authentication headers are required—the Project ID in the URL identifies the destination.
                </p>
                <Alert>
                    <Info className="h-4 w-4" />
                    <AlertTitle>API Keys</AlertTitle>
                    <AlertDescription>
                        Coming soon: You will need an API Key for server-side programmatic access to fetch submissions (e.g., for building custom admin panels).
                    </AlertDescription>
                </Alert>
            </section>

            <section id="endpoints" className="space-y-4">
                <h3 className="text-xl font-semibold tracking-tight">Submit Data</h3>
                <p className="leading-7">
                    Endpoint to send form data.
                </p>

                <div className="flex items-center gap-2 font-mono text-sm border rounded-md p-2 bg-muted/50 w-full md:w-fit">
                    <span className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-2 py-0.5 rounded font-bold">POST</span>
                    <span>/api/v1/submit/:projectId</span>
                </div>

                <h4 className="font-semibold mt-4">Headers</h4>
                <div className="rounded-md border">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b bg-muted/50">
                                <th className="h-10 px-4 text-left font-medium">Header</th>
                                <th className="h-10 px-4 text-left font-medium">Value</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="p-4 font-mono">Content-Type</td>
                                <td className="p-4">application/json <span className="text-muted-foreground">or</span> application/x-www-form-urlencoded</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <h4 className="font-semibold mt-4">Response</h4>
                <div className="relative rounded-lg bg-slate-950 p-4 overflow-x-auto dark:bg-slate-900 border">
                    <pre className="text-sm text-slate-50">
                        <code>
                            {`{
  "success": true,
  "message": "Submission received",
  "data": {
    "id": "sub_123xyz",
    "createdAt": "2026-02-07T12:00:00Z"
  }
}`}
                        </code>
                    </pre>
                </div>
            </section>

            {/* Security */}
            <section id="security" className="space-y-4">
                <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight">Security & Privacy</h2>
                <div className="grid gap-4 md:grid-cols-2 mt-4">
                    <Card>
                        <CardContent className="pt-6 flex flex-col gap-2">
                            <Shield className="h-8 w-8 text-primary mb-2" />
                            <h3 className="font-bold">Encryption</h3>
                            <p className="text-sm text-muted-foreground">All data is encrypted at rest and in transit using industry-standard TLS 1.3 and AES-256.</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6 flex flex-col gap-2">
                            <Zap className="h-8 w-8 text-primary mb-2" />
                            <h3 className="font-bold">Spam Protection</h3>
                            <p className="text-sm text-muted-foreground">Built-in rate limiting and spam filtering (Honeypot/Akismet integration coming soon) protect your forms.</p>
                        </CardContent>
                    </Card>
                </div>
            </section>

            {/* FAQ */}
            <section id="faq" className="space-y-4">
                <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight">FAQ</h2>
                <div className="space-y-4">
                    <div>
                        <h4 className="font-bold">Can I use this with React Hook Form?</h4>
                        <p className="text-muted-foreground mt-1">Yes! Just send the data to our endpoint in your <code>onSubmit</code> handler using <code>fetch</code> or <code>axios</code>.</p>
                    </div>
                    <div>
                        <h4 className="font-bold">Is there a free tier?</h4>
                        <p className="text-muted-foreground mt-1">Yes, DataPulse offers a generous free tier for developers and small projects.</p>
                    </div>
                </div>
            </section>
        </div>
    );
}
