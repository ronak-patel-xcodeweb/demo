import { APIRequest } from '@/components/api/apirequest';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const inquiryTableId = searchParams.get('inquiryTableId');
        const userTableId = searchParams.get('userTableId');
        const page = Number(searchParams.get('page')) || 1;
        const limit = Number(searchParams.get('limit')) || 10;

        const session = await getServerSession(authOptions);
        const user: any = session?.user;

        const condition = user.role === 'Admin' ? '' : `&where=(UserId,eq,${user?.id})`;

        let userData: any[] = [];

        if (user.role === 'Admin') {
            let userPage = 1;
            let hasMoreUsers = true;

            while (hasMoreUsers) {
                const res = await APIRequest(
                    'GET',
                    `tables/${userTableId}/records?where=(role,eq,GovernmentBody)&limit=100&page=${userPage}`
                );
                userData.push(...(res?.list || []));
                const pageInfo = res?.pageInfo;
                if (!pageInfo || pageInfo.isLastPage) {
                    hasMoreUsers = false;
                } else {
                    userPage++;
                }
            }
        }

        const userDataMap = new Map<number, any>();
        userData.forEach((u: any) => {
            userDataMap.set(u.Id, u);
        });

        const res = await APIRequest(
            'GET',
            `tables/${inquiryTableId}/records?limit=${limit}&page=${page}${condition}`
        );

        if (user.role == "Admin") {
            const mergedList = (res.list || []).map((record: any) => {
                const userInfo = userDataMap.get(record.UserId);
                return {
                    ...record,
                    name: userInfo?.name || '',
                    email: userInfo?.email || '',
                };
            });
            return NextResponse.json({
                list: mergedList,
                pageInfo: res?.pageInfo,
            });
        }

        return NextResponse.json({
            list: res.list,
            pageInfo: res?.pageInfo,
        });
    } catch (err) {
        return NextResponse.json(
            { error: err instanceof Error ? err.message : String(err) },
            { status: 500 }
        );
    }
}
