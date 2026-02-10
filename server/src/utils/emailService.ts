import nodemailer from 'nodemailer';

/**
 * Modular Email Service
 * Handles sending emails for various system events.
 */



let transporter: nodemailer.Transporter | null = null;

const getTransporter = () => {
    if (!transporter) {
        transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'smtp.ethereal.email',
            port: Number(process.env.SMTP_PORT) || 587,
            secure: process.env.SMTP_PORT === '465', // true for 465, false for other ports
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });
    }
    return transporter;
};

export const sendEmail = async (to: string, subject: string, body: string) => {
    try {
        // If credentials are missing, log and return (avoid crash)
        if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
            console.warn('--- EMAIL MOCK (Missing Credentials) ---');
            console.log(`To: ${to}`);
            console.log(`Subject: ${subject}`);
            console.log('---------------------------------------');
            return false;
        }

        const info = await getTransporter().sendMail({
            from: process.env.SMTP_FROM || '"DataPulse" <notifications@datapulse.io>',
            to,
            subject,
            text: body,
            html: body.replace(/\n/g, '<br>'), // Simple text-to-html conversion
        });

        console.log(`Email sent: ${info.messageId}`);
        return true;
    } catch (error) {
        console.error('Email sending failed:', error);
        return false;
    }
};

export const sendNewSubmissionNotification = async (userEmail: string, projectName: string, submissionData: any) => {
    const subject = `New Submission: ${projectName}`;
    const body = `
        Hello,
        
        You have received a new submission for your project: ${projectName}.
        
        Data:
        ${JSON.stringify(submissionData, null, 2)}
        
        View more details in your dashboard.
        
        Best regards,
        DataPulse Team
    `;

    return sendEmail(userEmail, subject, body);
};
