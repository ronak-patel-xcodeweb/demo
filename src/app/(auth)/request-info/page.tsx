'use client'

import { DataTableContext } from "@/components/context/DataTableContext";
import SpinnerComponent from "@/components/spinner/spinner";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { zodResolver } from "@hookform/resolvers/zod";
import { Info, Landmark, Search } from "lucide-react";
import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

const requestFormSchema = z.object({
  requestTitle: z.string().min(1, "Request Title is required"),
  description: z.string().min(1, "Description is required"),
  purpose: z.string().min(1, "Purpose is required"),
});

type requestForm = z.infer<typeof requestFormSchema>;

export default function RequestService() {
  const { dataTables } = useContext(DataTableContext);
  const [isLoadingAdd, setIsLoadingAdd] = useState(false);
  const [serviceExample] = useState([
    { serviceName: "Deal Architecture" },
    { serviceName: "Technology Scouting" },
  ]);

  const form = useForm<requestForm>({
    resolver: zodResolver(requestFormSchema),
    defaultValues: {
      requestTitle: "",
      purpose: "",
      description: "",
    },
  });

  const onSubmit = async (data: requestForm) => {
    setIsLoadingAdd(true);
    const GovernmentBodyInquiryTableId = dataTables.find(
      (t: any) => t?.table_name === "GovernmentBodyInquiry"
    )?.id;
    const userTableId = dataTables.find(
      (t: any) => t?.table_name === "User"
    )?.id;

    const formData = new FormData();
    formData.append("data", JSON.stringify(data));
    formData.append("GovernmentBodyInquiryTableId", GovernmentBodyInquiryTableId);
    formData.append("userTableId", userTableId);

    const response = await fetch("/api/AddInquiry", {
      method: "POST",
      body: formData,
    });

    if (response?.ok) {
      toast.success("Request submitted successfully", { style: { background: "green" } });
      form.reset();
    }
    setIsLoadingAdd(false);
  };

  return (
    <div className="flex flex-col md:flex-row gap-6">
      <div className="flex-1 bg-[#121212] rounded-2xl border  p-6 shadow-md order-2 lg:order-1">
        <div className="mb-6 border-b  pb-3">
          <h1 className="text-xl font-semibold">Request Additional Information</h1>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="requestTitle"
              render={({ field, fieldState }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel className="text-sm font-medium !text-white">Request Title</FormLabel>
                    {fieldState.error && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-4 w-4 text-red-400 cursor-pointer" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="text-xs text-red-500">{fieldState.error.message}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </div>
                  <FormControl>
                    <Input
                      placeholder="Enter request title"
                      {...field}
                      className="h-11 rounded-xl bg-[#1c1c1c] border  px-4 text-white placeholder-gray-500 focus:ring-1 focus:ring-gray-500"
                    />
                  </FormControl>

                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="purpose"
              render={({ field, fieldState }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel className="text-sm font-medium !text-white">Purpose</FormLabel>
                    {fieldState.error && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-4 w-4 text-red-400 cursor-pointer" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="text-xs text-red-500">{fieldState.error.message}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </div>
                  <FormControl>
                    <Input
                      placeholder="Enter purpose"
                      {...field}
                      className="h-11 rounded-xl bg-[#1c1c1c] border  px-4 text-white placeholder-gray-500 focus:ring-1 focus:ring-gray-500"
                    />
                  </FormControl>

                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field, fieldState }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel className="text-sm font-medium !text-white">Description</FormLabel>
                    {fieldState.error && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-4 w-4 text-red-400 cursor-pointer" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="text-xs text-red-500">{fieldState.error.message}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </div>
                  <FormControl>
                    <Textarea
                      placeholder="Describe the information you require"
                      {...field}
                      className="min-h-[100px] rounded-xl bg-[#1c1c1c] border  px-4 py-3 text-white placeholder-gray-500 focus:ring-1 focus:ring-gray-500"
                    />
                  </FormControl>

                </FormItem>
              )}
            />
            <div className="flex justify-end">
              <Button
                type="submit"
                className="h-11 px-6 rounded-xl cursor-pointer transition-all duration-200"
              >
                Submit Request
              </Button>
            </div>
          </form>
        </Form>
      </div>
      <div className="w-full lg:w-1/3 mt-10 md:mt-0 bg-[#121212] rounded-2xl border  p-6 shadow-md order-1 lg:order-2">
        <div className="mb-6 border-b  pb-3">
          <h2 className="text-xl font-semibold">Special Requirement Examples</h2>
        </div>
        <div className="grid gap-5">
          {serviceExample.map((data, index) => {
            return (
              <div
                key={index}
                className="flex items-center gap-3 bg-[#1c1c1c] border  hover:border-gray-800 transition-all duration-200 rounded-xl p-4 cursor-pointer"
              >
                <h3 className="text-lg font-medium">{data.serviceName}</h3>
              </div>
            );
          })}
        </div>
      </div>

      {isLoadingAdd && (
        <div className="absolute inset-0 flex items-center justify-center  z-50">
          <SpinnerComponent />
        </div>
      )}
    </div>
  );
}
