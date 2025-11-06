import { APIRequest } from '@/components/api/apirequest';
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { sendEmail } from '@/components/sendEmail/sendEmail';
import { AddUserTemplate } from '@/components/templates/templates';
import bcrypt from "bcryptjs";
import { env } from 'process';

export async function POST(request: NextRequest) {
    try {
        const form = await request.formData();
        const data = JSON.parse(form.get("data") as string);
        const userTableId = form.get("userTableId");
        const res = await APIRequest(
            "GET",
            `tables/${userTableId}/records?where=(isDeleted,neq,1)~and(email,eq,${data.email})`
        );

        if (res.list.length > 0) {
            return NextResponse.json({ error: "User Email Already Registered !" }, { status: 500 });
        }

        const token = crypto.randomBytes(32).toString('hex');

        const password = await bcrypt.hashSync(`${data.First_Name}@${new Date().getFullYear()}`);

        const payload =
        {
            ...data,
            password: password,
            resetToken: token,
            isFirstLogin: 1
        }
        const resUser = await APIRequest('POST', `tables/${userTableId}/records`, payload);
        const loginUrl = `${env.BLACK_MONOLITH_PUBLIC_URL}login`;
        const blackMonolithEmail = env.Black_MONOLITH_SUPPORT_EMAIL;

        const emailPayload = {
            name: data?.name,
            password: `${data.First_Name}@${new Date().getFullYear()}`,
            email: data?.email,
            role: data?.role,
            loginUrl,
            blackMonolithEmail:blackMonolithEmail

        }
        await sendEmail({
            to: data?.email,
            subject: 'Welcome to Black Monolith — Your Admin Account Is Ready',
            templateData: emailPayload,
            htmlTemplate: AddUserTemplate,
        });

        return NextResponse.json(resUser || { message: data?.Id ? "User has been successfully updated." : "User has been successfully added." }, { status: 200 });
    } catch (error: any) {
        console.error("Error:", error);
        return NextResponse.json({ error: error.message || error }, { status: 500 });
    }
}
