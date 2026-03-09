import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Loader2, User, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import mediscanLogo from "@/assets/mediscan-logo.png";

const ML_API_BASE_URL = import.meta.env.VITE_ML_API_URL || "https://nontutorial-sharolyn-intersocial.ngrok-free.dev";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) return;

    setLoading(true);
    try {
      const response = await fetch(`${ML_API_BASE_URL}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "ngrok-skip-browser-warning": "true" },
        body: JSON.stringify({ username: username.trim(), password }),
      });

      const data = await response.json().catch(() => null);
      if (!response.ok) throw new Error(data?.message || "Signup failed");

      toast({ title: "Account Created", description: "You can now sign in." });
      navigate("/login");
    } catch (err: any) {
      toast({ title: "Signup Failed", description: err.message || "Could not create account.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/3 left-1/3 w-72 h-72 bg-primary/5 rounded-full blur-[100px]" />

      <motion.div
        className="w-full max-w-sm space-y-8 relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center space-y-3">
          <div className="h-16 w-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto glow-sm">
            <img src={mediscanLogo} alt="MediScan" className="h-10 w-10 object-contain" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground tracking-tight">
              Create <span className="gradient-text">Account</span>
            </h1>
            <p className="text-sm text-muted-foreground mt-1">Sign up to access AI health screening</p>
          </div>
        </div>

        <div className="glass rounded-2xl p-6 premium-shadow">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-xs font-semibold tracking-wide uppercase">Username</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Choose a username" className="pl-9 h-11 rounded-xl" disabled={loading} maxLength={100} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-xs font-semibold tracking-wide uppercase">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Choose a password" className="pl-9 h-11 rounded-xl" disabled={loading} maxLength={100} />
              </div>
            </div>
            <Button type="submit" className="w-full h-11 rounded-xl text-sm font-semibold glow-sm hover:glow-md transition-shadow" disabled={loading || !username.trim() || !password.trim()}>
              {loading ? <><Loader2 className="h-4 w-4 animate-spin" />Creating account…</> : "Sign Up"}
            </Button>
          </form>
        </div>

        <p className="text-sm text-center text-muted-foreground">
          Already have an account?{" "}
          <Link to="/login" className="text-primary hover:underline font-semibold">Sign in</Link>
        </p>
      </motion.div>
    </div>
  );
}
