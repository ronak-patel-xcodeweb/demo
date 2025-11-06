import { APIRequest } from '@/components/api/apirequest';
import { sendEmail } from '@/components/sendEmail/sendEmail';
import { forgotPasswordTemplate } from '@/components/templates/templates';
import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { env } from 'process';


export async function POST(request: NextRequest) {
    try {
        const form = await request.formData();
        const data = JSON.parse(form.get("data") as string);
        const userTableId = form.get("userTableId");
        const userRes = await APIRequest(
            "GET",
            `tables/${userTableId}/records?where=(isDeleted,neq,1)~and(email,eq,${data.email})`
        );

        const user = userRes?.list?.[0];

        if (!user) {
            return NextResponse.json({ error: "Email Not Exit!" }, { status: 500 });
        }

        const token = crypto.randomBytes(32).toString('hex');
        const expires = new Date(Date.now() + 1000 * 60 * 15);

        const payload =
        {
            Id: userRes?.list?.[0].Id,
            resetToken: token,
            resetTokenExpiry: expires.toISOString()
        }

        const userUpdateResetToken = await APIRequest(
            "PATCH",
            `tables/${userTableId}/records`, payload);

        const resetUrl = `${env.BLACK_MONOLITH_PUBLIC_URL}forgot-password?token=${token}`;
        const blackMonolithEmail = env.Black_MONOLITH_SUPPORT_EMAIL;
        await sendEmail({
            to: data?.email,
            subject: 'Reset your Black Monolith password',
            templateData: { resetUrl, name: user?.name, blackMonolithEmail },
            htmlTemplate: forgotPasswordTemplate,
        });
        return NextResponse.json(userUpdateResetToken || { message: "User Record update successfully" }, { status: 200 });

    } catch (error: any) {
        console.error("Error:", error);
        return NextResponse.json({ error: error.message || error }, { status: 500 });
    }
}
