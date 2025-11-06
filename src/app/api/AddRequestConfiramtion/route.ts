import { APIRequest } from '@/components/api/apirequest';
import { sendEmail } from '@/components/sendEmail/sendEmail';
import { agentAcceptTemplate, agentRejectTemplate } from '@/components/templates/templates';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { env } from 'process';

export async function PATCH(request: NextRequest) {
    try {
        const session:any = await getServerSession(authOptions);

        const form = await request.formData();
        const data = JSON.parse(form.get("data") as string);
        const agentRequestTableId = form.get("agentRequestTableId");
        const userTableId = form.get("userTableId");

        const confiramtionPayload = {
            Id: data.Id,
            Agent_Status: data.Agent_Status
        }
        const resAgent = await APIRequest('PATCH', `tables/${agentRequestTableId}/records`, confiramtionPayload);

        const userRes = await APIRequest('GET', `tables/${userTableId}/records?where=(Id,eq,${data.CompnayId})&nested[Company][fields]=contactPersonName`);
        var template = data.Agent_Status == 'Accepted' ? agentAcceptTemplate : agentRejectTemplate;
        const subject = data.Agent_Status == 'Accepted' ? `Your Service Request Was Accepted by ${session?.user?.name}` : `Your Service Request Was Rejected by ${session?.user?.name}`;
        const blackMonolithEmail = env.Black_MONOLITH_SUPPORT_EMAIL;
        const payload = {
            companyName: userRes?.list[0]?.name,
            agentName: session?.user?.name,
            serviceName: data.Service,
            message: data.Message,
            blackMonolithEmail: blackMonolithEmail,
            request_link: `${env.BLACK_MONOLITH_PUBLIC_URL}agent-requests`,
            contactPersonName: userRes?.list[0]?.Company?.contactPersonName
        }

        if (!data.meetingType) {
            template = template.replace(/<tr>\s*<td[^>]*?>Meeting Type[\s\S]*?<\/tr>/, '');
        }

        await sendEmail({ to: userRes.list[0].email, subject: subject, htmlTemplate: template, templateData: payload })


        return NextResponse.json(resAgent || { message: "The request has been confirmed successfully." }, { status: 200 });
    } catch (error: any) {
        console.error("Error:", error);
        return NextResponse.json({ error: error.message || error }, { status: 500 });
    }
}
