import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Eye } from "lucide-react";

const navItems = [
  { path: "/", icon: Home, label: "Home" },
  { path: "/cataract", icon: Eye, label: "Scan" },
];

export default function AppLayout({ children }: { children: ReactNode }) {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-lg">
        <div className="container flex h-14 items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <span className="font-display text-lg font-semibold text-foreground">
              medi<span className="text-primary">scan</span>
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => {
              const active = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`text-sm font-medium transition-colors ${
                    active
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
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
      <footer className="border-t mb-14 md:mb-0">
        <div className="container py-6">
          <p className="text-xs text-muted-foreground leading-relaxed max-w-lg">
            This tool is for educational purposes only and does not replace professional medical advice. 
            Always consult a qualified healthcare provider.
          </p>
        </div>
      </footer>

      {/* Mobile nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t bg-background/90 backdrop-blur-lg">
        <div className="flex items-center justify-around py-2.5">
          {navItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center gap-0.5 text-[11px] font-medium transition-colors ${
                  active ? "text-primary" : "text-muted-foreground"
                }`}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
