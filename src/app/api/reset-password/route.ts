import { APIRequest } from '@/components/api/apirequest';
import bcrypt from 'bcryptjs';
import { NextRequest, NextResponse } from 'next/server';


export async function POST(request: NextRequest) {
    try {
        const form = await request.formData();
        const data = JSON.parse(form.get("data") as string);
        const userTableId = form.get("userTableId");
        const userRes = await APIRequest(
            "GET",
            `tables/${userTableId}/records?where=(isDeleted,neq,1)~and(resetToken,eq,${data.token})`
        );

        const user = userRes?.list?.[0];

        // if (!user || new Date(user.resetTokenExpiry) < new Date()) {
        //     return NextResponse.json({ error: "Invalid or expired token" }, { status: 500 });
        // }

        if (!user) {
            return NextResponse.json(
                { error: "Unauthorized: Invalid token." },
                { status: 401 }
            );
        }


        const existingHashedPassword = user.password;

        const isSamePassword = await bcrypt.compare(data.password, existingHashedPassword);

        if (isSamePassword) {
            return NextResponse.json(
                { error: "You cannot reuse your previous password." },
                { status: 400 }
            );
        }


        const hashedPassword = await bcrypt.hashSync(data.password);

        const payload =
        {
            Id: userRes?.list?.[0].Id,
            password: hashedPassword,
            isFirstLogin: 0
        }

        const userUpdateResetToken = await APIRequest(
            "PATCH",
            `tables/${userTableId}/records`, payload);

        return NextResponse.json(userUpdateResetToken || { message: "User Record update successfully" }, { status: 200 });

    } catch (error: any) {
        console.error("Error:", error);
        return NextResponse.json({ error: error.message || error }, { status: 500 });
    }
}
