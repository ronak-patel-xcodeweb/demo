"use client"
import Link from "next/link";
import { LoginForm } from "@/components/auth/login-form";


export default function Login() {
  return (
    <div className="flex h-dvh">
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
      <div className="bg-background flex w-full items-center justify-center p-8 lg:w-2/3">
        <div className="w-full max-w-md space-y-6 py-24 lg:py-32">
          <div>
            <h1 className="text-3xl font-semibold">Login</h1>
            <p className="text-muted-foreground text-sm mt-2">Enter your credentials to access your account</p>
          </div>
          <div className="space-y-2">
            <LoginForm />

          </div>
        </div>
      </div>
    </div>
  );
}
