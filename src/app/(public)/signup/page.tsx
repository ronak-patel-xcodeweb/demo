"use client";
import Link from "next/link";
import { RegisterForm } from "@/components/auth/register-form";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function SignUp() {
  const router = useRouter();
  const [role, setRole] = useState<any>();
  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);

      setRole(urlParams.get('role'));
      if (!urlParams.get('role')) {
        router.replace("?role=Company");
      }

    }
  }, []);

  return (
    <div className="flex h-dvh">
      <div className="bg-background flex w-full items-center justify-center lg:w-2/3 overflow-y-auto px-4">
        <div className=" h-full py-10">
          <div className="text-center mb-2">
            <h1 className="text-3xl sm:text-4xl font-semibold">Create an Account</h1>
            <p className="text-muted-foreground">
              {role === "Agent"
                ? "Sign up as an Agent."
                : role === "GovernmentBody"
                  ? "Sign up as a Government Body."
                  : role === "Company"
                    ? "Sign up as a Company."
                    : "Select your role to continue."}
            </p>          </div>
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
      <div className="relative hidden lg:block lg:w-1/2">
        <div className="absolute inset-0 bg-gradient-to-br from-[#221634] via-[#111a38] to-[#0a0a0b]"></div>
        <div
          className="absolute inset-0 opacity-70 [background:radial-gradient(700px_300px_at_20%_0%,rgba(116,69,231,0.35),rgba(0,0,0,0)_60%),conic-gradient(from_180deg_at_70%_30%,#13131a_0deg,#2b1c3f_70deg,#0f1f39_170deg,#2b253c_260deg,#13131a_360deg)]"
        ></div>
        <div className="absolute inset-0 shadow-innerGlow"></div>

        <div className="absolute left-10 right-10 bottom-10">
          <p className="leading-tight font-medium text-3xl sm:text-4xl md:text-5xl lg:text-6xl">
            <span className="opacity-90 font-light block">BLACK</span>
            <span className="font-extrabold block">MONOLITH</span>
          </p>
        </div>
      </div>
    </div>
  );
}
