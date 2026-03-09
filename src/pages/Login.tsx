import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, Loader2, User, Lock, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import mediscanLogo from "@/assets/mediscan-logo.png";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) return;

    setLoading(true);
    try {
      await login(username.trim(), password);
      navigate("/");
    } catch (err: any) {
      toast({
        title: "Login Failed",
        description: err.message || "Invalid username or password.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-primary/5 rounded-full blur-[100px]" />

      <motion.div
        className="w-full max-w-sm space-y-8 relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Brand */}
        <div className="text-center space-y-3">
          <div className="relative inline-block">
            <div className="h-16 w-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto glow-sm">
              <img src={mediscanLogo} alt="MediScan" className="h-10 w-10 object-contain" />
            </div>
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground tracking-tight">
              Welcome to <span className="gradient-text">MediScan</span>
            </h1>
            <p className="text-sm text-muted-foreground mt-1">Sign in to access AI health screening</p>
          </div>
        </div>

        {/* Form */}
        <div className="glass rounded-2xl p-6 premium-shadow">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-xs font-semibold tracking-wide uppercase">Username</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  className="pl-9 h-11 rounded-xl"
                  disabled={loading}
                  autoComplete="username"
                  maxLength={100}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-xs font-semibold tracking-wide uppercase">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="pl-9 h-11 rounded-xl"
                  disabled={loading}
                  autoComplete="current-password"
                  maxLength={100}
                />
              </div>
            </div>

            <Button type="submit" className="w-full h-11 rounded-xl text-sm font-semibold glow-sm hover:glow-md transition-shadow" disabled={loading || !username.trim() || !password.trim()}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Signing in…
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
        </div>

        <p className="text-sm text-center text-muted-foreground">
          Don't have an account?{" "}
          <Link to="/signup" className="text-primary hover:underline font-semibold">Sign up</Link>
        </p>

        <p className="text-[11px] text-center text-muted-foreground">
          For educational purposes only. Not a substitute for professional medical advice.
        </p>
      </motion.div>
    </div>
  );
}
