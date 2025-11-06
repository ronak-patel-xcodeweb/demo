"use client";

import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";
import { toast } from "sonner";
import { DataTableContext } from "../context/DataTableContext";
import Link from "next/link";
import { Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import SpinnerComponent from "../spinner/spinner";

type LoginFormData = {
  email: string;
  password: string;
};

export function LoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const { dataTables } = useContext(DataTableContext);

  const form = useForm<LoginFormData>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError("");

    try {
      const userTable = dataTables.find((t: any) => t?.table_name === "User");
      const res = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
        tableId: userTable?.id,
      });

      if (res?.error) {
        try {
          const errorData = JSON.parse(res.error);

          if (errorData.requirePasswordChange && errorData.token) {
            sessionStorage.setItem("resetEmail", data.email);
            sessionStorage.setItem("isFirstLogin", "true");
            toast.info("Please change your temporary password to continue.", {
              style: { background: "blue" },
            });
            router.push(`/forgot-password?token=${errorData.token}`);
            return;
          }
        } catch {
          toast.error(res.error, { style: { background: "red" } });
        }
      } else if (res?.ok) {
        toast.success("You've successfully logged into your account.", {
          style: { background: "green" },
        });
        router.push("/dashboard");
        router.refresh();
      }
    } catch (error) {
      setError("Something went wrong. Please try again.");
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 relative">
          {error && (
            <div className="p-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded">
              {error}
            </div>
          )}

          {/* EMAIL FIELD */}
          <FormField
            control={form.control}
            name="email"
            rules={{
              required: "This field is required.",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address",
              },
            }}
            render={({ field, fieldState }) => (
              <FormItem className="relative">
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

                <FormControl>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter Email"
                    autoComplete="email"
                    disabled={isLoading}
                    {...field}
                    className="w-full h-12 rounded-xl bg-input border border-line px-4 py-3 text-white placeholder-gray-400 outline-none focus:border-gray-500"
                  />
                </FormControl>
              </FormItem>
            )}
          />

          {/* PASSWORD FIELD */}
          <FormField
            control={form.control}
            name="password"
            rules={{
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            }}
            render={({ field, fieldState }) => (
              <FormItem className="relative">
                <div className="flex items-center justify-between">
                  <FormLabel className="text-sm !text-white">Password</FormLabel>
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
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    autoComplete="current-password"
                    disabled={isLoading}
                    {...field}
                    className="w-full h-12 rounded-xl bg-input border border-line px-4 py-3 text-white placeholder-gray-400 outline-none focus:border-gray-500"
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <div className="flex items-end justify-end text-sm">
            <Link href="/forgot-password" className="text-primary hover:underline">
              Forgot password?
            </Link>
          </div>

          <Button className="w-full cursor-pointer h-11 rounded-xl" type="submit" disabled={isLoading}>
            Login
          </Button>

          <p className="text-sm text-start text-muted-foreground">
            <span>Don't have an account? </span>
            <Link href="/signup" className="text-primary hover:underline">
              Create an account
            </Link>
          </p>
        </form>
      </Form>
      {isLoading && (
        <SpinnerComponent />
      )}
    </>
  );
}
