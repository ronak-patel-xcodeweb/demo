import { APIRequest } from '@/components/api/apirequest';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const agentRequestId = searchParams.get('agentRequestId');
    const userTableId = searchParams.get('userTableId');
    const page = Number(searchParams.get('page')) || 1;
    const limit = Number(searchParams.get('limit')) || 10;
    const condition = searchParams.get('condition') ? `~and${searchParams.get('condition')}` : "";

    const session = await getServerSession(authOptions);
    const user: any = session?.user;

    let allUserData: any[] = [];
    let userPage = 1;
    let hasMoreUsers = true;

    while (hasMoreUsers) {
      const res = await APIRequest(
        "GET",
        `tables/${userTableId}/records?where=(role,eq,Company)&limit=100&page=${userPage}&nested[Agent][fields]=company_VAT,agent_country,Id,agent_name,company_name,location,phone_number,pseudo_name,identity_proof`
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
      `tables/${agentRequestId}/records?where=(Agent,eq,${user?.id})${condition}&limit=${limit}&page=${page}&nested[Schedule][fields]=Id,meetingType,Scheduled`
    );
    const Agent_Status = [
      { status: "Pending", count: 0 },
      { status: "Accepted", count: 0 },
      { status: "Rejected", count: 0 },
    ];

    for (const item of Agent_Status) {
      const res = await APIRequest(
        "GET",
        `tables/${agentRequestId}/records/count?where=(Agent,eq,${user?.id})~and(Agent_Status,eq,${item.status})`
      );
      item.count = res?.count || 0;
    }
    const totalCount = Agent_Status.reduce((sum, item) => sum + item.count, 0);

    Agent_Status.unshift({ status: "Total", count: totalCount });
    const filteredRequests =
      agentRequestData.list;

    const mergedResult = filteredRequests.map((data: any) => {
      const userId = data?.Company;
      const userInfo = allUserData.find((u: any) => u?.Id == userId);

      return {
        Id: data?.Id,
        message: data?.message,
        Agent_Status: data?.Agent_Status,
        payment: data?.Payment,
        Schedule: data?.Schedule,
        Service: data?._nc_m2m_AgentRequests_Services?.[0]?.Services_id,
        userName: userInfo?.name,
        companyId: userInfo?.Id,
        meetingType: data?.meetingType
      };
    });

    return NextResponse.json({
      list: mergedResult,
      pageInfo: agentRequestData?.pageInfo,
      statusCount: Agent_Status
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}
