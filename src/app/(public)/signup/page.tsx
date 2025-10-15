"use client";
import Link from "next/link";
import { RegisterForm } from "@/components/auth/register-form";

export default function SignUp() {
  return (
    <div className="flex h-dvh">
      <div className="bg-background flex w-full items-center justify-center lg:w-2/3 overflow-y-auto px-4">
        <div className="w-full max-w-md flex flex-col h-full py-10">
          <div className="space-y-2 text-center mb-6">
            <h1 className="text-2xl font-medium text-white">Create an Account</h1>
            <div className="text-sm text-gray-400 font-medium">
              Select your role and fill in the necessary details
            </div>
          </div>

          <div >
            <RegisterForm />
          </div>

          <div className="text-center text-sm mt-3">
            <div>
             <p className="text-muted-foreground">
               Already have an account?
              <Link href="/login" className="ms-1 text-primary hover:underline">
                Login
              </Link>
               </p>

            </div>
          </div>
        </div>
      </div>

      <div className="bg-primary hidden lg:flex lg:w-1/3 items-center justify-center p-12 text-center">
        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-primary-foreground text-5xl font-light">
              Welcome!
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
}
