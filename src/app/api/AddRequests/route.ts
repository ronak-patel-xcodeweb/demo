import { APIRequest } from '@/components/api/apirequest';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { agentRequestTemplate } from '@/components/templates/templates';
import { sendEmail } from '@/components/sendEmail/sendEmail';
import { env } from 'process';

export async function POST(request: NextRequest) {
    try {
        const form = await request.formData();
        const rawData = form.get("requestData") as string | null;
        const session: any = await getServerSession(authOptions);

        if (!rawData) {
            return NextResponse.json({ error: "Missing requestData" }, { status: 400 });
        }

        const data = JSON.parse(rawData);
        const agentRequestTableId = form.get("agentRequestTableId") as string | null;
        const userTableId = form.get("userTableId") as string | null;
        const scheduleTableId = form.get("scheduleTableId") as string | null;

        if (!agentRequestTableId || !scheduleTableId) {
            return NextResponse.json({ error: "Missing table IDs" }, { status: 400 });
        }
        var scheduleRes;
        if (data.serviceName == "Meeting – Remote/Physical") {

            const schedulePayload = {
                meetingType: data.meetingType
            };

            scheduleRes = await APIRequest('POST', `tables/${scheduleTableId}/records`, schedulePayload);
        }


        const agentRequestPayload = {
            message: data.message,
            Agent: data.agentId,
            Company: +data.companyId,
            Service: [data.serviceId],
            Agent_Status: "Pending",
            Schedule: data.serviceName == "Meeting – Remote/Physical" ? scheduleRes.Id : '',
        };
        const agentRes = await APIRequest('POST', `tables/${agentRequestTableId}/records`, agentRequestPayload);

        if (!agentRes?.Id) {
            return NextResponse.json({ error: "Failed to create agent request record" }, { status: 500 });
        }


        const userRes = await APIRequest('GET', `tables/${userTableId}/records?where=(Id,eq,${data.agentId})`);
        const blackMonolithEmail = env.Black_MONOLITH_SUPPORT_EMAIL;

        const payload = {
            ...data,
            agentName: userRes.list[0].name,
            blackMonolithEmail: blackMonolithEmail,
            review_link: `${env.BLACK_MONOLITH_PUBLIC_URL}agent-requests`,
            contactPersonName: session?.user?.contactPersonName
        }

        let template = agentRequestTemplate
        if (data.serviceName === "Consultation" || data.serviceName === "Subscription") {
            template = template.replace(
                /<tr>\s*<td[^>]*?>\s*Meeting Type[\s\S]*?<\/tr>/i,
                ''
            );
        }

        await sendEmail({ to: userRes.list[0].email, subject: `New Service Request from ${session?.user?.name}`, htmlTemplate: template, templateData: payload })
        return NextResponse.json({
            agentRequest: agentRes,
            schedule: scheduleRes,
            message: "Records created successfully"
        }, { status: 200 });

    } catch (error: any) {
        console.error("Error in Agent Requested API:", error);
        return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
    }
}
