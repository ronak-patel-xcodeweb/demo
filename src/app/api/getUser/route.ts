import { APIRequest } from '@/components/api/apirequest';
import { NextRequest, NextResponse } from 'next/server';
import { env } from 'process';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const userTableId = searchParams.get('userTableId');
        const condition = searchParams.get('condition') ? searchParams.get('condition') : "";
        const limit = searchParams.get('limit');
        const offset = searchParams.get('offset');
        const res = await APIRequest(
            "GET",
            `tables/${userTableId}/records?where=(isDeleted,neq,1)~and${condition}&limit=${limit}&offset=${offset}&nested[Agent][fields]=company_VAT,agent_country,Id,agent_name,company_name,location,phone_number,pseudo_name,identity_proof&nested[Company][fields]=companyName,companyWebsite,taxRegistrationNo,address,contactPersonEmail,contactPersonName,contactPersonPhone,VAT_No,businessType&nested[Admin][fields]=firstName,lastName`
        );
        return NextResponse.json(res || { error: 'User dataTables found' }, { status: res ? 200 : 404 });
    } catch (error) {
        return NextResponse.json({ error }, { status: 500 });
    }
}
