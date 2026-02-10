import crypto from 'crypto';

export const triggerWebhook = async (webhookUrl: string, data: any, project: { id: number, name: string }) => {
    if (!webhookUrl) return;

    try {
        const secret = process.env.WEBHOOK_SECRET || 'datapulse_default_secret_32chars_min';
        const payload = JSON.stringify({
            event: 'submission.created',
            project: {
                id: project.id,
                name: project.name
            },
            data: data,
            timestamp: new Date().toISOString()
        });

        const signature = crypto
            .createHmac('sha256', secret)
            .update(payload)
            .digest('hex');

        console.log(`[WEBHOOK] Triggering for project ${project.name} (${project.id}) -> ${webhookUrl}`);

        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 10000); // 10s timeout

        const response = await fetch(webhookUrl, {
            method: 'POST',
            signal: controller.signal,
            headers: {
                'Content-Type': 'application/json',
                'X-DataPulse-Signature': `v1=${signature}`,
                'User-Agent': 'DataPulse-Webhook/1.0'
            },
            body: payload
        });

        clearTimeout(timeout);

        if (!response.ok) {
            console.error(`[WEBHOOK] Failed with status: ${response.status}`);
        } else {
            console.log(`[WEBHOOK] Successfully delivered to ${webhookUrl}`);
        }
    } catch (error) {
        console.error('[WEBHOOK] Error sending request:', error);
    }
};
