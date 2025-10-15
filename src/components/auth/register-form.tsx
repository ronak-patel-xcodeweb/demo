"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { string, z } from "zod";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { redirect } from "next/navigation";
import { useContext } from "react";
import { DataTableContext } from "../context/DataTableContext";

const FormSchema = z
  .object({
    // common fields
    user_type: z.string(),
    email: z.string().email({ message: "Please enter a valid email address." }),
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
  })
  .superRefine((data, ctx) => {
    // Company-specific validation
    if (data.user_type === "Company") {
      // Check password match
      if (data.password !== data.confirmPassword) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Passwords do not match.",
          path: ["confirmPassword"],
        });
      }

      // Check password is provided
      if (!data.password || data.password === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Password is required",
          path: ["password"],
        });
      }

      // Check required company fields
      const requiredFields = [
        "company_name",
        "company_contactName",
        "company_tax_no",
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
  });

const roleList = [{
  roleName: 'Company',
  roleValue: 'Company'
}, {
  roleName: 'Agent',
  roleValue: 'Agent'
}]

export function RegisterForm() {
  const { dataTables, setDataTables } = useContext(DataTableContext);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      user_type: "Company",
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

      //common fileds
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    try {
      const companyTablId = dataTables.find((t: any) => t?.table_name === "Company");
      const userTableId = dataTables.find((t: any) => t?.table_name === "User");
      const agentId = dataTables.find((t: any) => t?.table_name === "Agent");

      const formData = new FormData();
      formData.append("data", JSON.stringify(data));
      formData.append("companytableId", companyTablId?.id);
      formData.append("userTableId", userTableId?.id);
      formData.append("agentTableId", agentId?.id);

      if (data.agent_identy_proof) {
        formData.append("agentFile", data.agent_identy_proof);
      }

      const response = await fetch("/api/register", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) throw new Error(result.error || "Failed to register");

      console.log("Server Response:", result);
      toast("You’ve successfully registered your account.");
    } catch (error: any) {
      toast(error?.message || "Something went wrong!");
    }
  };

  const selectedUserType = form.watch("user_type");

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex justify-center">
          <FormField
            control={form.control}
            name="user_type"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="md:flex"
                  >
                    {roleList.map((role) => (
                      <label
                        key={role.roleValue}
                        className="flex items-center space-x-1 border rounded-lg p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                      >
                        <RadioGroupItem value={role.roleValue} />
                        <span className="font-normal">{role.roleName}</span>
                      </label>
                    ))}
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        {/* company fileds */}

        {selectedUserType == "Company" && (<>
          <div className="md:flex gap-5">
            <FormField
              control={form.control}
              name="company_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Name</FormLabel>
                  <FormControl>
                    <Input id="company_name" type="text" placeholder="Company Name" autoComplete="company_name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="mt-5 md:mt-0">

              <FormField
                control={form.control}
                name="company_website"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Website</FormLabel>
                    <FormControl>
                      <Input id="company_website" type="url" placeholder="Website" autoComplete="company_website" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="md:flex gap-5">
            <FormField
              control={form.control}
              name="company_address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input id="company_address" type="text" placeholder="Address" autoComplete="company_address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="mt-5 md:mt-0">

              <FormField
                control={form.control}
                name="company_tax_no"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tax Registration No</FormLabel>
                    <FormControl>
                      <Input id="company_tax_no" type="text" placeholder="Tax Registration No." autoComplete="company_tax_no" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="md:flex gap-5">


            <FormField
              control={form.control}
              name="company_business_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Business Type</FormLabel>
                  <FormControl>
                    <Input id="company_business_type" type="text" placeholder="Business Type" autoComplete="company_business_type" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="mt-5 md:mt-0">
              <FormField
                control={form.control}
                name="company_VAT"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>VAT No</FormLabel>
                    <FormControl>
                      <Input id="company_VAT" type="text" placeholder="VAT No." autoComplete="company_VAT" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="md:flex gap-5">

            <FormField
              control={form.control}
              name="company_contactName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Person Name</FormLabel>
                  <FormControl>
                    <Input id="company_contactName" type="text" placeholder="Person Name" autoComplete="company_contactName" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="mt-5 md:mt-0">
              <FormField
                control={form.control}
                name="company_contactnumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Person Phone</FormLabel>
                    <FormControl>
                      <Input id="company_contactnumber" type="text" placeholder="Person Phone" autoComplete="company_contactnumber" {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
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
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input id="agent first_Name" type="text" placeholder="First Name" autoComplete="agent_first_Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="mt-5 md:mt-0">
              <FormField
                control={form.control}
                name="agent_last_Name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input id="agent_last_Name" type="text" placeholder="Last Name" autoComplete="last_Name" {...field} />
                    </FormControl>
                    <FormMessage />
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
                render={({ field }) => (
                  <FormItem>
                    {selectedUserType == "Agent" && (<FormLabel>Email</FormLabel>)}
                    <FormControl>
                      {selectedUserType === "Agent" ? (
                        <Input id="email" type="email" placeholder="Email" autoComplete="email" {...field} />
                      ) : null}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />            </div>
            <div className="mt-5 md:mt-0">
              <FormField
                control={form.control}
                name="agent_phone_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone number</FormLabel>
                    <FormControl>
                      <Input id="agent_phone_number" type="number" placeholder="Phone" autoComplete="agent_phone_number" {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
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
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input id="agent_location" type="text" placeholder="Address" autoComplete="agent_location" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="mt-5 md:mt-0">
              <FormField
                control={form.control}
                name="agent_country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country</FormLabel>
                    <FormControl>
                      <Input id="agent_country" type="text" placeholder="Country" autoComplete="agent_country" {...field} />
                    </FormControl>
                    <FormMessage />
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
                      <Input id="agent_company_name" type="text" placeholder="Company Name" autoComplete="agent_company_name" {...field} />
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
                      <Input id="agent_company_VAT" type="text" placeholder="VAT of the Company" autoComplete="agent_company_VAT" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <FormField
            control={form.control}
            name="agent_identy_proof"
            render={({ field }) => (
              <FormItem className="w-68 ">
                <FormLabel>Identity Proof</FormLabel>
                <FormControl>
                  <Input
                    className="cursor-pointer w-50"
                    id="agent_identy_proof"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file: any = e.target.files?.[0];
                      form.setValue("agent_identy_proof", file);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </>
        )}

        {/* common fileds */}

        {selectedUserType == "Company" && (
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                {selectedUserType == "Company" && (<FormLabel>Contact Person Email</FormLabel>)}
                <FormControl>
                  {selectedUserType === "Company" ? (
                    <Input id="email" type="email" placeholder="Contact Person Email" autoComplete="email" {...field} />
                  ) : null}
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {selectedUserType == "Company" && (
          <div className="md:flex gap-5">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input id="password" type="password" placeholder="New Password" autoComplete="new-password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="mt-5 md:mt-0">
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="Confirm Password"
                        autoComplete="new-password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        )}
        <Button className="w-full cursor-pointer" type="submit">
          Register
        </Button>
      </form>
    </Form>
  );
}
