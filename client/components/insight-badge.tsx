'use client';

interface InsightBadgeProps {
    tag?: string;
    insight?: {
        type: string;
        message: string;
    };
    variant?: 'tag' | 'insight';
}

const TAG_COLORS: Record<string, string> = {
    login_issue: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    pricing: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    support: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    feedback: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
    question: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    complaint: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
    urgent: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 font-semibold',
};

const INSIGHT_COLORS: Record<string, string> = {
    incomplete: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400',
    high_priority: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    duplicate: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
};

export default function InsightBadge({ tag, insight, variant = 'tag' }: InsightBadgeProps) {
    if (variant === 'tag' && tag) {
        const colorClass = TAG_COLORS[tag] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
        const displayText = tag.replace(/_/g, ' ');

        return (
            <span
                className={`inline-flex items-center px-2 py-0.5 rounded text-xs ${colorClass}`}
                title={`Auto-tagged: ${displayText}`}
            >
                {displayText}
            </span>
        );
    }

    if (variant === 'insight' && insight) {
        const colorClass = INSIGHT_COLORS[insight.type] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';

        return (
            <span
                className={`inline-flex items-center px-2 py-0.5 rounded text-xs ${colorClass}`}
                title={insight.message}
            >
                {insight.type.replace(/_/g, ' ')}
            </span>
        );
    }

    return null;
}
