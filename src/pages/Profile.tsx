import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { fetchScans, getStatsFromScans, ScanRecord } from "@/lib/scan-history";
import { User, Calendar, BarChart3, Eye, Clock, ShieldAlert, CheckCircle, LogOut, ArrowLeft, Activity, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4 },
};

export default function Profile() {
  const { username, logout } = useAuth();
  const navigate = useNavigate();
  const [scans, setScans] = useState<ScanRecord[]>([]);
  const [loadingScans, setLoadingScans] = useState(true);

  useEffect(() => {
    fetchScans().then((data) => {
      setScans(data);
      setLoadingScans(false);
    });
  }, []);

  const stats = getStatsFromScans(scans);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const joinedDate = sessionStorage.getItem("mediscan_joined") || new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

  return (
    <div>
      {/* Breadcrumb */}
      <div className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container py-3">
          <div className="flex items-center gap-2 text-sm">
            <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
              <ArrowLeft className="h-3.5 w-3.5" />
              Home
            </Link>
            <span className="text-muted-foreground">/</span>
            <span className="text-foreground font-medium">Profile</span>
          </div>
        </div>
      </div>

      <div className="container max-w-3xl py-8 pb-24 md:pb-8 space-y-6">
        {/* User Info Card */}
        <motion.div {...fadeUp}>
          <Card className="overflow-hidden">
            <div className="h-20 bg-gradient-to-r from-primary/20 via-primary/10 to-accent/20" />
            <CardContent className="p-6 -mt-10">
              <div className="flex items-end gap-4">
                <div className="h-20 w-20 rounded-2xl bg-card border-4 border-card flex items-center justify-center glow-sm">
                  <User className="h-9 w-9 text-primary" />
                </div>
                <div className="flex-1 pb-1">
                  <h1 className="font-display text-xl font-bold text-foreground">{username}</h1>
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-0.5">
                    <Calendar className="h-3.5 w-3.5" />
                    Joined {joinedDate}
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={handleLogout} className="gap-1.5 rounded-xl">
                  <LogOut className="h-3.5 w-3.5" />
                  Logout
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Dashboard Stats */}
        <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.1 }}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { icon: BarChart3, value: stats.totalScans, label: "Total Scans", color: "text-primary" },
              { icon: ShieldAlert, value: stats.cataractDetected, label: "Detected", color: "text-warning" },
              { icon: CheckCircle, value: stats.normalScans, label: "Normal", color: "text-success" },
              { icon: Clock, value: stats.lastScanDate ? new Date(stats.lastScanDate).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "—", label: "Last Scan", color: "text-info" },
            ].map((s) => (
              <Card key={s.label} className="group hover:glow-sm transition-all duration-300">
                <CardContent className="p-4 text-center">
                  <s.icon className={`h-5 w-5 ${s.color} mx-auto mb-2`} />
                  <p className="font-display text-2xl font-bold text-foreground">{s.value}</p>
                  <p className="text-[10px] text-muted-foreground tracking-wide uppercase">{s.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Detection History */}
        <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.2 }}>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Activity className="h-4 w-4 text-primary" />
                </div>
                Detection History
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loadingScans ? (
                <div className="flex items-center justify-center py-10 gap-2">
                  <Loader2 className="h-5 w-5 animate-spin text-primary" />
                  <p className="text-sm text-muted-foreground">Loading history…</p>
                </div>
              ) : scans.length === 0 ? (
                <div className="text-center py-10">
                  <div className="h-16 w-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
                    <Eye className="h-8 w-8 text-muted-foreground/40" />
                  </div>
                  <p className="text-sm font-medium text-muted-foreground">No scans yet</p>
                  <p className="text-xs text-muted-foreground mt-1">Start your first scan to see results here</p>
                  <Button asChild variant="outline" size="sm" className="mt-4 rounded-xl">
                    <Link to="/cataract">Start Your First Scan</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {scans.map((scan, i) => {
                    const isNormal = scan.prediction.condition === "normal";
                    const confidence = Math.round(scan.prediction.confidence * 100);
                    return (
                      <motion.div
                        key={scan.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="rounded-xl border bg-card p-4 hover:glow-sm transition-all duration-300"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <p className="text-sm font-semibold text-foreground">
                              {scan.patient?.name || "Unknown Patient"}
                            </p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {scan.patient?.age ? `${scan.patient.age} yrs` : "—"}
                              {scan.patient?.gender ? ` · ${scan.patient.gender.charAt(0).toUpperCase()}${scan.patient.gender.slice(1)}` : ""}
                              {scan.patient?.eyeSide ? ` · ${scan.patient.eyeSide.charAt(0).toUpperCase()}${scan.patient.eyeSide.slice(1)} Eye` : ""}
                            </p>
                          </div>
                          <span className="text-[11px] text-muted-foreground whitespace-nowrap">
                            {new Date(scan.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                          </span>
                        </div>

                        <div className={`flex items-center justify-between rounded-xl px-3 py-2.5 ${
                          isNormal ? "bg-success/10 border border-success/20" : "bg-warning/10 border border-warning/20"
                        }`}>
                          <div className="flex items-center gap-2">
                            {isNormal ? (
                              <CheckCircle className="h-4 w-4 text-success shrink-0" />
                            ) : (
                              <ShieldAlert className="h-4 w-4 text-warning shrink-0" />
                            )}
                            <span className={`text-sm font-medium ${isNormal ? "text-success" : "text-warning"}`}>
                              {isNormal ? "Normal — No Cataract" : "Cataract Detected"}
                            </span>
                          </div>
                          <span className="text-sm font-bold text-foreground tabular-nums">{confidence}%</span>
                        </div>

                        {scan.prediction.severity && (
                          <p className="text-xs text-muted-foreground mt-2 capitalize">
                            Severity: <span className="font-medium text-foreground">{scan.prediction.severity}</span>
                          </p>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Account Settings */}
        <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.3 }}>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Account Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              <button className="w-full flex items-center justify-between px-3 py-3 rounded-xl text-sm text-foreground hover:bg-muted/50 transition-colors">
                Change Password
                <span className="text-muted-foreground text-xs bg-muted px-2 py-0.5 rounded-full">Coming soon</span>
              </button>
              <Separator />
              <button className="w-full flex items-center justify-between px-3 py-3 rounded-xl text-sm text-foreground hover:bg-muted/50 transition-colors">
                Update Email
                <span className="text-muted-foreground text-xs bg-muted px-2 py-0.5 rounded-full">Coming soon</span>
              </button>
              <Separator />
              <button
                onClick={handleLogout}
                className="w-full flex items-center px-3 py-3 rounded-xl text-sm text-destructive hover:bg-destructive/10 transition-colors"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </button>
            </CardContent>
          </Card>
        </motion.div>

        <p className="text-[11px] text-center text-muted-foreground">
          For educational purposes only. Not a substitute for professional medical advice.
        </p>
      </div>
    </div>
  );
}
