import { Link } from "react-router-dom";
import { Eye, Activity, ArrowRight, Shield, Zap, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

const features = [
  {
    icon: Eye,
    title: "Cataract Detection",
    description: "Analyze eye images to detect early signs of cataracts with AI-powered image classification.",
    path: "/cataract",
    color: "bg-accent/10 text-accent",
  },
];

const highlights = [
  { icon: Zap, label: "AI-Powered", desc: "Deep learning models for accurate screening" },
  { icon: Smartphone, label: "Mobile Ready", desc: "Capture images with your phone camera" },
  { icon: Shield, label: "Private", desc: "Images processed securely, never stored" },
];

export default function Index() {
  return (
    <div className="pb-20 md:pb-0">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="container relative py-20 md:py-28">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl mx-auto text-center space-y-6"
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
              <Activity className="h-4 w-4" />
              AI-Powered Medical Screening
            </div>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground">
              Smart Health
              <span className="text-primary"> Diagnostics</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-lg mx-auto">
              Screen for cataracts using your smartphone camera. Fast,
              non-invasive AI analysis powered by deep learning.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Detection Cards */}
      <section className="container -mt-4 space-y-6">
        <div className="grid gap-4 max-w-md mx-auto">
          {features.map((f, i) => (
            <motion.div
              key={f.path}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
            >
              <Link to={f.path}>
                <Card className="group relative overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1 cursor-pointer">
                  <CardContent className="p-6 space-y-4">
                    <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${f.color}`}>
                      <f.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-display text-lg font-semibold text-foreground">{f.title}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">{f.description}</p>
                    </div>
                    <Button variant="ghost" size="sm" className="gap-1 p-0 text-primary">
                      Start Scan <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Highlights */}
        <div className="grid gap-4 sm:grid-cols-3 max-w-2xl mx-auto pt-8">
          {highlights.map((h, i) => (
            <motion.div
              key={h.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.1 }}
              className="flex items-start gap-3 rounded-xl bg-card p-4 border"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <h.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-sm text-foreground">{h.label}</p>
                <p className="text-xs text-muted-foreground">{h.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
