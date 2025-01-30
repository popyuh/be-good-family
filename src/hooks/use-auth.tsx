import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const validateInputs = (email: string, password: string) => {
    console.log("Validating inputs - Email:", email, "Password length:", password.length);
    
    if (!email || !password) {
      console.log("Validation failed: Missing email or password");
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return false;
    }
    
    if (password.length < 6) {
      console.log("Validation failed: Password too short");
      toast({
        title: "Error",
        description: "Password must be at least 6 characters long",
        variant: "destructive",
      });
      return false;
    }
    
    console.log("Input validation passed");
    return true;
  };

  const signUp = async (email: string, password: string) => {
    console.log("Attempting sign up with email:", email);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    console.log("Sign up response:", { data, error });
    
    if (error) {
      console.error("Sign up error:", error);
      throw error;
    }

    if (!data.user) {
      console.error("No user data returned from signup");
      throw new Error("Failed to create account");
    }

    return data;
  };

  const signIn = async (email: string, password: string) => {
    console.log("Attempting sign in with email:", email);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    console.log("Sign in response:", { data, error });
    
    if (error) {
      console.error("Sign in error:", error);
      throw error;
    }

    return data;
  };

  return {
    isLoading,
    setIsLoading,
    validateInputs,
    signUp,
    signIn,
  };
};