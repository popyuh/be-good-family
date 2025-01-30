import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";
import { AuthFormInputs } from "./AuthFormInputs";
import { useAuth } from "@/hooks/use-auth";

export function AuthForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isLoading, setIsLoading, validateInputs, signUp, signIn } = useAuth();

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

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Starting auth process...");
    console.log(`Mode: ${isSignUp ? "Sign Up" : "Sign In"}`);
    
    if (!validateInputs(email, password)) return;
    
    setIsLoading(true);
    
    try {
      if (isSignUp) {
        const { data, error } = await signUp(email, password);
        console.log("Sign up response:", { data, error });
        
        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Account created successfully! Please check your email to verify your account.",
        });
      } else {
        const { data, error } = await signIn(email, password);
        console.log("Sign in response:", { data, error });
        
        if (error) throw error;
        
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
        
        <AuthFormInputs
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
        />

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