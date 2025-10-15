import { APIRequest } from '@/components/api/apirequest';
import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(request: NextRequest) {
    try {
        const form = await request.formData();
        const data = JSON.parse(form.get("data") as string);
        const userTableId = form.get("userTableId");

        const resUser = await APIRequest('PATCH', `tables/${userTableId}/records`, data);

        return NextResponse.json(resUser || { message: "User Record update successfully" }, { status: 200 });
    } catch (error: any) {
        console.error("Error:", error);
        return NextResponse.json({ error: error.message || error }, { status: 500 });
    }
}
