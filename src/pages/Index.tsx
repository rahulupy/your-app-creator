import { Link } from "react-router-dom";
import { Eye, ArrowRight, ShieldCheck, Zap, Lock, Users, Star, ChevronRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

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
  { value: "10s", label: "Analysis Time" },
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
  { num: "01", title: "Upload Photo", desc: "Take or upload a clear, close-up photo of the eye" },
  { num: "02", title: "AI Analysis", desc: "Our deep learning model analyzes the image in seconds" },
  { num: "03", title: "Get Results", desc: "Receive a detailed report with confidence scores" },
];

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: "easeOut" },
};

const stagger = {
  animate: { transition: { staggerChildren: 0.1 } },
};

export default function Index() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b">
        {/* Background effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/20 to-background" />
        <div className="absolute top-20 right-20 w-72 h-72 bg-primary/10 rounded-full blur-[100px] animate-float" />
        <div className="absolute bottom-10 left-10 w-48 h-48 bg-primary/5 rounded-full blur-[80px]" />

        <div className="container relative py-16 md:py-24">
          <motion.div className="max-w-2xl" {...fadeUp}>
            <motion.div
              className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 mb-6"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
            >
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              <span className="text-xs font-semibold text-foreground tracking-wide">AI-Powered Health Platform</span>
            </motion.div>

            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-[1.1] tracking-tight">
              Professional Eye
              <br />
              Health <span className="gradient-text">Screening</span>
            </h1>

            <p className="mt-5 text-muted-foreground text-base md:text-lg leading-relaxed max-w-lg">
              Screen for cataracts using just your smartphone. Fast, accurate, and completely private AI-powered analysis.
            </p>

            <div className="flex flex-wrap items-center gap-3 mt-8">
              <Button asChild size="lg" className="gap-2 glow-sm hover:glow-md transition-shadow rounded-xl h-12 px-6 text-base">
                <Link to="/cataract">
                  Start Free Scan
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-xl h-12 px-6">
                <a href="#how-it-works">How it works</a>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container py-6">
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
            variants={stagger}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {stats.map((s) => (
              <motion.div key={s.label} variants={fadeUp} className="text-center">
                <p className="font-display text-2xl md:text-3xl font-bold gradient-text">{s.value}</p>
                <p className="text-xs text-muted-foreground mt-1 tracking-wide uppercase">{s.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Services */}
      <section className="container py-14">
        <motion.div {...fadeUp} viewport={{ once: true }} whileInView="animate" initial="initial">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground tracking-tight mb-8">
            Our Services
          </h2>
        </motion.div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <motion.div key={s.path} {...fadeUp} viewport={{ once: true }} whileInView="animate" initial="initial">
              <Link to={s.path}>
                <Card className="group hover:glow-sm transition-all duration-300 hover:border-primary/30 cursor-pointer h-full overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                        <s.icon className="h-6 w-6 text-primary" />
                      </div>
                      {s.tag && (
                        <span className="text-[10px] font-bold bg-primary/10 text-primary px-3 py-1 rounded-full tracking-wide uppercase">
                          {s.tag}
                        </span>
                      )}
                    </div>
                    <h3 className="font-display text-lg font-bold text-foreground">{s.title}</h3>
                    <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{s.description}</p>
                    <div className="flex items-center gap-1.5 text-primary text-sm font-semibold mt-5 group-hover:gap-3 transition-all">
                      Start Scan <ChevronRight className="h-4 w-4" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="border-y bg-card/30">
        <div className="container py-14">
          <motion.h2 {...fadeUp} viewport={{ once: true }} whileInView="animate" initial="initial" className="font-display text-2xl md:text-3xl font-bold text-foreground tracking-tight mb-10">
            How It Works
          </motion.h2>
          <motion.div
            className="grid gap-8 md:grid-cols-3"
            variants={stagger}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {steps.map((step) => (
              <motion.div key={step.num} variants={fadeUp} className="flex gap-5 items-start">
                <div className="h-12 w-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                  <span className="font-display text-sm font-bold gradient-text">{step.num}</span>
                </div>
                <div>
                  <h3 className="font-display text-base font-bold text-foreground">{step.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Trust Features */}
      <section className="container py-14">
        <motion.h2 {...fadeUp} viewport={{ once: true }} whileInView="animate" initial="initial" className="font-display text-2xl md:text-3xl font-bold text-foreground tracking-tight mb-8">
          Why Choose MediScan
        </motion.h2>
        <motion.div
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
          variants={stagger}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          {trustFeatures.map((f) => (
            <motion.div
              key={f.title}
              variants={fadeUp}
              className="rounded-2xl border bg-card p-5 hover:glow-sm transition-all duration-300 group"
            >
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/15 transition-colors">
                <f.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-sm font-bold text-foreground">{f.title}</h3>
              <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary-glow opacity-90" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.15),transparent_60%)]" />
        <div className="container relative py-14 text-center">
          <motion.div {...fadeUp} viewport={{ once: true }} whileInView="animate" initial="initial">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-primary-foreground tracking-tight">
              Ready to check your eye health?
            </h2>
            <p className="text-primary-foreground/80 text-sm md:text-base mt-3 max-w-md mx-auto">
              It takes less than a minute. Upload a photo and get instant AI-powered results.
            </p>
            <Button asChild size="lg" variant="secondary" className="mt-8 gap-2 shadow-lg rounded-xl h-12 px-8 text-base font-semibold">
              <Link to="/cataract">
                Start Free Scan
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
