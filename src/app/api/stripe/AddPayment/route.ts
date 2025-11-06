import { APIRequest } from '@/components/api/apirequest';
import { sendEmail } from '@/components/sendEmail/sendEmail';
import { CompanyPaymentSuccessTemplate, CompanyServicePaymentSuccessTemplate } from '@/components/templates/templates';
import { NextRequest, NextResponse } from 'next/server';
import { env } from 'process';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { data, agentRequestTableId, paymentTableId, userTableId } = body;

        if (!data || !agentRequestTableId || !paymentTableId || !userTableId) {
            return NextResponse.json({
                // Parse JSON body
                error: "Missing required fields: data, agentRequestTableId, userTableId, or paymentTableId"
            }, { status: 400 });
        }

        const paymentData = {
            paymentStatus: "Success",
            PaymentId: data?.PaymentId,
            amount: data?.amount,
            payment_method_types: data?.payment_method_types,
        };

        const payment = await APIRequest('POST', `tables/${paymentTableId}/records`, paymentData);

        if (!payment?.Id) {
            console.error("Failed to create payment record");
            return NextResponse.json({
                error: "Failed to create Payment record"
            }, { status: 500 });
        }


        const payload = [{
            Id: payment.Id,
        }];

        const resAgent = await APIRequest(
            'POST',
            `tables/${agentRequestTableId}/links/${env.Payment_link_Table_ID}/records/${data?.Id}`,
            payload
        );


        const agentRequestsData = await APIRequest(
            "GET",
            `tables/${agentRequestTableId}/records?where=(Id,eq,${data?.Id})`
        );
        const agentRequestData = agentRequestsData.list[0];
        const agentUserRes = await APIRequest(
            "GET",
            `tables/${userTableId}/records?where=(isDeleted,neq,1)~and(Id,eq,${agentRequestData?.Agent})&nested[Agent][fields]=company_VAT,agent_country,Id,agent_name,company_name,location,phone_number,pseudo_name,identity_proof`
        );

        const companyUserRes = await APIRequest(
            "GET",
            `tables/${userTableId}/records?where=(isDeleted,neq,1)~and(Id,eq,${agentRequestData?.Company})&nested[Company][fields]=companyName,companyWebsite,taxRegistrationNo,address,contactPersonEmail,contactPersonName,contactPersonPhone,VAT_No,businessType`
        );
        const companyData = companyUserRes.list[0];
        const agentData = agentUserRes.list[0];

        if (agentData) {
            var template = CompanyServicePaymentSuccessTemplate;
            const subject = `${companyData?.Company?.companyName} has successfully completed payment for ${data?.serviceName}`;
            const blackMonolithEmail = env.Black_MONOLITH_SUPPORT_EMAIL;
            const dashboardUrl = `${env.BLACK_MONOLITH_PUBLIC_URL}service-requests`;
            const payload = {
                agentName: agentData?.name,
                amountPaid: data?.amount,
                paymentDate: new Date()
                    .toLocaleString('en-CA', { hour12: false })
                    .replace(',', ''),
                serviceName: data?.serviceName,
                companyName: companyData?.Company?.companyName,
                companyEmail: companyData?.Company?.contactPersonEmail,
                companyWebsite: companyData?.Company?.companyWebsite,
                companyAddress: companyData?.Company?.address,
                contactPersonName: companyData?.Company?.contactPersonName,
                contactPersonPhone: companyData?.Company?.contactPersonPhone,
                businessType: companyData?.Company?.businessType,
                blackMonolithEmail: blackMonolithEmail,
                dashboardUrl: dashboardUrl
            }
            await sendEmail({ to: agentUserRes.list[0].email, subject: subject, htmlTemplate: template, templateData: payload })
        }

        if (companyData) {
            var template = CompanyPaymentSuccessTemplate;
            const subject = `Payment Successful – ${data?.serviceName}`;
            const blackMonolithEmail = env.Black_MONOLITH_SUPPORT_EMAIL;
            const dashboardUrl = `${env.BLACK_MONOLITH_PUBLIC_URL}agent-requests`;
            const payload = {
                agentName: agentData?.Agent?.pseudo_name,
                amountPaid: data?.amount,
                paymentDate: new Date()
                    .toLocaleString('en-CA', { hour12: false })
                    .replace(',', ''),
                serviceName: data?.serviceName,
                companyName: companyData?.Company?.companyName,
                companyEmail: companyData?.Company?.contactPersonEmail,
                companyWebsite: companyData?.Company?.companyWebsite,
                companyAddress: companyData?.Company?.address,
                contactPersonName: companyData?.Company?.contactPersonName,
                contactPersonPhone: companyData?.Company?.contactPersonPhone,
                businessType: companyData?.Company?.businessType,
                blackMonolithEmail: blackMonolithEmail,
                dashboardUrl: dashboardUrl
            }
            await sendEmail({ to: companyUserRes.list[0].email, subject: subject, htmlTemplate: template, templateData: payload })
        }

        return NextResponse.json(
            resAgent || {
                message: "Payment was successful.",
                paymentId: payment.Id
            },
            { status: 200 }
        );
    } catch (error: any) {
        console.error("AddPayment Error:", error);
        return NextResponse.json({
            error: error.message || "Internal server error"
        }, { status: 500 });
    }
}