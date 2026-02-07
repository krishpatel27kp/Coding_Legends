'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '@/context/auth-context';
import { SubmissionsTable } from '@/components/submissions-table';
import { Loader2 } from 'lucide-react';

export default function SubmissionsPage() {
    const { token } = useAuth();
    const [submissions, setSubmissions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (token) {
            axios.get('http://localhost:4000/api/v1', {
                headers: { Authorization: `Bearer ${token}` }
            }).then(res => {
                setSubmissions(res.data.data); // API returns { data: [], total: ... }
                setLoading(false);
            }).catch(err => {
                console.error(err);
                setLoading(false);
            });
        }
    }, [token]);

    return (
        <div className="space-y-8 p-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">All Submissions</h1>
                <p className="text-muted-foreground mt-1">View submissions from all your projects.</p>
            </div>

            {loading ? (
                <div className="flex justify-center p-12">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
            ) : (
                <SubmissionsTable submissions={submissions} showProjectName={true} />
            )}
        </div>
    );
}
