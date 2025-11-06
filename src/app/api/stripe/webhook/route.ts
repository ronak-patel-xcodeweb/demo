import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

async function buffer(readable: ReadableStream<Uint8Array>) {
    const chunks = [];
    const reader = readable.getReader();
    let result;
    while (!(result = await reader.read()).done) {
        chunks.push(result.value);
    }
    return Buffer.concat(chunks);
}

export async function POST(req: Request) {
    const sig = req.headers.get("stripe-signature") as string;
    let event: Stripe.Event;

    try {
        const buf = await buffer(req.body as any);
        event = stripe.webhooks.constructEvent(
            buf,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
    } catch (err: any) {
        console.error("❌ Webhook signature verification failed:", err.message);
        return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
    }

    try {
        switch (event.type) {
            case "checkout.session.completed": {
                const session = event.data.object as Stripe.Checkout.Session;
                console.log("✅ Checkout complete:", session.id);

                // Prepare the payload
                const paymentData = {
                    Id: session.metadata?.paymentForUserId,
                    PaymentId: session.id,
                    amount: session.amount_total! / 100,
                    payment_method_types: session.payment_method_types[0],
                };

                // Option 1: Send as JSON (Recommended - cleaner approach)
                const response = await fetch(
                    `${process.env.BLACK_MONOLITH_PUBLIC_URL}/api/stripe/AddPayment`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            data: paymentData,
                            agentRequestTableId: session.metadata?.agentRequestTableId || "",
                            paymentTableId: session.metadata?.paymentTableId || "",
                        }),
                    }
                );

                // Handle the response
                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    console.error("❌ AddPayment API failed:", {
                        status: response.status,
                        error: errorData
                    });
                    
                    return NextResponse.json({
                        received: true,
                        paymentProcessed: false,
                        error: errorData.error || "Failed to process payment",
                        sessionId: session.id
                    }, { status: 200 });
                }

                const paymentResult = await response.json();
                console.log("✅ Payment processed successfully:", paymentResult);

                return NextResponse.json({
                    received: true,
                    paymentProcessed: true,
                    result: paymentResult,
                    sessionId: session.id
                });
            }

            case "payment_intent.payment_failed": {
                const intent = event.data.object as Stripe.PaymentIntent;
                console.error("❌ Payment failed:", intent.id);
                
                return NextResponse.json({
                    received: true,
                    paymentFailed: true,
                    intentId: intent.id
                });
            }

            default:
                console.log(`Unhandled event type: ${event.type}`);
                return NextResponse.json({ 
                    received: true,
                    eventType: event.type,
                    handled: false
                });
        }
    } catch (error: any) {
        console.error("❌ Webhook processing error:", error);
        
        return NextResponse.json({ 
            received: true,
            error: error.message,
            processed: false
        }, { status: 200 });
    }
}