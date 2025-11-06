import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { APIRequest } from "@/components/api/apirequest";

export async function POST(req: Request) {
    try {
        const form = await req.formData();
        const data = JSON.parse(form.get("data") as string);
        const session = await getServerSession(authOptions);
        const user: any = session?.user;
        const userTableId = form.get("userTableId") as string | null;


        if (!data?.email) {
            return NextResponse.json(
                { error: "Email is required to create a connected account." },
                { status: 400 }
            );
        }

        const account = await stripe.accounts.create({
            type: "express",
            country: data?.country,
            email: data?.email,
            capabilities: {
                transfers: { requested: true },
                card_payments: { requested: true }
            },
            metadata: {
                userId: user?.id || "",
                userTableId: userTableId
            }
        });

        const accountLink = await stripe.accountLinks.create({
            account: account.id,
            refresh_url: `${process.env.BLACK_MONOLITH_PUBLIC_URL}/stripe-account?connection=refresh`,
            return_url: `${process.env.BLACK_MONOLITH_PUBLIC_URL}/stripe-account?connection=success&accountId=${account.id}`,
            type: "account_onboarding",
        });
        const payload = {
            Id: user?.id,
            stripeAccountId: account?.id
        }
        const resUser = await APIRequest('PATCH', `tables/${account.metadata?.userTableId}/records`, payload);

        return NextResponse.json({
            url: accountLink.url,
            accountId: account.id,
        });
    } catch (error: any) {
        console.error("❌ Error creating connected account:", error);
        return NextResponse.json(
            { error: error.message || "Failed to create connected account" },
            { status: 500 }
        );
    }
}