import { APIRequest } from '@/components/api/apirequest';
import bcrypt from 'bcryptjs';
import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '@/components/sendEmail/sendEmail';
import { agentRegisterTemplate, CompanyRegistrationTemplate, GovernmentBodyRegisterTemplate } from '@/components/templates/templates';
import crypto from 'crypto';
import { env } from 'process';

export async function POST(request: NextRequest) {
    try {
        const form = await request.formData();
        const data = JSON.parse(form.get("data") as string);
        const companytableId = form.get("companytableId");
        const userTableId = form.get("userTableId");
        const agentTableId = form.get("agentTableId");
        const GovernmentBodyId = form.get("GovernmentBodyId");
        const agentFile = form.get("agentFile") as File | null;
        const governmentProof = form.get("governmentProof") as File | null;


        const existingUser = await APIRequest(
            "GET",
            `tables/${userTableId}/records?where=(isDeleted,neq,1)~and(email,eq,${data.email})`
        );

        if (existingUser.list.length > 0) {
            return NextResponse.json({ error: "User Email Already Registered !" }, { status: 500 });
        }

        const hashedPassword = await bcrypt.hashSync(data.password);
        let userData: any = {};

        // Company
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
            const token = crypto.randomBytes(32).toString('hex');

            userData = {
                name: data.company_contactName,
                email: data.email,
                password: hashedPassword,
                role: data?.user_type,
                active: 1,
                Company: resCompany?.Id,
                phoneNumber: data?.company_contactnumber,
                isDeleted: 0,
                resetToken: token,
                isFirstLogin: 1
            };
        }

        // Agent
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


        // GovermentBody
        if (data?.user_type === "GovernmentBody") {
            let fileUploadResponse = null;
            if (governmentProof) {
                const uploadForm = new FormData();
                uploadForm.append("files", governmentProof);
                fileUploadResponse = await APIRequest('POST', `storage/upload`, uploadForm, true);
            }

            const governmentBodyData = {
                department_name: data?.department_name,
                official_address: data?.official_address,
                officer_name: data?.officer_name,
                officer_designation: data?.officer_designation,
                officer_phoneNumber: data?.officer_phoneNumber,
                government_proof: fileUploadResponse || null,
            };

            const governmentBody = await APIRequest('POST', `tables/${GovernmentBodyId}/records`, governmentBodyData);

            userData = {
                name: data.government_body_name,
                email: data.email,
                role: data?.user_type,
                active: 1,
                GovernmentBody: governmentBody?.Id,
                agent_status: "Pending",
                phoneNumber: data?.officer_phoneNumber,
                isDeleted: 0
            };
        }

        const resUser = await APIRequest('POST', `tables/${userTableId}/records`, userData);

        if (data?.user_type === "Company") {
            const loginUrl = `${env.BLACK_MONOLITH_PUBLIC_URL}login`;
            const blackMonolithEmail = env.Black_MONOLITH_SUPPORT_EMAIL;

            const companyTemplatePayload = {
                companyName: data.company_name,
                contactPersonName: data.company_contactName,
                email: userData.email,
                role: data?.user_type,
                password: data.password,
                loginUrl,
                blackMonolithEmail: blackMonolithEmail
            };

            await sendEmail({
                to: userData.email,
                subject: 'Welcome to Black Monolith — Your Company Account Is Ready',
                htmlTemplate: CompanyRegistrationTemplate,
                templateData: companyTemplatePayload,
            });
        }

        if (data?.user_type === "Agent") {
            const res = await APIRequest(
                "GET",
                `tables/${userTableId}/records?where=(isDeleted,neq,1)~and(role,eq,SuperAdmin)`
            );

            const superAdmins = res.list || [];
            const superAdminEmails = superAdmins.map((admin: any) => admin.email).filter(Boolean);
            const loginUrl = `${env.BLACK_MONOLITH_PUBLIC_URL}registration-management`;
            if (superAdminEmails.length > 0) {
                const subject = `New Agent Registration – Action Required`;

                const blackMonolithEmail = env.Black_MONOLITH_SUPPORT_EMAIL;


                const payload = {
                    name: userData.name,
                    email: userData.email,
                    phoneNumber: userData.phoneNumber,
                    country: data.agent_country,
                    blackMonolithEmail: blackMonolithEmail,
                    loginUrl
                }
                await sendEmail({
                    to: superAdminEmails,
                    subject,
                    htmlTemplate: agentRegisterTemplate,
                    templateData: payload,
                });
            }
        }

        if (data?.user_type === "GovernmentBody") {


            const res = await APIRequest(
                "GET",
                `tables/${userTableId}/records?where=(isDeleted,neq,1)~and(role,eq,SuperAdmin)`
            );

            const superAdmins = res.list || [];
            const superAdminEmails = superAdmins.map((admin: any) => admin.email).filter(Boolean);

            if (superAdminEmails.length > 0) {
                const subject = `New Government Body Registration – Action Required`;

                const blackMonolithEmail = env.Black_MONOLITH_SUPPORT_EMAIL;
                const loginUrl = `${env.BLACK_MONOLITH_PUBLIC_URL}registration-management`;

                const payload = {
                    name: userData.name,
                    email: userData.email,
                    phoneNumber: userData.phoneNumber,
                    blackMonolithEmail: blackMonolithEmail,
                    loginUrl
                }
                await sendEmail({
                    to: superAdminEmails,
                    subject,
                    agentRegisterTemplate,
                    htmlTemplate: GovernmentBodyRegisterTemplate,
                    templateData: payload,
                });
            }
        }

        return NextResponse.json(resUser || { message: "Record created successfully" }, { status: 200 });

    } catch (error: any) {
        console.error("Error in register API:", error);
        return NextResponse.json({ error: error.message || error }, { status: 500 });
    }
}
