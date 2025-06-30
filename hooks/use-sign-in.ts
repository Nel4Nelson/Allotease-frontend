import { useState } from "react";
import { useRouter } from "next/navigation";

interface SignInData {
  email: string;
  password: string;
}

export function useSignIn() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const signIn = async (data: SignInData) => {
    setIsLoading(true);
    try {
      // TODO: Implement actual sign-in logic
      console.log("Sign in attempt:", data);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // TODO: Handle successful sign-in (redirect, store token, etc.)
      router.push("/");
    } catch (error) {
      console.error("Sign in error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    signIn,
    isLoading,
  };
}
