'use client'

import { useContext, useEffect, useState } from "react";
import { Button } from "../ui/button";
import { ServicesContext } from "../context/DataTableContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormProvider, useForm } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "../ui/textarea";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { Info } from "lucide-react";


interface AllAgentServicesProps {
    onRequest: (requestForm: requestForm) => void;
}


const requestDataForm = z.object({
    message: z.string()
        .min(1, "This field is required."),
    meetingType: z.string().optional(),
    serviceId: z.any().optional(),
    serviceName: z.any().optional()
});
type requestForm = z.infer<typeof requestDataForm>;

export default function AllAgentServices({ onRequest }: AllAgentServicesProps) {

    const { allServices, setAllServices } = useContext(ServicesContext);
    const [service, setService] = useState<any>();
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const form = useForm<requestForm>({
        resolver: zodResolver(requestDataForm),
        defaultValues: {
            message: "",
            meetingType: "Physical",
            serviceId: "",
            serviceName: ""
        },
    });

    const onSubmit = (data: requestForm) => {
        const payload: requestForm = {
            ...data,
            serviceId: service.Id,
            serviceName: service.ServiceName
        }
        setIsOpen(false);
        setService(null);
        onRequest(payload);
    }
    return (
        <div>
            <div>
                <div className="grid gap-8 justify-center grid-cols-[repeat(auto-fit,minmax(250px,1fr))]">
                    {allServices.map((service: any, index: any) => (
                        <div
                            key={index}
                            className="relative transform p-7 text-center rounded-xl bg-[#333333] shadow-xl transition duration-300 hover:scale-105"
                        >
                            <div className="absolute top-3 right-4 text-white text-sm px-3 py-1 bottom-3">
                                {service.Remote_Price == null && (
                                    <span> ${service.Price}</span>
                                )}

                                {service.Remote_Price && (
                                    <div >
                                        <span>Physical- ${service.Price}</span>
                                        <span> Remote- ${service.Remote_Price}</span>
                                    </div>
                                )}
                            </div>

                            <h2 className="text-xl font-semibold text-white mb-1 mt-3">{service.ServiceName}</h2>
                            <p className="text-gray-200 text-sm mb-4">{service.ServiceDescription}</p>
                            <div>
                                <Button
                                    className="w-36 cursor-pointer"
                                    type="button"
                                    onClick={() => {
                                        setService(service);
                                        setIsOpen(true);
                                    }}
                                >
                                    Request
                                </Button>
                            </div>
                        </div>
                    ))}

                </div>
            </div>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Request for {service?.ServiceName}</DialogTitle>
                    </DialogHeader>

                    <FormProvider {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="message"
                                render={({ field, fieldState }) => (
                                    <FormItem>
                                        <div className="flex items-center justify-between">
                                            <FormLabel className="text-sm !text-white">Message</FormLabel>
                                            {fieldState.error && (
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Info className="h-4 w-4 text-red-400 cursor-pointer" />
                                                        </TooltipTrigger>
                                                        <TooltipContent side="top">
                                                            <p className="text-xs text-red-500">{fieldState.error.message}</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            )}
                                        </div>
                                        <FormControl>
                                            <Textarea placeholder="Enter Message" {...field} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <div className="flex justify-end">
                                {service?.ServiceName === "Meeting – Remote/Physical" ? (
                                    <div className="flex items-center justify-between w-full">
                                        <FormField
                                            control={form.control}
                                            name="meetingType"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <div className="flex items-center space-x-4">
                                                            <span>Physical</span>
                                                            <Switch
                                                                checked={field.value === "Remote"}
                                                                onCheckedChange={(checked) =>
                                                                    field.onChange(checked ? "Remote" : "Physical")
                                                                }
                                                                className="cursor-pointer"
                                                            />
                                                            <span>Remote</span>
                                                        </div>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <Button type="submit" className="cursor-pointer">
                                            Send
                                        </Button>
                                    </div>
                                ) : (
                                    <Button type="submit" className="cursor-pointer">
                                        Send
                                    </Button>
                                )}
                            </div>
                        </form>
                    </FormProvider>

                </DialogContent>
            </Dialog>
        </div>
    );
}
