import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Eye, Phone, UserCircle } from "lucide-react";
import { motion } from "framer-motion";
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
      {/* Announcement bar */}
      <div className="bg-primary/10 border-b border-primary/20">
        <div className="container flex items-center justify-center h-8 text-xs text-primary font-medium tracking-wide">
          <Phone className="h-3 w-3 mr-1.5" />
          AI-Powered Health Screening — HIPAA Compliant
        </div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 glass-strong">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="relative">
              <img src={mediscanLogo} alt="MediScan Logo" className="h-10 w-10 object-contain relative z-10" />
              <div className="absolute inset-0 rounded-full bg-primary/20 blur-lg group-hover:bg-primary/30 transition-colors" />
            </div>
            <div className="leading-none">
              <span className="font-display text-lg font-bold text-foreground tracking-tight">
                Medi<span className="gradient-text">Scan</span>
              </span>
              <span className="hidden sm:block text-[10px] text-muted-foreground leading-tight tracking-wider uppercase">
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
                  className={`relative flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                    active
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {active && (
                    <motion.div
                      layoutId="nav-active"
                      className="absolute inset-0 bg-primary/10 rounded-xl border border-primary/20"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                    />
                  )}
                  <item.icon className="h-4 w-4 relative z-10" />
                  <span className="relative z-10">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 pb-20 md:pb-0">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          {children}
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-card/50 backdrop-blur-sm mb-16 md:mb-0">
        <div className="container py-8">
          <div className="grid gap-8 sm:grid-cols-3">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <img src={mediscanLogo} alt="MediScan" className="h-7 w-7 object-contain" />
                <span className="font-display text-sm font-bold text-foreground tracking-tight">
                  Medi<span className="gradient-text">Scan</span>
                </span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed max-w-xs">
                Next-generation AI-powered eye health screening for early detection and peace of mind.
              </p>
            </div>
            <div>
              <p className="text-[10px] font-semibold text-foreground mb-3 uppercase tracking-[0.15em]">Quick Links</p>
              <div className="flex flex-col gap-1.5">
                <Link to="/" className="text-xs text-muted-foreground hover:text-primary transition-colors">Home</Link>
                <Link to="/cataract" className="text-xs text-muted-foreground hover:text-primary transition-colors">Eye Scan</Link>
                <Link to="/profile" className="text-xs text-muted-foreground hover:text-primary transition-colors">Profile</Link>
              </div>
            </div>
            <div>
              <p className="text-[10px] font-semibold text-foreground mb-3 uppercase tracking-[0.15em]">Disclaimer</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                For educational purposes only. Not a substitute for professional medical advice or diagnosis.
              </p>
            </div>
          </div>
          <div className="border-t mt-6 pt-4">
            <p className="text-[11px] text-muted-foreground text-center tracking-wide">
              © 2026 MediScan. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Mobile nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 glass-strong shadow-[0_-4px_30px_rgba(0,0,0,0.08)]">
        <div className="flex items-center justify-around py-2">
          {navItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`relative flex flex-col items-center gap-0.5 px-6 py-2 rounded-xl text-[10px] font-medium transition-all ${
                  active ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {active && (
                  <motion.div
                    layoutId="mobile-nav-active"
                    className="absolute inset-0 bg-primary/10 rounded-xl"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                  />
                )}
                <item.icon className={`h-5 w-5 relative z-10 ${active ? "stroke-[2.5]" : ""}`} />
                <span className="relative z-10">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
