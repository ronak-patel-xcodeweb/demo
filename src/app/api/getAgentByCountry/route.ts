import { APIRequest } from '@/components/api/apirequest';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const userTableId = searchParams.get('userTableId');
        const agentRequestId = searchParams.get('agentRequestId');
        const condition = searchParams.get('condition') ? searchParams.get('condition') : "";

        const session = await getServerSession(authOptions);
        const user: any = session?.user

        let agentRequestData: any[] = [];
        let userPage = 1;
        let hasMoreUsers = true;

        while (hasMoreUsers) {
            const res = await APIRequest(
                "GET",
                `tables/${agentRequestId}/records?where=(Company,eq,${user?.id})&limit=100&page=${userPage}`
            );
            agentRequestData.push(...(res?.list || []));
            const pageInfo = res?.pageInfo;
            if (!pageInfo || pageInfo.isLastPage) {
                hasMoreUsers = false;
            } else {
                userPage++;
            }
        }

        const agentRequestList = agentRequestData;
        const agentRequestMap = new Map<number, any>();
        agentRequestList.forEach((req: any) => {
            if (req.Agent) {
                agentRequestMap.set(req.Agent, req._nc_m2m_AgentRequests_Services[0].Services_id || null);
            }
        });

        const users = await APIRequest(
            "GET",
            `tables/${userTableId}/records?where=(isDeleted,neq,1)~and${condition}&nested[Agent][fields]=company_VAT,agent_country,Id,agent_name,company_name,location,phone_number,pseudo_name,identity_proof&nested[Company][fields]=companyName,companyWebsite,taxRegistrationNo,address,contactPersonEmail,contactPersonName,contactPersonPhone,VAT_No,businessType&nested[Admin][fields]=firstName,lastName`
        );
        const countryWiseData: Record<string, any[]> = {};

        users?.list?.forEach((user: any) => {
            const country = user.Agent?.agent_country || 'Unknown';

            if (!countryWiseData[country]) {
                countryWiseData[country] = [];
            }

            const serviceName = agentRequestMap.get(user.Id) || null;

            countryWiseData[country].push({
                Id: user?.Id,
                name: user?.Agent?.pseudo_name,
                requested: agentRequestMap.has(user.Id),
                serviceName
            });
        });


        const result = Object.keys(countryWiseData).map(country => ({
            country,
            agentsData: countryWiseData[country]
        }));


        return NextResponse.json(result, { status: 200 });
    } catch (err) {
        return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 });
    }
}
