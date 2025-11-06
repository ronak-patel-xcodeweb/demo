import { stripe } from '@/lib/stripe';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';


export async function POST(req: Request) {
    try {
        const form = await req.formData();
        const data = JSON.parse(form.get("data") as string);

        const amount = data?.amount;

        if (!amount || amount <= 0) {
            return NextResponse.json(
                { error: 'Invalid amount' },
                { status: 400 }
            );
        }

        const account = await stripe.accounts.retrieve(data?.stripeAccountId);
        if (!account.capabilities?.transfers || account.capabilities.transfers !== 'active') {
            return NextResponse.json(
                { error: 'The connected account is not yet ready to receive transfers. Please complete account setup.' },
                { status: 400 }
            );
        }
        const session = await stripe.checkout.sessions.create({
            mode: 'payment',
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: 'Payment',
                        },
                        unit_amount: Math.round(amount * 100),
                    },
                    quantity: 1,
                },
            ],
            metadata: {
                paymentForUserId: data?.Id,
                paymentTableId: data?.paymentTableId,
                agentRequestTableId: data?.agentRequestTableId
            },
            payment_intent_data: {
                application_fee_amount: Math.round(amount * 100 * 0.33),
                transfer_data: {
                    destination: data?.stripeAccountId,
                },
            },
            success_url: `${process.env.BLACK_MONOLITH_PUBLIC_URL}/agent-requests?status=success`,
            cancel_url: `${process.env.BLACK_MONOLITH_PUBLIC_URL}/agent-requests?status=cancel`,
        });

        return NextResponse.json({ url: session.url });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}