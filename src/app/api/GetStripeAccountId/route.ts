import { APIRequest } from '@/components/api/apirequest';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const session = await getServerSession(authOptions);
        const userTableId = searchParams.get('userTableId');
        const user: any = session?.user;
        const res = await APIRequest(
            "GET",
            `tables/${userTableId}/records?where=(isDeleted,neq,1)~and(Id,eq,${user.id})`
        );
        return NextResponse.json(res.list || { error: 'Data found' }, { status: res ? 200 : 404 });
    } catch (error) {
        return NextResponse.json({ error }, { status: 500 });
    }
}
