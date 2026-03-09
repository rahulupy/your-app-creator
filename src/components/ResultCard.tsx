import { PredictionResult } from "@/lib/ml-api";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, CheckCircle, ShieldAlert } from "lucide-react";
import { motion } from "framer-motion";

interface ResultCardProps {
  result: PredictionResult;
  type: "cataract" | "anemia";
}

export default function ResultCard({ result, type }: ResultCardProps) {
  const confidencePercent = Math.round(result.confidence * 100);
  const isNormal = result.condition === "normal";
  const label = type === "cataract" ? "Cataract" : "Anemia";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 12 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="rounded-2xl border bg-card overflow-hidden premium-shadow"
    >
      {/* Status header */}
      <div className={`px-5 py-4 flex items-center gap-3 ${
        isNormal
          ? "bg-success/10 border-b border-success/20"
          : "bg-warning/10 border-b border-warning/20"
      }`}>
        {isNormal ? (
          <div className="h-10 w-10 rounded-xl bg-success/20 flex items-center justify-center">
            <CheckCircle className="h-5 w-5 text-success" />
          </div>
        ) : (
          <div className="h-10 w-10 rounded-xl bg-warning/20 flex items-center justify-center animate-glow-pulse">
            <ShieldAlert className="h-5 w-5 text-warning" />
          </div>
        )}
        <div className="flex-1">
          <p className="text-base font-bold text-foreground">
            {isNormal ? "No Signs Detected" : `${label} Detected`}
          </p>
          {result.severity && (
            <p className="text-xs text-muted-foreground capitalize mt-0.5">
              Severity Level: {result.severity}
            </p>
          )}
        </div>
      </div>

      <div className="p-5 space-y-4">
        {/* Confidence */}
        <div>
          <div className="flex items-center justify-between text-sm mb-2.5">
            <span className="text-muted-foreground font-medium">Confidence Score</span>
            <span className="font-display font-bold text-foreground text-lg tabular-nums">{confidencePercent}%</span>
          </div>
          <div className="relative">
            <Progress value={confidencePercent} className="h-2.5 rounded-full" />
          </div>
        </div>

        {/* Description */}
        <div className="rounded-xl bg-muted/50 border border-border/50 p-4">
          <p className="text-sm text-foreground leading-relaxed">{result.description}</p>
        </div>

        {/* Low confidence warning */}
        {result.confidence < 0.6 && (
          <div className="flex items-start gap-2.5 rounded-xl bg-warning/10 border border-warning/20 p-4">
            <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5 text-warning" />
            <p className="text-xs text-warning-foreground leading-relaxed">
              Low confidence result. Please retake the image with better lighting and focus for more accurate results.
            </p>
          </div>
        )}

        {/* Action */}
        <div className="pt-1">
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            This is a preliminary screening result. Please consult an ophthalmologist for a comprehensive eye examination.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
