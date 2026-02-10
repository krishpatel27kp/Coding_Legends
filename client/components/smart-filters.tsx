'use client';

import { useEffect, useState } from 'react';
import { Filter } from 'lucide-react';
import { API_URL } from '@/lib/config';
import axios from 'axios';

interface FilterSuggestion {
    type: string;
    label: string;
    filter: Record<string, string>;
}

interface SmartFiltersProps {
    projectId?: string;
    onFilterApply?: (filter: Record<string, string>) => void;
}

export default function SmartFilters({ projectId, onFilterApply }: SmartFiltersProps) {
    const [suggestions, setSuggestions] = useState<FilterSuggestion[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!projectId) return;

        let isMounted = true;
        const fetchSuggestions = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`${API_URL}/api/insights/suggestions/${projectId}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (isMounted) {
                    setSuggestions(response.data.suggestions || []);
                }
            } catch (error) {
                console.error('Failed to fetch suggestions:', error);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchSuggestions();
        return () => { isMounted = false; };
    }, [projectId]);

    if (loading || suggestions.length === 0) return null;

    return (
        <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Quick Filters</span>
            </div>
            <div className="flex flex-wrap gap-2">
                {suggestions.map((suggestion: FilterSuggestion, index: number) => (
                    <button
                        key={index}
                        onClick={() => onFilterApply?.(suggestion.filter)}
                        className="inline-flex items-center px-3 py-1.5 rounded-md text-sm bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors"
                    >
                        {suggestion.label}
                    </button>
                ))}
            </div>
        </div>
    );
}
