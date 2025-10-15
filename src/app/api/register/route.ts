import { APIRequest } from '@/components/api/apirequest';
import bcrypt from 'bcryptjs';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const form = await request.formData();
        const data = JSON.parse(form.get("data") as string);
        const companytableId = form.get("companytableId");
        const userTableId = form.get("userTableId");
        const agentTableId = form.get("agentTableId");
        const agentFile = form.get("agentFile") as File | null;

        const res = await APIRequest(
            "GET",
            `tables/${userTableId}/records?where=(isDeleted,neq,1)`
        );

        const emailExists = res.list.some((user: any) => user.email === data.email);

        if (emailExists) {
            return NextResponse.json({ error: "User Email Already Registered !" }, { status: 500 });
        }

        const password = await bcrypt.hashSync(data.password);
        let userData: any = {};

        if (data?.user_type === "Company") {
            const companyData = {
                companyName: data.company_name,
                companyWebsite: data.company_website,
                taxRegistrationNo: data.company_tax_no,
                address: data.company_address,
                contactPersonEmail: data.email,
                contactPersonName: data.company_contactName,
                contactPersonPhone: data.company_contactnumber,
                VAT_No: data.company_VAT,
                businessType: data.company_business_type,
            };
            const resCompany = await APIRequest('POST', `tables/${companytableId}/records`, companyData);
            userData = {
                name: data.company_contactName,
                email: data.email,
                password,
                role: data?.user_type,
                active: 1,
                Company: resCompany?.Id,
                phoneNumber: data?.company_contactnumber,
                isDeleted: 0
            };
        }

        if (data?.user_type === "Agent") {
            let fileUploadResponse = null;
            if (agentFile) {
                const uploadForm = new FormData();
                uploadForm.append("files", agentFile);
                fileUploadResponse = await APIRequest('POST', `storage/upload`, uploadForm, true);
            }

            const agentData = {
                agent_name: `${data.agent_first_Name} ${data.agent_last_Name}`,
                phone_number: data?.agent_phone_number,
                location: data.agent_location,
                company_name: data.agent_company_name,
                company_VAT: data.agent_company_VAT,
                agent_country: data.agent_country,
                agent_status: "Pending",
                identity_proof: fileUploadResponse || null,
            };

            const resAgent = await APIRequest('POST', `tables/${agentTableId}/records`, agentData);
            userData = {
                name: `${data.agent_first_Name} ${data.agent_last_Name}`,
                First_Name: data.agent_first_Name,
                Last_Name: data.agent_last_Name,
                email: data.email,
                role: data?.user_type,
                active: 1,
                Agent: resAgent?.Id,
                agent_status: "Pending",
                phoneNumber: data?.agent_phone_number,
                isDeleted: 0
            };
        }

        const resUser = await APIRequest('POST', `tables/${userTableId}/records`, userData);

        return NextResponse.json(res || { message: "Record created successfully" }, { status: 200 });
    } catch (error: any) {
        console.error("Error in register API:", error);
        return NextResponse.json({ error: error.message || error }, { status: 500 });
    }
}
