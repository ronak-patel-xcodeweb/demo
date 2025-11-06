"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { string, z } from "zod";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { redirect, useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { DataTableContext } from "../context/DataTableContext";
import countryData from "@/components/country.json";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Textarea } from "../ui/textarea";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { Info } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogOverlay, DialogTitle } from "../ui/dialog";
import { Separator } from "../ui/separator";
import SpinnerComponent from "../spinner/spinner";
import PhoneInput from 'react-phone-number-input'
import 'react-phone-number-input/style.css'

const FormSchema = z
  .object({
    // common fields
    user_type: z.string(),
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().optional(),
    confirmPassword: z.string().optional(),

    // company fields
    company_name: z.string().optional(),
    company_contactName: z.string().optional(),
    company_contactnumber: z.string().optional(),
    company_tax_no: z.string().optional(),
    company_VAT: z.string().optional(),
    company_address: z.string().optional(),
    company_website: z.string().optional(),
    company_business_type: z.string().optional(),

    // agent fields
    agent_first_Name: z.string().optional(),
    agent_last_Name: z.string().optional(),
    agent_phone_number: z.string().optional(),
    agent_company_VAT: z.string().optional(),
    agent_location: z.string().optional(),
    agent_country: z.string().optional(),
    agent_company_name: z.string().optional(),
    agent_identy_proof: z.any().optional(),


    //Government Body
    government_body_name: z.string().optional(),
    department_name: z.string().optional(),
    official_address: z.string().optional(),
    officer_name: z.string().optional(),
    officer_designation: z.string().optional(),
    officer_phoneNumber: z.string().optional(),
    government_proof: z.any().optional(),

  })
  .superRefine((data, ctx) => {
    // Company-specific validation
    if (data.user_type === "Company") {
      // Check password match

      // Check required company fields
      const requiredFields = [
        "company_name",
        "company_contactName",
        "company_VAT",
        "company_address",
        "company_website",
        "company_business_type",
        "company_contactnumber",
      ];

      requiredFields.forEach((field) => {
        if (!data[field as keyof typeof data] || data[field as keyof typeof data] === "") {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `${field.replace(/_/g, " ")} is required`,
            path: [field],
          });
        }
      });
    }

    // Agent-specific validation
    if (data.user_type === "Agent") {
      const requiredFields = [
        "agent_first_Name",
        "agent_last_Name",
        "agent_location",
        "agent_identy_proof",
        "agent_phone_number",
        "agent_country"
      ];

      requiredFields.forEach((field) => {
        if (!data[field as keyof typeof data] || data[field as keyof typeof data] === "") {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `${field.replace(/_/g, " ")} is required`,
            path: [field],
          });
        }
      });
    }

    // GovermentBody-specific validation
    if (data.user_type === "GovernmentBody") {

      const requiredFields = [
        "government_body_name",
        "department_name",
        "official_address",
        "officer_name",
        "officer_phoneNumber",
        "government_proof",
        "officer_designation"
      ];
      requiredFields.forEach((field) => {
        if (!data[field as keyof typeof data] || data[field as keyof typeof data] === "") {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `${field.replace(/_/g, " ")} is required`,
            path: [field],
          });
        }
      });
    }
  });

const roleList = [{
  roleName: 'Company',
  roleValue: 'Company'
}, {
  roleName: 'Agent',
  roleValue: 'Agent'
}, {
  roleName: 'Government Body',
  roleValue: 'GovernmentBody'
}]

export function RegisterForm() {
  const { dataTables, setDataTables } = useContext(DataTableContext);
  const [isViewOpen, setIsViewOpen] = useState<boolean>(false);
  const [viewData, setViewData] = useState<any>(null);
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false);
  const [value, setValue] = useState()


  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      user_type: 'Company',
      //company fileds
      company_name: "",
      company_website: "",
      company_tax_no: "",
      company_contactName: "",
      company_business_type: "",
      company_VAT: "",
      company_address: "",

      //agent fileds
      agent_country: "",
      agent_first_Name: "",
      agent_last_Name: "",
      agent_company_VAT: "",
      agent_location: "",
      agent_company_name: "",


      // Government Body fileds
      government_body_name: "",
      department_name: "",
      official_address: "",
      officer_name: "",
      officer_designation: "",
      officer_phoneNumber: "",
      government_proof: "",

      //common fileds
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search);
      const role = searchParams.get('role');
      if (role) {
        form.setValue('user_type', role);
      }
    }
  }, [form]);


  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    try {
      setIsLoading(true)
      const companyTablId = dataTables.find((t: any) => t?.table_name === "Company");
      const userTableId = dataTables.find((t: any) => t?.table_name === "User");
      const agentId = dataTables.find((t: any) => t?.table_name === "Agent");
      const GovernmentBodyId = dataTables.find((t: any) => t?.table_name === "GovernmentBody");

      const payload = data.user_type == "Company" ? {
        ...data,
        password: `${data?.company_contactName}@${new Date().getFullYear()}`
      } : {
        ...data,
      }
      const formData = new FormData();
      formData.append("data", JSON.stringify(payload));
      formData.append("companytableId", companyTablId?.id);
      formData.append("userTableId", userTableId?.id);
      formData.append("agentTableId", agentId?.id);
      formData.append("GovernmentBodyId", GovernmentBodyId?.id);

      if (data.agent_identy_proof) {
        formData.append("agentFile", data.agent_identy_proof);
      }
      if (data.government_proof) {
        formData.append("governmentProof", data.government_proof);
      }

      const response = await fetch("/api/register", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) throw new Error(result.error || "Failed to register");
      setViewData({
        type: data.user_type,
        email: data.email
      })
      setIsViewOpen(true)
      // toast("You’ve successfully registered your account.");
    } catch (error: any) {
      toast(error?.message || "Something went wrong!");
    }
    setIsLoading(false)
  };

  const selectedUserType = form.watch("user_type");

  const backLogin = () => {
    router.push('/login')
  }
  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex justify-center">
            {/* <FormField
              control={form.control}
              name="user_type"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex gap-2 bg-black/40 border border-white/10 rounded-xl p-1 whitespace-nowrap"
                    >
                      {roleList.map((role) => (
                        <label
                          key={role.roleValue}
                          className={`
                  flex-1 px-4 py-2 rounded-lg text-sm text-center cursor-pointer select-none
                  border border-transparent transition-all
                  ${field.value === role.roleValue
                              ? "bg-white text-black border-white/10"
                              : "text-white/80 hover:bg-white/10"
                            }
                `}
                          onClick={() => field.onChange(role.roleValue)}
                        >
                          {role.roleName}
                        </label>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            /> */}
          </div>

          {/* company fileds */}

          {selectedUserType == "Company" && (<>
            <div className="md:flex gap-5">
              <FormField
                control={form.control}
                name="company_name"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel className="text-sm !text-white">Company Name</FormLabel>
                      {fieldState.error && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="h-4 w-4 text-red-400 cursor-pointer" />
                            </TooltipTrigger>
                            <TooltipContent side="top">
                              <p className="text-xs text-red-500">This field is required.</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </div>
                    <FormControl>
                      <Input id="company_name" type="text" placeholder="Company Name" autoComplete="company_name" {...field} className="lg:w-[17rem]  h-12 rounded-xl bg-input border border-line px-4 py-3 text-white placeholder-gray-400 outline-none focus:border-gray-500"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <div className="mt-5 md:mt-0">
                <FormField
                  control={form.control}
                  name="company_business_type"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel className="text-sm !text-white">Business Type</FormLabel>
                        {fieldState.error && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Info className="h-4 w-4 text-red-400 cursor-pointer" />
                              </TooltipTrigger>
                              <TooltipContent side="top">
                                <p className="text-xs text-red-500">This field is required.</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      </div>
                      <FormControl>
                        <Input id="company_business_type" type="text" placeholder="Business Type" autoComplete="company_business_type" {...field} className="lg:w-[17rem]  h-12 rounded-xl bg-input border border-line px-4 py-3 text-white placeholder-gray-400 outline-none focus:border-gray-500"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="md:flex gap-5">
              <FormField
                control={form.control}
                name="company_address"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel className="text-sm !text-white">Address</FormLabel>
                      {fieldState.error && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="h-4 w-4 text-red-400 cursor-pointer" />
                            </TooltipTrigger>
                            <TooltipContent side="top">
                              <p className="text-xs text-red-500">This field is required.</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </div>
                    <FormControl>
                      <Textarea id="company_address" placeholder="Address" autoComplete="company_address" {...field} className="min-h-[3rem] lg:min-w-[36vw] md:w-[36vw] rounded-xl bg-input border border-line px-4 py-3 text-white placeholder-gray-400 outline-none focus:border-gray-500"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <div className="md:flex gap-5">

              <FormField
                control={form.control}
                name="company_website"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel className="text-sm !text-white">Website</FormLabel>
                      {fieldState.error && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="h-4 w-4 text-red-400 cursor-pointer" />
                            </TooltipTrigger>
                            <TooltipContent side="top">
                              <p className="text-xs text-red-500">This field is required.</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </div>
                    <FormControl>
                      <Input id="company_website" type="url" placeholder="Website" autoComplete="company_website" {...field} className="lg:w-[17rem]  h-12 rounded-xl bg-input border border-line px-4 py-3 text-white placeholder-gray-400 outline-none focus:border-gray-500"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <div className="mt-5 md:mt-0">
                <FormField
                  control={form.control}
                  name="company_VAT"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel className="text-sm !text-white">Tax Registration / VAT No</FormLabel>
                        {fieldState.error && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Info className="h-4 w-4 text-red-400 cursor-pointer" />
                              </TooltipTrigger>
                              <TooltipContent side="top">
                                <p className="text-xs text-red-500">This field is required.</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      </div>
                      <FormControl>
                        <Input id="company_VAT" type="text" placeholder="Tax Registration / VAT No." autoComplete="company_VAT" {...field} className="lg:w-[17rem]  h-12 rounded-xl bg-input border border-line px-4 py-3 text-white placeholder-gray-400 outline-none focus:border-gray-500"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="md:flex gap-5">



              <FormField
                control={form.control}
                name="company_contactName"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel className="text-sm !text-white">Contact Person Name</FormLabel>
                      {fieldState.error && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="h-4 w-4 text-red-400 cursor-pointer" />
                            </TooltipTrigger>
                            <TooltipContent side="top">
                              <p className="text-xs text-red-500">This field is required.</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </div>
                    <FormControl>
                      <Input id="company_contactName" type="text" placeholder="Person Name" autoComplete="company_contactName" {...field} className="lg:w-[17rem]  h-12 rounded-xl bg-input border border-line px-4 py-3 text-white placeholder-gray-400 outline-none focus:border-gray-500"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <div className="mt-5 md:mt-0">
                <FormField
                  control={form.control}
                  name="company_contactnumber"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel className="text-sm !text-white">Contact Person Phone</FormLabel>
                        {fieldState.error && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Info className="h-4 w-4 text-red-400 cursor-pointer" />
                              </TooltipTrigger>
                              <TooltipContent side="top">
                                <p className="text-xs text-red-500">This field is required.</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      </div>
                      <FormControl>
                        <PhoneInput
                          placeholder="Enter phone number"
                          value={field.value || ""}
                          onChange={field.onChange}
                          defaultCountry="AE"
                          international
                          countryCallingCodeEditable={false}
                          className=" bg-black lg:w-[17rem] h-12 rounded-xl bg-input border border-line px-4 py-3 text-white placeholder-gray-400 outline-none focus:border-gray-500"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </>)}


          {/* Agent fileds */}
          {selectedUserType == "Agent" && (<>
            <div className="md:flex gap-5">
              <div>
                <FormField
                  control={form.control}
                  name="agent_first_Name"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel className="text-sm !text-white">First Name</FormLabel>
                        {fieldState.error && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Info className="h-4 w-4 text-red-400 cursor-pointer" />
                              </TooltipTrigger>
                              <TooltipContent side="top">
                                <p className="text-xs text-red-500">This field is required.</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      </div>
                      <FormControl>
                        <Input id="agent first_Name" type="text" placeholder="First Name" autoComplete="agent_first_Name" {...field} className="lg:w-[17rem]  h-12 rounded-xl bg-input border border-line px-4 py-3 text-white placeholder-gray-400 outline-none focus:border-gray-500"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <div className="mt-5 md:mt-0">
                <FormField
                  control={form.control}
                  name="agent_last_Name"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel className="text-sm !text-white">Last Name</FormLabel>
                        {fieldState.error && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Info className="h-4 w-4 text-red-400 cursor-pointer" />
                              </TooltipTrigger>
                              <TooltipContent side="top">
                                <p className="text-xs text-red-500">This field is required.</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      </div>
                      <FormControl>
                        <Input id="agent_last_Name" type="text" placeholder="Last Name" autoComplete="last_Name" {...field} className="lg:w-[17rem]  h-12 rounded-xl bg-input border border-line px-4 py-3 text-white placeholder-gray-400 outline-none focus:border-gray-500"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="md:flex gap-5">

              <div>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      {selectedUserType == "Agent" && (
                        <div className="flex items-center justify-between">
                          <FormLabel className="text-sm !text-white">Email</FormLabel>
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
                      )}
                      <FormControl>
                        {selectedUserType === "Agent" ? (
                          <Input id="email" type="email" placeholder="Email" autoComplete="email" {...field}
                            className="lg:w-[17rem]  h-12 rounded-xl bg-input border border-line px-4 py-3 text-white placeholder-gray-400 outline-none focus:border-gray-500"
                          />
                        ) : null}
                      </FormControl>
                    </FormItem>
                  )}
                />            </div>
              <div className="mt-5 md:mt-0">
                <FormField
                  control={form.control}
                  name="agent_phone_number"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel className="text-sm !text-white">Phone number</FormLabel>
                        {fieldState.error && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Info className="h-4 w-4 text-red-400 cursor-pointer" />
                              </TooltipTrigger>
                              <TooltipContent side="top">
                                <p className="text-xs text-red-500">This field is required.</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      </div>
                      <FormControl>
                        <PhoneInput
                          placeholder="Enter phone number"
                          value={field.value || ""}
                          onChange={field.onChange}
                          defaultCountry="AE"
                          international
                          countryCallingCodeEditable={false}
                          className=" bg-black lg:w-[17rem] h-12 rounded-xl bg-input border border-line px-4 py-3 text-white placeholder-gray-400 outline-none focus:border-gray-500"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="md:flex gap-5">
              <div>
                <FormField
                  control={form.control}
                  name="agent_location"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel className="text-sm !text-white">Address</FormLabel>
                        {fieldState.error && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Info className="h-4 w-4 text-red-400 cursor-pointer" />
                              </TooltipTrigger>
                              <TooltipContent side="top">
                                <p className="text-xs text-red-500">This field is required.</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      </div>
                      <FormControl>
                        <Textarea id="agent_location" placeholder="Address" autoComplete="agent_location" {...field}
                          className="min-h-[3rem] lg:min-w-[37vw] md:w-[37vw] rounded-xl bg-input border border-line px-4 py-3 text-white placeholder-gray-400 outline-none focus:border-gray-500" />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="md:flex gap-5">
              <FormField
                control={form.control}
                name="agent_country"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel className="text-sm !text-white">Country</FormLabel>
                      {fieldState.error && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="h-4 w-4 text-red-400 cursor-pointer" />
                            </TooltipTrigger>
                            <TooltipContent side="top">
                              <p className="text-xs text-red-500">This field is required.</p>
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
                              <SelectItem key={data.name} value={data.name}>
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
              <div className="md:flex gap-5">

                <FormField
                  control={form.control}
                  name="agent_identy_proof"
                  render={({ field, fieldState }) => (
                    <FormItem className="w-[100%]  lg:w-68">
                      <div className="flex items-center justify-between">
                        <FormLabel className="text-sm !text-white">Identity Proof</FormLabel>
                        {fieldState.error && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Info className="h-4 w-4 text-red-400 cursor-pointer" />
                              </TooltipTrigger>
                              <TooltipContent side="top">
                                <p className="text-xs text-red-500">This field is required.</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      </div>
                      <FormControl>
                        <Input
                          className="lg:w-[17rem] w-[100%] h-12 rounded-xl cursor-pointer"
                          id="agent_identy_proof"
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file: any = e.target.files?.[0];
                            form.setValue("agent_identy_proof", file);
                          }}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="md:flex gap-5">
              <div>
                <FormField
                  control={form.control}
                  name="agent_company_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Name</FormLabel>
                      <FormControl>
                        <Input id="agent_company_name" type="text" placeholder="Company Name" autoComplete="agent_company_name" {...field}
                          className="lg:w-[17rem]  h-12 rounded-xl bg-input border border-line px-4 py-3 text-white placeholder-gray-400 outline-none focus:border-gray-500"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="mt-5 md:mt-0">
                <FormField
                  control={form.control}
                  name="agent_company_VAT"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company VAT No</FormLabel>
                      <FormControl>
                        <Input id="agent_company_VAT" type="text" placeholder="VAT of the Company" autoComplete="agent_company_VAT" {...field}
                          className="lg:w-[17rem]  h-12 rounded-xl bg-input border border-line px-4 py-3 text-white placeholder-gray-400 outline-none focus:border-gray-500"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>


          </>
          )}



          {selectedUserType == "GovernmentBody" && (<>
            <div className="md:flex gap-5">
              <div>
                <FormField
                  control={form.control}
                  name="government_body_name"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel className="text-sm !text-white">Government Body Name</FormLabel>
                        {fieldState.error && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Info className="h-4 w-4 text-red-400 cursor-pointer" />
                              </TooltipTrigger>
                              <TooltipContent side="top">
                                <p className="text-xs text-red-500">This field is required.</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      </div>
                      <FormControl>
                        <Input id="government_body_name" type="text" placeholder="Name" autoComplete="government_body_name" {...field} className="lg:w-[17rem]  h-12 rounded-xl bg-input border border-line px-4 py-3 text-white placeholder-gray-400 outline-none focus:border-gray-500"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <div className="mt-5 md:mt-0">
                <FormField
                  control={form.control}
                  name="department_name"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel className="text-sm !text-white">Department name</FormLabel>
                        {fieldState.error && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Info className="h-4 w-4 text-red-400 cursor-pointer" />
                              </TooltipTrigger>
                              <TooltipContent side="top">
                                <p className="text-xs text-red-500">This field is required.</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      </div>
                      <FormControl>
                        <Input id="department_name" type="text" placeholder="Department Name" autoComplete="department_name" {...field} className="lg:w-[17rem]  h-12 rounded-xl bg-input border border-line px-4 py-3 text-white placeholder-gray-400 outline-none focus:border-gray-500"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>


            <div className="md:flex gap-5">
              <div>
                <FormField
                  control={form.control}
                  name="official_address"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel className="text-sm !text-white">Official Address</FormLabel>
                        {fieldState.error && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Info className="h-4 w-4 text-red-400 cursor-pointer" />
                              </TooltipTrigger>
                              <TooltipContent side="top">
                                <p className="text-xs text-red-500">This field is required.</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      </div>
                      <FormControl>
                        <Textarea id="official_address" placeholder="Address" autoComplete="official_address" {...field}
                          className="min-h-[3rem] lg:min-w-[37vw] md:w-[37vw] rounded-xl bg-input border border-line px-4 py-3 text-white placeholder-gray-400 outline-none focus:border-gray-500" />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="md:flex gap-5">

              <div>
                <FormField
                  control={form.control}
                  name="officer_name"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel className="text-sm !text-white">Officer Name</FormLabel>
                        {fieldState.error && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Info className="h-4 w-4 text-red-400 cursor-pointer" />
                              </TooltipTrigger>
                              <TooltipContent side="top">
                                <p className="text-xs text-red-500">This field is required.</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      </div>
                      <FormControl>
                        <Input id="officer_name" type="text" placeholder="Officer Name" autoComplete="officer_name" {...field} className="lg:w-[17rem]  h-12 rounded-xl bg-input border border-line px-4 py-3 text-white placeholder-gray-400 outline-none focus:border-gray-500"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <div className="mt-5 md:mt-0">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      {selectedUserType == "GovernmentBody" && (
                        <div className="flex items-center justify-between">
                          <FormLabel className="text-sm !text-white">Officer Email</FormLabel>
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
                      )}
                      <FormControl>
                        {selectedUserType === "GovernmentBody" ? (
                          <Input id="email" type="email" placeholder="Officer Email" autoComplete="email" {...field}
                            className="lg:w-[17rem]  h-12 rounded-xl bg-input border border-line px-4 py-3 text-white placeholder-gray-400 outline-none focus:border-gray-500"
                          />
                        ) : null}
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="md:flex gap-5">
              <FormField
                control={form.control}
                name="officer_designation"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel className="text-sm !text-white">Officer Designation</FormLabel>
                      {fieldState.error && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="h-4 w-4 text-red-400 cursor-pointer" />
                            </TooltipTrigger>
                            <TooltipContent side="top">
                              <p className="text-xs text-red-500">This field is required.</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </div>
                    <FormControl>
                      <Input id="officer_designation" type="text" placeholder="Officer Designation" autoComplete="officer_designation" {...field} className="lg:w-[17rem]  h-12 rounded-xl bg-input border border-line px-4 py-3 text-white placeholder-gray-400 outline-none focus:border-gray-500"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <div className="md:flex gap-5">
                <FormField
                  control={form.control}
                  name="officer_phoneNumber"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel className="text-sm !text-white">Officer Contact Number</FormLabel>
                        {fieldState.error && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Info className="h-4 w-4 text-red-400 cursor-pointer" />
                              </TooltipTrigger>
                              <TooltipContent side="top">
                                <p className="text-xs text-red-500">This field is required.</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      </div>
                      <FormControl>
                        <PhoneInput
                          placeholder="Officer Contact Number"
                          value={field.value || ""}
                          onChange={field.onChange}
                          defaultCountry="AE"
                          international
                          countryCallingCodeEditable={false}
                          className=" bg-black lg:w-[17rem] h-12 rounded-xl bg-input border border-line px-4 py-3 text-white placeholder-gray-400 outline-none focus:border-gray-500"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="md:flex gap-5">
              <div>
                <FormField
                  control={form.control}
                  name="government_proof"
                  render={({ field, fieldState }) => (
                    <FormItem className="w-[100%]  lg:w-68">
                      <div className="flex items-center justify-between">
                        <FormLabel className="text-sm !text-white">Government ID Proof</FormLabel>
                        {fieldState.error && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Info className="h-4 w-4 text-red-400 cursor-pointer" />
                              </TooltipTrigger>
                              <TooltipContent side="top">
                                <p className="text-xs text-red-500">This field is required.</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      </div>
                      <FormControl>
                        <Input
                          className="lg:w-[17rem] w-[100%] h-12 rounded-xl cursor-pointer"
                          id="government_proof"
                          type="file"
                          accept="image/*,application/pdf"
                          onChange={(e) => {
                            const file: any = e.target.files?.[0];
                            form.setValue("government_proof", file);
                          }}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

            </div>


          </>
          )}

          {/* common fileds */}

          {selectedUserType == "Company" && (

            <div className="md:flex gap-5">

              <div className="mt-5 md:mt-0">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      {selectedUserType == "Company" && (
                        <div className="flex items-center justify-between ">
                          <FormLabel className="text-sm !text-white">Contact Person Email</FormLabel>
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
                        </div>)}
                      <FormControl>
                        {selectedUserType === "Company" ? (
                          <Input id="email" type="email" placeholder="Contact Person Email" autoComplete="email" {...field}
                            className="lg:w-[17rem]  h-12 rounded-xl bg-input border border-line px-4 py-3 text-white placeholder-gray-400 outline-none focus:border-gray-500"
                          />
                        ) : null}
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>
          )}





          <Button className="w-full cursor-pointer h-12 rounded-xl" type="submit">
            Register
          </Button>
        </form>
      </Form>
      <div>
        <Dialog open={isViewOpen} onOpenChange={(data) => {
          setIsViewOpen(data); if (!data) {
            backLogin()
          }
        }}>
          <DialogOverlay className="backdrop-blur-sm" />
          <DialogContent className="sm:max-w-1/3">
            {viewData?.type == "Company" && (
              <>
                <DialogHeader>
                  <DialogTitle className="text-xl font-semibold">Registration Successful
                  </DialogTitle>
                </DialogHeader>
                <Separator />

                <div>
                  <div className="rounded-xl bg-[#12151b] border border-white/5 px-4 py-3">
                    <p className="font-medium text-white">🎉 Congratulations! Your account has been created successfully.</p>
                    <p className="mt-2 text-sm text-gray-300">
                      We’ve sent a <span className="font-semibold">temporary password</span> to your email:
                      <br />
                      <span id="registered-email" className="font-medium text-white">{viewData?.email}</span>
                    </p>
                  </div>

                  <div className="mt-5 space-y-2 text-sm text-gray-300">
                    <p>• Check your inbox for an email from <span className="text-white font-medium">Black Monolith</span>.</p>
                    <p>• Follow the link or use your temporary password to set your new password.</p>
                  </div>

                  <div className="mt-6 flex items-center justify-end">
                    <div className="flex gap-2">
                      <Button onClick={backLogin}
                        className="cursor-pointer h-10 px-5 rounded-xl bg-white text-[#0f1115] text-sm font-semibold hover:bg-gray-100">
                        Go to Login
                      </Button>
                    </div>
                  </div>
                </div>
              </>
            )}

            {(viewData?.type == "Agent" || viewData?.type == "GovernmentBody") && (
              <>
                <DialogHeader>
                  <DialogTitle className="text-xl font-semibold">Application Submitted
                  </DialogTitle>
                </DialogHeader>
                <Separator />

                <div>
                  <div className="rounded-xl bg-[#12151b] border border-white/5 px-4 py-3">
                    <p className="font-medium text-white">{`Thanks! Your ${viewData?.type == "Agent" ? 'agent' : 'goverment'} registration has been received.`}</p>
                    <p className="mt-2 text-sm text-gray-300">
                      We’ve notified the <span className="font-semibold">Admin</span> to review your application.
                      You’ll get an email once it’s approved.
                    </p>
                  </div>

                  <div className="mt-5 grid grid-cols-1 gap-3 text-sm">
                    <div className="rounded-lg bg-[#141821] border border-white/10 px-4 py-3 text-gray-300">
                      ⏳ Typical review time: <span className="text-white font-medium">24–48 hours</span>.
                    </div>
                  </div>

                  <div className="mt-6 flex items-center justify-end">
                    <div className="flex gap-2">
                      <Button onClick={backLogin} className="cursor-pointer h-10 px-5 rounded-xl bg-white text-[#0f1115] text-sm font-semibold hover:bg-gray-100">
                        Back to Home
                      </Button>
                    </div>
                  </div>
                </div>
              </>
            )}

          </DialogContent>
        </Dialog>
      </div>
      {isLoading && (
        <SpinnerComponent />
      )}
    </div>
  );
}
