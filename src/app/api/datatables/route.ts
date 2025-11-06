import { APIRequest } from '@/components/api/apirequest';
import { NextRequest, NextResponse } from 'next/server';
import { env } from 'process';

export async function GET(request: NextRequest) {
    try {
        const res = await APIRequest('GET',`meta/bases/${env.Nocodb_BasId}/tables`);
        return NextResponse.json(res.list || { error: 'dataTables found' }, { status: res ? 200 : 404 });
    } catch (error) {
        return NextResponse.json({ error}, { status: 500 });
    }
}
