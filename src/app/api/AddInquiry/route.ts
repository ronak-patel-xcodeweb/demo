import { APIRequest } from '@/components/api/apirequest';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { agentRequestTemplate, GovernmentBodyServiceRequestTemplate } from '@/components/templates/templates';
import { sendEmail } from '@/components/sendEmail/sendEmail';
import { env } from 'process';

export async function POST(request: NextRequest) {
    try {
        const form = await request.formData();
        const rawData = form.get("data") as string | null;
        const GovernmentBodyInquiry = form.get("GovernmentBodyInquiryTableId") as string | null;
        const userTableId = form.get("userTableId") as string | null;
        const session = await getServerSession(authOptions);
        const user: any = session?.user;
        if (!rawData) {
            return NextResponse.json({ error: "Missing Data" }, { status: 400 });
        }

        const data = JSON.parse(rawData);

        const inquiryPayload = {
            requestTitle: data.requestTitle,
            description: data.description,
            purpose: data.purpose,
            UserId: user?.id
        };
        const governmentBodyInquiryres = await APIRequest('POST', `tables/${GovernmentBodyInquiry}/records`, inquiryPayload);

        const res = await APIRequest(
            "GET",
            `tables/${userTableId}/records?where=(isDeleted,neq,1)~and(role,eq,SuperAdmin)`
        );

        const superAdmins = res.list || [];

        if (superAdmins.length > 0) {
            for (const admin of superAdmins) {
                const email = admin.email;
                const name = admin.name;

                if (email) {
                    await sendEmail({
                        to: email,
                        subject: "New Service Request from a Government Body",
                        htmlTemplate: GovernmentBodyServiceRequestTemplate,
                        templateData: {
                            requestTitle: data.requestTitle,
                            description: data.description,
                            purpose: data.purpose,
                            requestedBy: user?.name,
                            loginUrl: `${env.BLACK_MONOLITH_PUBLIC_URL}government-requests`,
                            blackMonolithEmail: env.Black_MONOLITH_SUPPORT_EMAIL,
                            superAdminName: name
                        },
                    });
                }
            }

        }
        if (!governmentBodyInquiryres?.Id) {
            return NextResponse.json({ error: "Failed to create agent request record" }, { status: 500 });
        }

        return NextResponse.json({
            message: "Records created successfully"
        }, { status: 200 });

    } catch (error: any) {
        console.error("Error in Inquiry Requested API:", error);
        return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
    }
}
