import sgMail from '@sendgrid/mail';
import { env } from 'process';

export const sendEmail = async ({
    to,
    subject,
    templateData,
    htmlTemplate,
}: any) => {
    try {

        sgMail.setApiKey(env.SENDGRID_API_KEY || '');
        const fromEmail = env.From_Email_Address || ''

        let htmlContent = htmlTemplate;
        for (const key in templateData) {
            const regex = new RegExp(`{{${key}}}`, 'g');
            htmlContent = htmlContent.replace(regex, templateData[key]);
        }

        await sgMail.send({
            to,
            from: fromEmail,
            subject,
            html: htmlContent,
            text: templateData.text,
        });
        return true;
    } catch (error: any) {
        console.error(error.response ? error.response.body : error);
        throw new Error(error.message);
    }
};
