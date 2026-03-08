import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Eye, Shield, Phone, UserCircle } from "lucide-react";
import mediscanLogo from "@/assets/mediscan-logo.png";

const navItems = [
  { path: "/", icon: Home, label: "Home" },
  { path: "/cataract", icon: Eye, label: "Eye Scan" },
  { path: "/profile", icon: UserCircle, label: "Profile" },
];

export default function AppLayout({ children }: { children: ReactNode }) {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Top bar */}
      <div className="bg-primary text-primary-foreground">
        <div className="container flex items-center justify-between h-8 text-xs">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Phone className="h-3 w-3" />
              Need help? Contact support
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-1">
            <Shield className="h-3 w-3" />
            <span>HIPAA-compliant screening</span>
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-card border-b shadow-sm">
        <div className="container flex h-14 items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <Eye className="h-4 w-4 text-primary-foreground" />
            </div>
            <div className="leading-none">
              <span className="font-display text-base font-bold text-foreground">
                MediScan
              </span>
              <span className="hidden sm:block text-[10px] text-muted-foreground leading-tight">
                AI Health Screening
              </span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const active = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    active
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 pb-16 md:pb-0">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-card border-t mb-14 md:mb-0">
        <div className="container py-6">
          <div className="grid gap-6 sm:grid-cols-3">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="h-6 w-6 rounded bg-primary flex items-center justify-center">
                  <Eye className="h-3 w-3 text-primary-foreground" />
                </div>
                <span className="font-display text-sm font-bold text-foreground">MediScan</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                AI-powered eye health screening for early detection.
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold text-foreground mb-2 uppercase tracking-wider">Quick Links</p>
              <div className="flex flex-col gap-1">
                <Link to="/" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Home</Link>
                <Link to="/cataract" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Eye Scan</Link>
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-foreground mb-2 uppercase tracking-wider">Disclaimer</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                For educational purposes only. Not a substitute for professional medical advice.
              </p>
            </div>
          </div>
          <div className="border-t mt-6 pt-4">
            <p className="text-[11px] text-muted-foreground text-center">
              © 2026 MediScan. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Mobile nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-card border-t shadow-[0_-2px_10px_rgba(0,0,0,0.06)]">
        <div className="flex items-center justify-around py-1.5">
          {navItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center gap-0.5 px-5 py-1.5 rounded-md text-[10px] font-medium transition-colors ${
                  active ? "text-primary" : "text-muted-foreground"
                }`}
              >
                <item.icon className={`h-5 w-5 ${active ? "stroke-[2.5]" : ""}`} />
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
