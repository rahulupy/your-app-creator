import { Link } from "react-router-dom";
import { Eye, ArrowRight, ShieldCheck, Zap, Lock, Users, Star, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const services = [
  {
    icon: Eye,
    title: "Cataract Screening",
    description: "AI-powered eye analysis to detect early signs of cataracts from a simple photo.",
    path: "/cataract",
    tag: "Most Popular",
  },
];

const stats = [
  { value: "95%+", label: "Accuracy Rate" },
  { value: "10sec", label: "Analysis Time" },
  { value: "100%", label: "Privacy First" },
  { value: "Free", label: "To Use" },
];

const trustFeatures = [
  { icon: ShieldCheck, title: "Clinically Validated", desc: "Model trained on verified medical datasets" },
  { icon: Zap, title: "Instant Results", desc: "Get your screening results in under 10 seconds" },
  { icon: Lock, title: "100% Private", desc: "Your images are never stored or shared" },
  { icon: Users, title: "Expert Reviewed", desc: "Built in consultation with ophthalmologists" },
];

const steps = [
  { num: "1", title: "Upload Photo", desc: "Take or upload a clear, close-up photo of the eye" },
  { num: "2", title: "AI Analysis", desc: "Our deep learning model analyzes the image in seconds" },
  { num: "3", title: "Get Results", desc: "Receive a detailed report with confidence scores" },
];

export default function Index() {
  return (
    <div>
      {/* Hero Banner */}
      <section className="bg-gradient-to-br from-primary/5 via-accent/30 to-background border-b">
        <div className="container py-12 md:py-20">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-1.5 bg-primary/10 text-primary text-xs font-semibold px-3 py-1 rounded-full mb-4">
              <Star className="h-3 w-3 fill-primary" />
              Trusted AI Health Platform
            </div>
            <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-extrabold text-foreground leading-tight">
              Professional Eye Health
              <br />
              <span className="text-primary">Screening at Home</span>
            </h1>
            <p className="mt-4 text-muted-foreground text-base md:text-lg leading-relaxed max-w-lg">
              Screen for cataracts using just your smartphone. Fast, accurate, and completely private AI-powered analysis.
            </p>
            <div className="flex flex-wrap items-center gap-3 mt-6">
              <Button asChild size="lg" className="gap-2 shadow-md">
                <Link to="/cataract">
                  Start Free Scan
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <a href="#how-it-works">How it works</a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="border-b bg-card">
        <div className="container py-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((s) => (
              <div key={s.label} className="text-center py-2">
                <p className="font-display text-xl md:text-2xl font-bold text-primary">{s.value}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="container py-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-lg md:text-xl font-bold text-foreground">Our Services</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <Link key={s.path} to={s.path}>
              <Card className="group hover:shadow-md transition-all hover:border-primary/30 cursor-pointer h-full">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="h-10 w-10 rounded-lg bg-accent flex items-center justify-center">
                      <s.icon className="h-5 w-5 text-accent-foreground" />
                    </div>
                    {s.tag && (
                      <span className="text-[10px] font-semibold bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                        {s.tag}
                      </span>
                    )}
                  </div>
                  <h3 className="font-display text-base font-bold text-foreground">{s.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">{s.description}</p>
                  <div className="flex items-center gap-1 text-primary text-sm font-medium mt-4 group-hover:gap-2 transition-all">
                    Start Scan <ChevronRight className="h-4 w-4" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="bg-card border-y">
        <div className="container py-10">
          <h2 className="font-display text-lg md:text-xl font-bold text-foreground mb-8">How It Works</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {steps.map((step, i) => (
              <div key={step.num} className="flex gap-4">
                <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold shrink-0">
                  {step.num}
                </div>
                <div>
                  <h3 className="font-display text-sm font-bold text-foreground">{step.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Features */}
      <section className="container py-10">
        <h2 className="font-display text-lg md:text-xl font-bold text-foreground mb-6">Why Choose MediScan</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {trustFeatures.map((f) => (
            <div key={f.title} className="rounded-lg border bg-card p-4">
              <f.icon className="h-5 w-5 text-primary mb-3" />
              <h3 className="text-sm font-semibold text-foreground">{f.title}</h3>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary">
        <div className="container py-10 text-center">
          <h2 className="font-display text-xl md:text-2xl font-bold text-primary-foreground">
            Ready to check your eye health?
          </h2>
          <p className="text-primary-foreground/80 text-sm mt-2 max-w-md mx-auto">
            It takes less than a minute. Upload a photo and get instant AI-powered results.
          </p>
          <Button asChild size="lg" variant="secondary" className="mt-6 gap-2 shadow-lg">
            <Link to="/cataract">
              Start Free Scan
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
