import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function Index() {
  return (
    <div className="pb-10">
      {/* Hero */}
      <section className="container pt-16 md:pt-24 pb-12">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="max-w-lg"
        >
          <p className="text-sm font-medium text-primary mb-4 tracking-wide uppercase">
            AI-powered screening
          </p>
          <h1 className="font-display text-4xl md:text-5xl font-semibold text-foreground leading-[1.1] text-balance">
            Eye health,{" "}
            <span className="italic text-primary">simplified.</span>
          </h1>
          <p className="mt-5 text-muted-foreground leading-relaxed max-w-md">
            Take a photo with your phone. Our model analyzes it for early signs of cataracts — 
            no clinic visit needed for an initial check.
          </p>
          <div className="mt-8">
            <Button asChild size="lg" className="gap-2 rounded-full px-6">
              <Link to="/cataract">
                Start scanning
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </motion.div>
      </section>

      {/* How it works */}
      <section className="container py-12">
        <h2 className="font-display text-xl font-semibold text-foreground mb-8">
          How it works
        </h2>
        <div className="grid gap-6 sm:grid-cols-3">
          {[
            { step: "01", title: "Capture", desc: "Take a close-up photo of the eye with your phone camera." },
            { step: "02", title: "Analyze", desc: "Our deep learning model processes the image in seconds." },
            { step: "03", title: "Results", desc: "Get a confidence score and severity assessment instantly." },
          ].map((item, i) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 * i, duration: 0.5 }}
              className="group"
            >
              <span className="text-xs font-mono text-muted-foreground">{item.step}</span>
              <h3 className="font-display text-lg font-semibold text-foreground mt-1">
                {item.title}
              </h3>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Trust strip */}
      <section className="container py-8">
        <div className="rounded-xl bg-accent/50 border border-accent px-6 py-5">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8">
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">Your privacy matters</p>
              <p className="text-sm text-muted-foreground mt-1">
                Images are processed in real-time and never stored on our servers.
              </p>
            </div>
            <Button asChild variant="outline" size="sm" className="rounded-full shrink-0 w-fit">
              <Link to="/cataract">Try it now</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
