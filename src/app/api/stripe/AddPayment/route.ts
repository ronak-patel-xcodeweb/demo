import { APIRequest } from '@/components/api/apirequest';
import { NextRequest, NextResponse } from 'next/server';
import { env } from 'process';

export async function POST(request: NextRequest) {
    try {
        // Parse JSON body
        const body = await request.json();
        const { data, agentRequestTableId, paymentTableId } = body;

        // Validate required fields
        if (!data || !agentRequestTableId || !paymentTableId) {
            return NextResponse.json({ 
                error: "Missing required fields: data, agentRequestTableId, or paymentTableId" 
            }, { status: 400 });
        }

        // Create payment record
        const paymentData = {
            paymentStatus: "Success",
            PaymentId: data?.PaymentId,
            amount: data?.amount,
            payment_method_types: data?.payment_method_types,
        };

        console.log("Creating payment record:", paymentData);
        const payment = await APIRequest('POST', `tables/${paymentTableId}/records`, paymentData);

        if (!payment?.Id) {
            console.error("Failed to create payment record");
            return NextResponse.json({ 
                error: "Failed to create Payment record" 
            }, { status: 500 });
        }

        console.log("Payment record created:", payment.Id);

        // Link payment to agent request
        const payload = [{
            Id: payment.Id,
        }];

        console.log("Linking payment to agent request:", {
            agentRequestId: data?.Id,
            paymentId: payment.Id
        });

        const resAgent = await APIRequest(
            'POST', 
            `tables/${agentRequestTableId}/links/${env.Payment_link_Table_ID}/records/${data?.Id}`, 
            payload
        );

        console.log("Payment linked successfully");

        return NextResponse.json(
            resAgent || { 
                message: "Payment was successful.",
                paymentId: payment.Id 
            }, 
            { status: 200 }
        );
    } catch (error: any) {
        console.error("AddPayment Error:", error);
        return NextResponse.json({ 
            error: error.message || "Internal server error" 
        }, { status: 500 });
    }
}