"use client";

import { useState, type FormEvent } from "react";
import { validateLoginForm, type LoginCredentials } from "@/features/login/model/login.model";
import { useRouter } from "next/navigation";

export function useLoginViewModel() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailChange = (value: string) => {
    setEmail(value);
    setError(null);
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    setError(null);
  };

  const handleRememberMeChange = (checked: boolean) => {
    setRememberMe(checked);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const credentials: LoginCredentials = { email, password, rememberMe };
    const validationError = validateLoginForm(credentials);

    if (validationError) {
      setError(validationError);
      setIsLoading(false);
      return;
    }

    // Simulate API call
    console.log("Login attempt:", credentials);
    // Replace with actual API call
    // const response = await loginAPI(email, password, rememberMe);
    router.push("/onboarding");
  };

  return {
    email,
    password,
    rememberMe,
    error,
    isLoading,
    handleEmailChange,
    handlePasswordChange,
    handleRememberMeChange,
    handleSubmit,
  };
}
