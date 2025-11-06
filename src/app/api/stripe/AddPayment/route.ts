

import { APIRequest } from '@/components/api/apirequest';
import { NextRequest, NextResponse } from 'next/server';
import { env } from 'process';

export async function POST(request: NextRequest) {
    try {
        const form = await request.formData();
        const data = JSON.parse(form.get("data") as string);
        const agentRequestTableId = form.get("agentRequestTableId");
        const paymentTableId = form.get("paymentTableId");

        const paymentData = {
            paymentStatus: "Success",
            PaymentId: data?.PaymentId,
            amount: data?.amount,
            payment_method_types: data?.payment_method_types,
        };
        const payment = await APIRequest('POST', `tables/${paymentTableId}/records`, paymentData);

        if (!payment?.Id) {
            return NextResponse.json({ error: "Failed to create Payment" }, { status: 500 });
        }

        const payload = [{
            Id: payment?.Id,
        }];
        const resAgent = await APIRequest('POST', `tables/${agentRequestTableId}/links/${env.Payment_link_Table_ID}/records/${data?.Id}`, payload);


        return NextResponse.json(resAgent || { message: "Payment was successful." }, { status: 200 });
    } catch (error: any) {
        console.error("Error:", error);
        return NextResponse.json({ error: error.message || error }, { status: 500 });
    }
}