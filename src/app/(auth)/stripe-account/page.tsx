'use client'


import { DataTableContext } from "@/components/context/DataTableContext";
import SpinnerComponent from "@/components/spinner/spinner";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { zodResolver } from "@hookform/resolvers/zod";
import { Info } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { toast } from "sonner";
import z from "zod";
import { useForm } from "react-hook-form";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import countryData from "@/components/country.json";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

const requestFormSchema = z.object({
    email: z.string().min(1, "Request Title is required"),
    country: z.string().min(1, "Description is required"),
});

type requestForm = z.infer<typeof requestFormSchema>;

export default function StripeAccount() {

    const { dataTables } = useContext(DataTableContext);
    const [isLoadingAdd, setIsLoadingAdd] = useState(false);
    const [accountDetails, setAccountDetails] = useState<any>();
    const [accountLink, setAccountLink] = useState<any>();
    const [stripeAccountID, setStipeAccountID] = useState<any>();
    const [addConnectionShow, setAddConnectionShow] = useState<boolean>(false);
    const router = useRouter();
    const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);
    const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);

    const form = useForm<requestForm>({
        resolver: zodResolver(requestFormSchema),
        defaultValues: {
            email: "",
            country: ""

        },
    });


    const fetchUser = async () => {
        const userTableId = dataTables.find((t: any) => t?.table_name === "User")?.id;
        if (!userTableId) return;

        try {
            const res = await fetch(
                `/api/GetStripeAccountId?userTableId=${userTableId}`
            );
            const userData = await res.json();
            if (userData[0].stripeAccountId) {
                setStipeAccountID(userData[0].stripeAccountId);
            } else {
                setAddConnectionShow(true)
            }
            setIsLoadingAdd(false);

        } catch (error) {
            setIsLoadingAdd(false);
            console.error('Error fetching users:', error);
            toast.error("Failed to fetch users");
        } finally {
        }
    };
    useEffect(() => {
        const userTableId = dataTables.find((t: any) => t?.table_name === "User")?.id;
        if (userTableId) {
            setIsLoadingAdd(true);
            fetchUser();
        }
    }, [dataTables]);

    useEffect(() => {
        const fetchAccountDetails = async () => {
            if (!stripeAccountID) return;
            try {
                const res = await fetch(
                    `/api/stripe/GetAccountDetails?stripeAccountId=${stripeAccountID}`
                );
                if (res.ok) {
                    const data = await res.json();
                    setAccountDetails(data?.account)
                    setAccountLink(data?.accountLink?.url)
                }
                setIsLoadingAdd(false);
            } catch (error) {
                console.error("Error fetching account details:", error);
            }

        };
        setIsLoadingAdd(true);
        fetchAccountDetails();
    }, [stripeAccountID]);


    const onSubmit = async (data: requestForm) => {
        const userTableId = dataTables.find(
            (t: any) => t?.table_name === "User"
        )?.id;
        const updatedData = {
            ...data,
            country: data.country.slice(0, -1),
        };
        const formData = new FormData();
        formData.append("data", JSON.stringify(updatedData));
        formData.append("userTableId", userTableId);

        const response = await fetch("/api/stripe/createConnectedAccount", {
            method: "POST",
            body: formData,
        });

        const stripeData = await response.json();
        if (stripeData?.url) {
            form.reset();
            router.push(stripeData.url)
        }
    };
    useEffect(() => {

        if (typeof window !== "undefined") {
            const urlParams = new URLSearchParams(window.location.search);
            const status = urlParams.get('connection');
            const accountId = urlParams.get('accountId');
            if (accountId) {
                if (status === 'success') {
                    setIsSuccessDialogOpen(true);
                }
            }
            if (status === 'cancel') {
                setIsCancelDialogOpen(true);
            }
        }

    }, []);
    return (
        <>
            <div className="flex flex-col md:flex-row gap-6 w-1/2">
                {accountDetails && (
                    <div className="flex-1 bg-[#121212] rounded-2xl border p-6 shadow-md">
                        <div className="md:flex justify-between items-center mb-2">
                            <h1 className="text-xl font-bold">Connected Account Details</h1>

                            {!accountDetails.payouts_enabled && (<div className="flex ">

                                <Button onClick={() => {
                                    router.push(accountLink)
                                }} className="w-36 cursor-pointer">
                                    Finish Setup
                                </Button>
                            </div>)}
                        </div>
                        <Separator className="mb-3"></Separator>
                        <div className="space-y-3 text-sm text-gray-300">
                            <div className="flex justify-between">
                                <span>Email:</span>
                                <span className="text-white">{accountDetails.email}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Business Name:</span>
                                <span className="text-white">{accountDetails.business_profile?.name || "-"}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Representative:</span>
                                <span className="text-white">
                                    {accountDetails.individual?.first_name}{" "}
                                    {accountDetails.individual?.last_name}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span>Country:</span>
                                <span className="text-white">{accountDetails.country}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Website:</span>
                                <a
                                    href={accountDetails.business_profile?.url}
                                    target="_blank"
                                    className="hover:underline"
                                >
                                    {accountDetails.business_profile?.url || "-"}
                                </a>
                            </div>
                            <div className="flex justify-between">
                                <span>Bank:</span>
                                <span className="text-white">
                                    {accountDetails.external_accounts?.data?.[0]?.bank_name} {accountDetails.external_accounts?.data?.[0]?.bank_name ? '••••' : '-'}
                                    {accountDetails.external_accounts?.data?.[0]?.last4}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span>Status:</span>
                                <span
                                    className={`font-medium ${accountDetails.external_accounts?.data?.[0]?.status == "verified" ? "text-green-500" : "text-red-500"
                                        }`}
                                >
                                    {accountDetails.external_accounts?.data?.[0]?.status}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span>Charges Enabled:</span>
                                <span
                                    className="font-medium"
                                >
                                    {accountDetails.charges_enabled ? "Yes" : "No"}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span>Payouts Enabled:</span>
                                <span
                                >
                                    {accountDetails.payouts_enabled ? "Yes" : "No"}
                                </span>
                            </div>
                        </div>

                    </div>
                )}
                {!accountDetails && addConnectionShow && (
                    <div className="flex-1 bg-[#121212] rounded-2xl border p-6 shadow-md order-2 lg:order-1">
                        <div className="mb-6 border-b pb-3">
                            <h1 className="text-xl font-semibold">Add Account Details</h1>
                        </div>

                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field, fieldState }) => (
                                        <FormItem>
                                            <div className="flex items-center justify-between">
                                                <FormLabel className="text-sm font-medium !text-white">
                                                    Enter Email
                                                </FormLabel>
                                                {fieldState.error && (
                                                    <TooltipProvider>
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <Info className="h-4 w-4 text-red-400 cursor-pointer" />
                                                            </TooltipTrigger>
                                                            <TooltipContent>
                                                                <p className="text-xs text-red-500">
                                                                    {fieldState.error.message}
                                                                </p>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </TooltipProvider>
                                                )}
                                            </div>
                                            <FormControl>
                                                <Input
                                                    placeholder="Enter Email"
                                                    type="email"
                                                    {...field}
                                                    className="h-11 rounded-xl bg-[#1c1c1c] border px-4 text-white placeholder-gray-500 focus:ring-1 focus:ring-gray-500"
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="country"
                                    render={({ field, fieldState }) => (
                                        <FormItem>
                                            <div className="flex items-center justify-between">
                                                <FormLabel className="text-sm !text-white">
                                                    Country
                                                </FormLabel>
                                                {fieldState.error && (
                                                    <TooltipProvider>
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <Info className="h-4 w-4 text-red-400 cursor-pointer" />
                                                            </TooltipTrigger>
                                                            <TooltipContent side="top">
                                                                <p className="text-xs text-red-500">
                                                                    This field is required.
                                                                </p>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </TooltipProvider>
                                                )}
                                            </div>
                                            <FormControl>
                                                <Select
                                                    onValueChange={field.onChange}
                                                    value={field.value || ""}
                                                >
                                                    <SelectTrigger className="lg:w-[17rem] w-[100%] !h-12 rounded-xl">
                                                        <SelectValue placeholder="Select Country" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectGroup>
                                                            {countryData?.map((data: any) => (
                                                                <SelectItem key={data.name} value={data.id}>
                                                                    {data.name}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectGroup>
                                                    </SelectContent>
                                                </Select>
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />

                                <div className="flex justify-end">
                                    <Button
                                        type="submit"
                                        className="h-11 px-6 rounded-xl cursor-pointer transition-all duration-200"
                                    >
                                        Add Account
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    </div>
                )}

                <Dialog open={isSuccessDialogOpen} onOpenChange={(data) => {
                    setIsSuccessDialogOpen(data)
                    if (!data) {
                        router.push("/stripe-account");
                    }
                }}>
                    <DialogContent className="sm:max-w-md text-white border rounded-2xl p-6 text-center">
                        <DialogHeader>
                            <DialogTitle className="text-lg font-bold">Account Created 🎉</DialogTitle>
                        </DialogHeader>
                        <p className="mt-3 text-sm text-green-500">
                            Your Stripe Connected Account was created successfully!
                        </p>
                        <Button
                            className="mt-4 bg-white text-black cursor-pointer"
                            onClick={() => {
                                setIsSuccessDialogOpen(false);
                                router.push("/agent-requests");
                            }}
                        >
                            Continue
                        </Button>
                    </DialogContent>
                </Dialog>
                <Dialog open={isCancelDialogOpen} onOpenChange={(data) => {
                    setIsCancelDialogOpen(data)
                    if (!data) {
                        router.push("/stripe-account");
                    }
                }}>
                    <DialogContent className="sm:max-w-md text-white border rounded-2xl p-6 text-center">
                        <DialogHeader>
                            <DialogTitle className="text-lg font-bold">Account Creation Failed ❌</DialogTitle>
                        </DialogHeader>
                        <p className="mt-3 text-sm text-red-500">
                            Something went wrong while creating your Stripe account. Please try again later.
                        </p>
                        <Button
                            className="mt-4 bg-white text-black"
                            onClick={() => {
                                setIsCancelDialogOpen(false);
                                router.push("/stripe-account");
                            }}
                        >
                            Go Back
                        </Button>
                    </DialogContent>
                </Dialog>
                {isLoadingAdd && (
                    <SpinnerComponent />
                )}
            </div >
        </>
    );
}