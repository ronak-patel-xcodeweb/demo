import { APIRequest } from '@/components/api/apirequest';
import { sendEmail } from '@/components/sendEmail/sendEmail';
import { AgentApprovedTemplate, AgentRejectedTemplate, GovermentBodyApprovedTemplate, GovermentBodyRejectedTemplate } from '@/components/templates/templates';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { env } from 'process';

export async function PATCH(request: NextRequest) {
    try {
        const form = await request.formData();
        const data = JSON.parse(form.get("data") as string);
        const userTableId = form.get("userTableId");
        const agentTableId = form.get("agentTableId");
        const agentData = JSON.parse(form.get("agentData") as string);

        if (data?.agent_status != "Rejected" && data?.role == "Agent") {
            const resAgentData = await APIRequest('GET', `tables/${agentTableId}/records?where=(pseudo_name,eq,${agentData.pseudo_name})`);
            if (resAgentData.list.length > 0) {
                return NextResponse.json({ error: "Pseudo name is already taken." }, { status: 500 });
            }
        }
        const token = crypto.randomBytes(32).toString('hex');

        const password = await bcrypt.hashSync(data?.password || '');

        const payload = {
            ...data,
            isFirstLogin: 1,
            resetToken: token,
            password: password
        }
        const resUser = await APIRequest('PATCH', `tables/${userTableId}/records`, payload);
        if (agentData && data.role == "Agent") {
            const resAgent = await APIRequest('PATCH', `tables/${agentTableId}/records`, agentData);
        }
        const userAgent = await APIRequest('GET', `tables/${userTableId}/records?where=(Id,eq,${data.id})&nested[GovernmentBody][fields]=Id,officer_name`);

        const userdata = userAgent.list[0];
        const loginUrl = `${env.BLACK_MONOLITH_PUBLIC_URL}login`;
        const isApproved = data?.agent_status === "Approved";
        const blackMonolithEmail = env.Black_MONOLITH_SUPPORT_EMAIL;


        if (userdata?.role == "Agent") {
            const emailPayload = {
                name: userdata?.name,
                password: data?.password,
                email: userdata?.email,
                role: userdata?.role,
                loginUrl,
                blackMonolithEmail: blackMonolithEmail
            }
            await sendEmail({
                to: userdata?.email,
                subject: isApproved
                    ? "Your Agent Account Is Approved — Welcome to Black Monolith"
                    : "Your Agent Registration Request Has Been Rejected",
                templateData: emailPayload,
                htmlTemplate: isApproved ? AgentApprovedTemplate : AgentRejectedTemplate,
            });
        }

        if (userdata?.role == "GovernmentBody") {
            const emailPayload = {
                name: userdata?.GovernmentBody?.officer_name,
                password: data?.password,
                email: userdata?.email,
                role: userdata?.role,
                loginUrl,
                blackMonolithEmail: blackMonolithEmail
            }
            await sendEmail({
                to: userdata?.email,
                subject: isApproved
                    ? "Your Government Body Account Is Approved — Welcome to Black Monolith"
                    : "Your Government Body Registration Request Has Been Rejected",
                templateData: emailPayload,
                htmlTemplate: isApproved ? GovermentBodyApprovedTemplate : GovermentBodyRejectedTemplate,
            });
        }
        return NextResponse.json(userAgent || { message: "User Record update successfully" }, { status: 200 });
    } catch (error: any) {
        console.error("Error:", error);
        return NextResponse.json({ error: error || error }, { status: 500 });
    }
}
