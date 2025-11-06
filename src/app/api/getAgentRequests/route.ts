import { APIRequest } from '@/components/api/apirequest';
import { authOptions } from '@/lib/auth';
import { stripe } from '@/lib/stripe';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const agentRequestId = searchParams.get('agentRequestId');
    const userTableId = searchParams.get('userTableId');
    const page = Number(searchParams.get('page')) || 1;
    const limit = Number(searchParams.get('limit')) || 10;

    const session = await getServerSession(authOptions);
    const user: any = session?.user;

    let allUserData: any[] = [];
    let userPage = 1;
    let hasMoreUsers = true;

    while (hasMoreUsers) {
      const res = await APIRequest(
        "GET",
        `tables/${userTableId}/records?where=(role,eq,Agent)&limit=100&page=${userPage}&nested[Agent][fields]=company_VAT,agent_country,Id,agent_name,company_name,location,phone_number,pseudo_name,identity_proof`
      );

      allUserData.push(...(res?.list || []));
      const pageInfo = res?.pageInfo;
      if (!pageInfo || pageInfo.isLastPage) {
        hasMoreUsers = false;
      } else {
        userPage++;
      }
    }

    const agentRequestData = await APIRequest(
      "GET",
      `tables/${agentRequestId}/records?where=(Company,eq,${user?.id})&limit=${limit}&page=${page}`
    );

    const filteredRequests = agentRequestData.list

    // ✅ Merge Agent info and check Stripe payout status
    const mergedResult = await Promise.all(
      filteredRequests.map(async (data: any) => {
        const userId = data?.Agent;
        const userInfo = allUserData.find((u: any) => u?.Id == userId);
        const stripeAccountId = userInfo?.stripeAccountId;

        let payoutsEnabled = null;
        let stripeStatus = null;

        if (stripeAccountId) {
          try {
            const account = await stripe.accounts.retrieve(stripeAccountId);
            payoutsEnabled = account.payouts_enabled;
            stripeStatus = account.requirements?.disabled_reason || 'active';
          } catch (err) {
            console.error(`Stripe fetch failed for ${stripeAccountId}:`, err);
          }
        }

        return {
          Id: data?.Id,
          message: data?.message,
          Agent_Status: data?.Agent_Status,
          payment: data?.Payment,
          Schedule: data?.Schedule,
          Service: data?._nc_m2m_AgentRequests_Services?.[0]?.Services_id,
          userName: userInfo?.Agent?.pseudo_name,
          stripeAccountId,
          payoutsEnabled,
          stripeStatus,
        };
      })
    );


    return NextResponse.json({
      list: mergedResult,
      pageInfo: agentRequestData?.pageInfo,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}
