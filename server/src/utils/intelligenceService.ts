import prisma from '../lib/prisma';

/**
 * Intelligence Service
 * Provides automated analysis and insights for form submissions
 */

// Tag definitions with keyword patterns
const TAG_PATTERNS = {
    login_issue: ['login', 'sign in', 'signin', 'password', 'authentication', 'auth', 'access denied', 'locked out'],
    pricing: ['price', 'pricing', 'cost', 'payment', 'billing', 'subscription', 'plan', 'upgrade'],
    support: ['help', 'support', 'issue', 'problem', 'error', 'bug', 'broken', 'not working'],
    feedback: ['feedback', 'suggestion', 'improve', 'feature request', 'would like', 'wish'],
    question: ['how', 'what', 'when', 'where', 'why', 'can i', 'is it possible'],
    complaint: ['angry', 'frustrated', 'terrible', 'awful', 'worst', 'disappointed', 'unacceptable'],
    urgent: ['urgent', 'asap', 'immediately', 'critical', 'emergency', 'important'],
};

/**
 * Analyze submission data and generate tags
 */
export async function analyzeSubmission(submissionId: string, data: any, projectId: number) {
    try {
        console.log(`[INTELLIGENCE] Analyzing submission ${submissionId}...`);

        // Convert data to searchable text for keyword matching
        const text = JSON.stringify(data).toLowerCase();

        // Detect duplicates
        await detectDuplicates(submissionId, data, projectId);

        // Detect Tags
        const tagsToCreate: { tag: string; confidence: number }[] = [];

        for (const [tagName, keywords] of Object.entries(TAG_PATTERNS)) {
            const matches = keywords.filter(word => text.includes(word));
            if (matches.length > 0) {
                const confidence = Math.min(0.5 + (matches.length * 0.1), 1.0);
                tagsToCreate.push({ tag: tagName, confidence });
            }
        }

        if (tagsToCreate.length > 0) {
            await prisma.submissionTag.createMany({
                data: tagsToCreate.map(t => ({
                    submissionId,
                    tag: t.tag,
                    confidence: t.confidence
                }))
            });
            console.log(`[INTELLIGENCE] Added ${tagsToCreate.length} tags to submission ${submissionId}`);
        }

        // Generate Insights
        const insights: { type: string; message: string; metadata?: any }[] = [];

        if (text.includes('urgent') || text.includes('asap') || text.includes('emergenc')) {
            insights.push({
                type: 'priority',
                message: 'This submission requires immediate attention based on keywords.',
                metadata: { priority: 'high' }
            });
        }

        if (text.includes('?') || TAG_PATTERNS.question.some(word => text.includes(word))) {
            insights.push({
                type: 'query',
                message: 'The user appears to be asking a question.',
            });
        }

        if (insights.length > 0) {
            await prisma.submissionInsight.createMany({
                data: insights.map(i => ({
                    submissionId,
                    type: i.type,
                    message: i.message,
                    metadata: i.metadata || null
                }))
            });
            console.log(`[INTELLIGENCE] Added ${insights.length} insights to submission ${submissionId}`);
        }

        // Mark as processed
        await prisma.submission.update({
            where: { id: submissionId },
            data: { processed: true }
        });

    } catch (error) {
        console.error('Intelligence analysis failed:', error);
    }
}

/**
 * Detect duplicate submissions
 */
async function detectDuplicates(submissionId: string, data: any, projectId: number) {
    try {
        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const dataString = JSON.stringify(data);

        const recentSubmissions = await prisma.submission.findMany({
            where: {
                projectId,
                createdAt: { gte: oneDayAgo },
                id: { not: submissionId },
            },
            select: {
                id: true,
                data: true,
            },
        });

        for (const prev of recentSubmissions) {
            // Compare as strings for exact match
            if (JSON.stringify(prev.data) === dataString) {
                await prisma.submission.update({
                    where: { id: submissionId },
                    data: {
                        isDuplicate: true,
                        duplicateOf: prev.id
                    }
                });
                console.log(`[INTELLIGENCE] Detected duplicate submission: ${submissionId} matches ${prev.id}`);
                break;
            }
        }
    } catch (error) {
        console.error('Duplicate detection failed:', error);
    }
}

/**
 * Process submission intelligence asynchronously
 */
export async function processSubmissionIntelligence(submissionId: string, data: any, projectId: number) {
    setImmediate(async () => {
        await analyzeSubmission(submissionId, data, projectId);
    });
}
