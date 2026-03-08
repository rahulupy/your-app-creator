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
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="rounded-xl border bg-card p-6 space-y-5"
    >
      {/* Status */}
      <div className="flex items-start gap-3">
        {isNormal ? (
          <CheckCircle className="h-5 w-5 text-success mt-0.5 shrink-0" />
        ) : (
          <ShieldAlert className="h-5 w-5 text-warning mt-0.5 shrink-0" />
        )}
        <div>
          <p className="font-display text-lg font-semibold text-foreground">
            {isNormal ? "No signs detected" : `${label} detected`}
          </p>
          {result.severity && (
            <p className="text-sm text-muted-foreground capitalize mt-0.5">
              Severity: {result.severity}
            </p>
          )}
        </div>
      </div>

      {/* Confidence */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Confidence</span>
          <span className="font-medium text-foreground tabular-nums">{confidencePercent}%</span>
        </div>
        <Progress value={confidencePercent} className="h-1.5" />
      </div>

      {/* Description */}
      <p className="text-sm text-muted-foreground leading-relaxed">
        {result.description}
      </p>

      {/* Low confidence warning */}
      {result.confidence < 0.6 && (
        <div className="flex items-start gap-2 rounded-lg bg-warning/10 border border-warning/20 p-3">
          <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5 text-warning" />
          <p className="text-xs text-warning-foreground">
            Low confidence — try retaking the image with better lighting and focus.
          </p>
        </div>
      )}
    </motion.div>
  );
}
