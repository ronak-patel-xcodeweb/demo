import { APIRequest } from '@/components/api/apirequest';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const tableId = searchParams.get('tableId');
        const condition = searchParams.get('condition') ? searchParams.get('condition') : '';

        const res = await APIRequest(
            "GET",
            `tables/${tableId}/records?where=${condition}`
        );
        return NextResponse.json(res.list || { error: 'Data found' }, { status: res ? 200 : 404 });
    } catch (error) {
        return NextResponse.json({ error }, { status: 500 });
    }
}
