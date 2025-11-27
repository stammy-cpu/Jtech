import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Mail, Lock, User, ChevronRight } from "lucide-react";

export default function RegistrationPage() {
  const [, navigate] = useLocation();
  const { register, login } = useAuth();
  const { toast } = useToast();
  const [isSignUp, setIsSignUp] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isSignUp) {
        if (!formData.email || !formData.username || !formData.password) {
          toast({ title: "Error", description: "Please fill in all fields", variant: "destructive" });
          setIsLoading(false);
          return;
        }
        if (formData.password !== formData.confirmPassword) {
          toast({ title: "Error", description: "Passwords do not match", variant: "destructive" });
          setIsLoading(false);
          return;
        }
        await register(formData.email, formData.username, formData.password);
        toast({ title: "Success", description: "Account created! Welcome to JTECH." });
        navigate("/home");
      } else {
        if (!formData.email || !formData.password) {
          toast({ title: "Error", description: "Please fill in all fields", variant: "destructive" });
          setIsLoading(false);
          return;
        }
        await login(formData.email, formData.password);
        toast({ title: "Success", description: "Welcome back!" });
        navigate("/home");
      }
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Authentication failed", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-chart-1/5 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/20 rounded-full blur-3xl opacity-30" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-chart-2/20 rounded-full blur-3xl opacity-30" />
      </div>

      <Card className="w-full max-w-md relative z-10 border-primary/20 shadow-2xl">
        <CardHeader className="space-y-4 pb-6">
          <div className="flex items-center justify-center w-12 h-12 mx-auto rounded-xl bg-gradient-to-br from-primary to-chart-1">
            <span className="text-2xl font-bold text-white">J</span>
          </div>
          <CardTitle className="text-center text-3xl font-bold bg-gradient-to-r from-primary to-chart-1 bg-clip-text text-transparent">
            {isSignUp ? "Join JTECH" : "Welcome Back"}
          </CardTitle>
          <p className="text-center text-muted-foreground text-sm">
            {isSignUp
              ? "Create an account to start trading"
              : "Sign in to your account"}
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="pl-10 bg-muted/50 border-primary/20 focus:border-primary"
                  data-testid="input-email"
                />
              </div>
            </div>

            {isSignUp && (
              <div className="space-y-2">
                <label className="text-sm font-semibold">Username</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="your_username"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="pl-10 bg-muted/50 border-primary/20 focus:border-primary"
                    data-testid="input-username"
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-semibold">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="pl-10 bg-muted/50 border-primary/20 focus:border-primary"
                  data-testid="input-password"
                />
              </div>
            </div>

            {isSignUp && (
              <div className="space-y-2">
                <label className="text-sm font-semibold">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="pl-10 bg-muted/50 border-primary/20 focus:border-primary"
                    data-testid="input-confirm-password"
                  />
                </div>
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-primary to-chart-1 text-white font-semibold h-11"
              data-testid={`button-${isSignUp ? 'signup' : 'signin'}`}
            >
              {isLoading ? "Please wait..." : isSignUp ? "Create Account" : "Sign In"}
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-primary/10">
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setFormData({ email: "", username: "", password: "", confirmPassword: "" });
              }}
              className="w-full text-center text-sm text-muted-foreground hover:text-primary transition-colors"
              data-testid="button-toggle-auth"
            >
              {isSignUp ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
