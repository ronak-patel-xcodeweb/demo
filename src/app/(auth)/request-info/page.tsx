'use client'

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type requestForm = {
  entityName: string;
  purpose: string;
  description: string;

};
export default function AgentServices() {

  const form = useForm<requestForm>({
    defaultValues: {
      entityName: "",
      description: "",
      purpose: "",
    },
  });

  const onSubmit = () => {

    toast.success("Request submitted successfully", {
      style: {
        background: 'green',
      },
    })
    form.reset()
  };

  return <div>
    <div className="text-3xl font-bond">
      Request Additional Information    </div>
    <div className="p-10 md:w-1/2">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="entityName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Entity Name</FormLabel>
                <FormControl>
                  <Input required placeholder="Enter Entity Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="purpose"
            render={({ field }) => (
              <FormItem>
                <FormLabel>purpose</FormLabel>
                <FormControl>
                  <Input required placeholder="purpose" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Input required placeholder="Describe the information you require" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-center w-full">
            <Button type="submit" className="cursor-pointer">
              Submit Request
            </Button>
          </div>
        </form>
      </Form>
    </div>
  </div>;
}
