"use client";
import { useContext, useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { DataTableContext } from "@/components/context/DataTableContext";
import { useRouter } from "next/navigation";
import SpinnerComponent from "@/components/spinner/spinner";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isTokenPresent, setIsTokenPresent] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const { dataTables } = useContext(DataTableContext);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    if (typeof window !== "undefined") {
      const searchParams = new URLSearchParams(window.location.search);
      const tokenParam = searchParams.get("token");
      if (tokenParam) {
        setIsTokenPresent(true);
        setToken(tokenParam);
      }
    }
  }, []);

  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleEmailSubmit = async () => {
    if (!email) return toast.warning("Please enter your email address.");
    if (!validateEmail(email)) return toast.warning("Please enter a valid email address.");

    try {
      setIsLoading(true);
      const userTableId = dataTables.find((t: any) => t?.table_name === "User")?.id;
      const formData = new FormData();
      formData.append("data", JSON.stringify({ email }));
      formData.append("userTableId", userTableId);

      const res = await fetch("/api/forgot-password", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        toast.success("Password reset email has been sent. Please check your inbox.");
      } else {
        const errorData = await res.json();
        toast.error(errorData.error || "Failed to send reset email. Please try again.");
      }

      setEmail("");
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong while sending reset email. Try again later.");
    }

  };

  const handlePasswordReset = async () => {

    if (!newPassword || !confirmPassword)
      return toast.warning("Please fill in both password fields.");
    if (newPassword !== confirmPassword)
      return toast.warning("Passwords do not match.");
    if (!token)
      return toast.error("Invalid or missing reset token. Please check your email link.");

    try {
      setIsLoading(true);
      const userTableId = dataTables.find((t: any) => t?.table_name === "User")?.id;
      const formData = new FormData();
      const payload = { token, password: newPassword };
      formData.append("data", JSON.stringify(payload));
      formData.append("userTableId", userTableId);

      const res = await fetch("/api/reset-password", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        toast.success("Your password has been reset successfully. You can now log in.");
        setNewPassword("");
        setConfirmPassword("");
        router.push("/login");
        router.refresh();
      } else {
        const errorData = await res.json();
        toast.error(errorData.error || "Failed to reset password. Please try again.");
      }
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong while resetting password. Try again later.");
    }
  };

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
        <div className="w-full max-w-md space-y-10 py-24 lg:py-32">
          <div className="space-y-4 mt-4">
            <div className="space-y-6">
              <div className="space-y-2 text-center">
                <div>
                  <h1 className="text-3xl font-semibold">
                    {isTokenPresent ? "Reset Password" : "Forgot Password?"}
                  </h1>
                </div>
              </div>
              <div className="space-y-4">
                {!isTokenPresent ? (
                  <>
                    <label className="text-sm font-medium block">Email address</label>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="w-full  h-12 rounded-xl bg-input border border-line px-4 py-3 text-white placeholder-gray-400 outline-none focus:border-gray-500" />
                    <div className="flex justify-center">
                      <Button className="cursor-pointer h-12 rounded-xl w-full" onClick={handleEmailSubmit}>
                        Send reset link
                      </Button>
                    </div>
                    <Link
                      href={"/login"}
                      className="flex items-center justify-center gap-2 w-full text-sm font-medium transition-colors"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Back to login
                    </Link>
                  </>
                ) : (
                  <>
                    <label className="text-sm font-medium block">New Password</label>
                    <Input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                      className="w-full  h-12 rounded-xl bg-input border border-line px-4 py-3 text-white placeholder-gray-400 outline-none focus:border-gray-500" />
                    <label className="text-sm font-medium block">Confirm Password</label>
                    <Input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                      className="w-full  h-12 rounded-xl bg-input border border-line px-4 py-3 text-white placeholder-gray-400 outline-none focus:border-gray-500" />
                    <div className="flex justify-center">
                      <Button className="cursor-pointer h-12 rounded-xl w-full" onClick={handlePasswordReset}>
                        Reset Password
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {isLoading && (
        <SpinnerComponent />
      )}
    </div>
  );
}
