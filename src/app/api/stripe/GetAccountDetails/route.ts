import { stripe } from '@/lib/stripe';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const stripeAccountId: any = searchParams.get('stripeAccountId');


        const account = await stripe.accounts.retrieve(stripeAccountId);
        if (!account) {
            return NextResponse.json(
                { error: 'No Found Account Details' },
                { status: 400 }
            );
        }
        let accountLink;
        if (!account.payouts_enabled) {
            accountLink = await stripe.accountLinks.create({
                account: stripeAccountId,
                refresh_url: `${process.env.BLACK_MONOLITH_PUBLIC_URL}/stripe-account`,
                return_url: `${process.env.BLACK_MONOLITH_PUBLIC_URL}/stripe-account?connection=success&accountId=${stripeAccountId}`,
                type: "account_onboarding",
            });
        }
        const payload = {
            accountLink: accountLink,
            account: account
        }
        return NextResponse.json(payload || { error: 'Data found' }, { status: account ? 200 : 404 });
    } catch (error) {
        return NextResponse.json({ error }, { status: 500 });
    }
}
