"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Lock, User, ArrowRight, DollarSign, Smartphone } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import api from "@/lib/api";
import Image from "next/image";
import { LogoLoader } from "@/components/ui/logo-loader";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    first_name: "",
    phone_number: "",
    initial_amount: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Password Validation
    if (formData.password.length < 8) {
      toast.error("Password must be at least 8 characters long");
      setIsLoading(false);
      return;
    }
    const hasLetter = /[a-zA-Z]/.test(formData.password);
    const hasNumber = /[0-9]/.test(formData.password);
    if (!hasLetter || !hasNumber) {
      toast.error("Password must contain at least one letter and one number");
      setIsLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      setIsLoading(false);
      return;
    }
    
    try {
      await api.post("/auth/register/", {
        phone_number: formData.phone_number,
        first_name: formData.first_name,
        initial_amount: Number(formData.initial_amount),
        password: formData.password,
      });
      
      toast.success("Account created successfully!");
      // Redirect to login on success
      router.push("/login");
    } catch (err: any) {
      console.error("Registration error:", err);
      
      let message = "Failed to register. Please try again.";
      const responseData = err.response?.data;
      console.log("Debug - Registration Error Response:", responseData);

      if (responseData) {
        if (typeof responseData === 'object' && !Array.isArray(responseData)) {
            // Handle DRF standard error format: { field: [errors], ... }
            const errorMessages = Object.entries(responseData).map(([key, val]) => {
                const fieldName = key.replace('_', ' '); // "phone_number" -> "phone number"
                const errorText = Array.isArray(val) ? val.join(" ") : String(val);
                // Capitalize first letter
                const capitalizedField = fieldName.charAt(0).toUpperCase() + fieldName.slice(1);
                return `${capitalizedField}: ${errorText}`;
            });
            message = errorMessages.join("\n");
        } else if (typeof responseData === 'string') {
            // Check if it's HTML (likely a 404/500/400 generic page)
            if (responseData.trim().startsWith('<')) {
                message = "Server verification failed. Please check your connection or contact support.";
            } else {
                message = responseData;
            }
        }
      }
      
      // Prevent toast from being excessively long
      if (message.length > 200) {
          message = message.substring(0, 200) + "...";
      }
      
      toast.error(message);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 flex flex-col items-center">
          <div className="w-20 h-20 relative mb-2">
            <Image 
              src="/logo/logo.png" 
              alt="FlowFunds Logo" 
              fill
              className="object-contain"
              priority
            />
          </div>
          <CardTitle className="text-2xl font-bold text-center text-emerald-700">Create Account</CardTitle>
          <CardDescription className="text-center">
            Join FlowFunds to track your finances today
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">

            <div className="space-y-2">
              <Label htmlFor="first_name">First Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input 
                  id="first_name" 
                  placeholder="John" 
                  type="text" 
                  className="pl-10"
                  value={formData.first_name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone_number">Phone Number</Label>
              <div className="relative">
                <Smartphone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input 
                  id="phone_number" 
                  placeholder="600000000" 
                  type="tel" 
                  className="pl-10"
                  value={formData.phone_number}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="initial_amount">Initial Balance (XAF)</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input 
                  id="initial_amount" 
                  placeholder="50000" 
                  type="number" 
                  min="0"
                  className="pl-10"
                  value={formData.initial_amount}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="••••••••"
                  className="pl-10"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input 
                  id="confirmPassword" 
                  type="password" 
                  placeholder="••••••••"
                  className="pl-10"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button 
              type="submit" 
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <LogoLoader size={20} className="brightness-0 invert" />
                  <span>Creating account...</span>
                </div>
              ) : (
                "Sign Up"
              )}
              {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
            </Button>
            <div className="text-center text-sm">
              Already have an account?{" "}
              <Link href="/login" className="font-medium text-emerald-600 hover:underline">
                Sign in
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
