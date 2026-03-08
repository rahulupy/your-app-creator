import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { getScans, getStats } from "@/lib/scan-history";
import { User, Calendar, BarChart3, Eye, Clock, ShieldAlert, CheckCircle, LogOut, ArrowLeft, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const { username, logout } = useAuth();
  const navigate = useNavigate();
  const scans = getScans();
  const stats = getStats();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const joinedDate = sessionStorage.getItem("mediscan_joined") || new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

  return (
    <div>
      {/* Breadcrumb */}
      <div className="border-b bg-card">
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
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-8 w-8 text-primary" />
              </div>
              <div className="flex-1">
                <h1 className="font-display text-xl font-bold text-foreground">{username}</h1>
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-1">
                  <Calendar className="h-3.5 w-3.5" />
                  Joined {joinedDate}
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={handleLogout} className="gap-1.5">
                <LogOut className="h-3.5 w-3.5" />
                Logout
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Dashboard Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Card>
            <CardContent className="p-4 text-center">
              <BarChart3 className="h-5 w-5 text-primary mx-auto mb-2" />
              <p className="font-display text-2xl font-bold text-foreground">{stats.totalScans}</p>
              <p className="text-xs text-muted-foreground">Total Scans</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <ShieldAlert className="h-5 w-5 text-warning mx-auto mb-2" />
              <p className="font-display text-2xl font-bold text-foreground">{stats.cataractDetected}</p>
              <p className="text-xs text-muted-foreground">Cataract Detected</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <CheckCircle className="h-5 w-5 text-success mx-auto mb-2" />
              <p className="font-display text-2xl font-bold text-foreground">{stats.normalScans}</p>
              <p className="text-xs text-muted-foreground">Normal Scans</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Clock className="h-5 w-5 text-info mx-auto mb-2" />
              <p className="font-display text-sm font-bold text-foreground">
                {stats.lastScanDate
                  ? new Date(stats.lastScanDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                  : "—"}
              </p>
              <p className="text-xs text-muted-foreground">Last Scan</p>
            </CardContent>
          </Card>
        </div>

        {/* Detection History */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Activity className="h-4 w-4 text-primary" />
              Detection History
            </CardTitle>
          </CardHeader>
          <CardContent>
            {scans.length === 0 ? (
              <div className="text-center py-8">
                <Eye className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">No scans yet</p>
                <Button asChild variant="outline" size="sm" className="mt-3">
                  <Link to="/cataract">Start Your First Scan</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-0">
                {/* Table header */}
                <div className="grid grid-cols-[1fr,80px,60px,70px,80px,90px] gap-2 px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider border-b">
                  <span>Patient</span>
                  <span>Age</span>
                  <span>Sex</span>
                  <span>Result</span>
                  <span>Score</span>
                  <span>Date</span>
                </div>
                {scans.map((scan) => {
                  const isNormal = scan.prediction.condition === "normal";
                  const confidence = Math.round(scan.prediction.confidence * 100);
                  return (
                    <div
                      key={scan.id}
                      className="grid grid-cols-[1fr,80px,60px,70px,80px,90px] gap-2 px-3 py-3 items-center border-b last:border-0 hover:bg-muted/30 transition-colors"
                    >
                      <div className="truncate">
                        <span className="text-sm text-foreground">{scan.patient?.name || "—"}</span>
                        {scan.patient?.eyeSide && (
                          <span className="text-[10px] text-muted-foreground ml-1 capitalize">({scan.patient.eyeSide})</span>
                        )}
                      </div>
                      <span className="text-sm text-muted-foreground">{scan.patient?.age || "—"}</span>
                      <span className="text-sm text-muted-foreground capitalize">{scan.patient?.gender?.charAt(0).toUpperCase() || "—"}</span>
                      <span className="flex items-center gap-1 text-xs">
                        {isNormal ? (
                          <CheckCircle className="h-3 w-3 text-success shrink-0" />
                        ) : (
                          <ShieldAlert className="h-3 w-3 text-warning shrink-0" />
                        )}
                        <span className={isNormal ? "text-success" : "text-warning"}>
                          {isNormal ? "OK" : "Cat."}
                        </span>
                      </span>
                      <span className="text-sm font-medium text-foreground tabular-nums">{confidence}%</span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(scan.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Account Settings */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Account Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <button className="w-full flex items-center justify-between px-3 py-3 rounded-md text-sm text-foreground hover:bg-muted/50 transition-colors">
              Change Password
              <span className="text-muted-foreground text-xs">Coming soon</span>
            </button>
            <Separator />
            <button className="w-full flex items-center justify-between px-3 py-3 rounded-md text-sm text-foreground hover:bg-muted/50 transition-colors">
              Update Email
              <span className="text-muted-foreground text-xs">Coming soon</span>
            </button>
            <Separator />
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-3 py-3 rounded-md text-sm text-destructive hover:bg-destructive/10 transition-colors"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </button>
          </CardContent>
        </Card>

        <p className="text-[11px] text-center text-muted-foreground">
          For educational purposes only. Not a substitute for professional medical advice.
        </p>
      </div>
    </div>
  );
}
