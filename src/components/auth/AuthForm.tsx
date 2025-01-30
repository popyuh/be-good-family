import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";

export function AuthForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      console.log("Current session check:", session ? "Authenticated" : "Not authenticated");
      if (session) navigate('/');
    };
    
    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed - Event:", event);
      console.log("Auth state changed - Session:", session ? "Present" : "None");
      if (session) navigate('/');
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const validateInputs = () => {
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

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Starting auth process...");
    console.log("Mode:", isSignUp ? "Sign Up" : "Sign In");
    
    if (!validateInputs()) return;
    
    setIsLoading(true);
    
    try {
      if (isSignUp) {
        console.log("Attempting sign up with email:", email);
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
            data: {
              email,
            },
          },
        });

        console.log("Sign up response - Data:", data);
        if (error) {
          console.error("Sign up error:", error);
          throw error;
        }

        toast({
          title: "Success",
          description: "Please check your email to verify your account",
        });
        
      } else {
        console.log("Attempting sign in with email:", email);
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        console.log("Sign in response - Data:", data);
        if (error) {
          console.error("Sign in error:", error);
          throw error;
        }

        toast({
          title: "Success",
          description: "Successfully signed in",
        });
      }
    } catch (error) {
      console.error("Auth error details:", error);
      
      let errorMessage = "An error occurred during authentication.";
      if (error instanceof Error) {
        console.log("Error type:", error.constructor.name);
        console.log("Error message:", error.message);
        
        if (error.message.includes("Email not confirmed")) {
          errorMessage = "Please check your email and confirm your account.";
        } else if (error.message.includes("Invalid login credentials")) {
          errorMessage = "Invalid email or password.";
        } else if (error.message.includes("User already registered")) {
          errorMessage = "This email is already registered. Please sign in.";
        } else {
          errorMessage = error.message;
        }
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      console.log("Auth process completed");
    }
  };

  return (
    <Card className="p-4 md:p-6 max-w-md mx-auto">
      <form onSubmit={handleAuth} className="space-y-4">
        <h2 className="text-xl md:text-2xl font-bold">Welcome to BeGoodFamily</h2>
        <p className="text-muted-foreground">
          {isSignUp ? "Create an account to get started." : "Sign in to your account."}
        </p>
        
        <div className="space-y-2">
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <Button 
          type="submit" 
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              {isSignUp ? 'Creating account...' : 'Signing in...'}
            </div>
          ) : (
            isSignUp ? 'Create account' : 'Sign in'
          )}
        </Button>

        <Button
          type="button"
          variant="ghost"
          className="w-full"
          onClick={() => {
            setIsSignUp(!isSignUp);
            setEmail("");
            setPassword("");
          }}
        >
          {isSignUp 
            ? "Already have an account? Sign in" 
            : "Don't have an account? Sign up"}
        </Button>
      </form>
    </Card>
  );
}