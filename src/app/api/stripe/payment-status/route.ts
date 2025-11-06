import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get('session_id');

    if (!sessionId) {
        return NextResponse.json({ error: 'Missing session_id' }, { status: 400 });
    }

    try {
        const session = await stripe.checkout.sessions.retrieve(sessionId, {
            expand: ['payment_intent'],
        });

        return NextResponse.json(session);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
