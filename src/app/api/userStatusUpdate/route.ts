import { APIRequest } from '@/components/api/apirequest';
import { sendEmail } from '@/components/sendEmail/sendEmail';
import { userStatusActive, userStatusInactive } from '@/components/templates/templates';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { env } from 'process';

export async function PATCH(request: NextRequest) {
    try {
        const form = await request.formData();
        const data = JSON.parse(form.get("data") as string);
        const userTableId = form.get("userTableId");
        const payload = {
            Id: data.Id,
            active: data.active
        };


        const resUser = await APIRequest('PATCH', `tables/${userTableId}/records`, payload);
        const session = await getServerSession(authOptions);
        const user: any = session?.user
        const blackMonolithEmail = env.Black_MONOLITH_SUPPORT_EMAIL;

        const statusPayload = {
            name: data.name,
            email: data.email,
            statusText: data.active ? 'Active' : 'Inactive',
            statusColor: data.active ? '#28a745' : '#d9534f',
            isActive: data.active,
            loginUrl: `${env.BLACK_MONOLITH_PUBLIC_URL}login`,
            adminName: user.name,
            blackMonolithEmail: blackMonolithEmail
        };
        const subject = data.active
            ? `Black Monolith — Your Account Is Now Active`
            : `Black Monolith — Your Account Access Has Been Disabled`;

        await sendEmail({ to: data.email, subject: subject, htmlTemplate: data.active ? userStatusActive : userStatusInactive, templateData: statusPayload })

        return NextResponse.json(resUser || { message: "User Record update successfully" }, { status: 200 });
    } catch (error: any) {
        console.error("Error:", error);
        return NextResponse.json({ error: error.message || error }, { status: 500 });
    }
}
