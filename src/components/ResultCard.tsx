import { PredictionResult } from "@/lib/ml-api";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, CheckCircle, ShieldAlert, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ResultCardProps {
  result: PredictionResult;
  type: "cataract" | "anemia";
}

export default function ResultCard({ result, type }: ResultCardProps) {
  const confidencePercent = Math.round(result.confidence * 100);
  const isNormal = result.condition === "normal";
  const label = type === "cataract" ? "Cataract" : "Anemia";

  return (
    <div className="rounded-lg border bg-card overflow-hidden">
      {/* Status header */}
      <div className={`px-4 py-3 flex items-center gap-2.5 ${
        isNormal ? "bg-success/10 border-b border-success/20" : "bg-warning/10 border-b border-warning/20"
      }`}>
        {isNormal ? (
          <CheckCircle className="h-5 w-5 text-success shrink-0" />
        ) : (
          <ShieldAlert className="h-5 w-5 text-warning shrink-0" />
        )}
        <div className="flex-1">
          <p className="text-sm font-semibold text-foreground">
            {isNormal ? "No Signs Detected" : `${label} Detected`}
          </p>
          {result.severity && (
            <p className="text-xs text-muted-foreground capitalize">
              Severity Level: {result.severity}
            </p>
          )}
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Confidence */}
        <div>
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-muted-foreground">Confidence Score</span>
            <span className="font-semibold text-foreground tabular-nums">{confidencePercent}%</span>
          </div>
          <Progress value={confidencePercent} className="h-2" />
        </div>

        {/* Description */}
        <div className="rounded-md bg-muted/50 p-3">
          <p className="text-sm text-foreground leading-relaxed">{result.description}</p>
        </div>

        {/* Low confidence warning */}
        {result.confidence < 0.6 && (
          <div className="flex items-start gap-2 rounded-md bg-warning/10 border border-warning/20 p-3">
            <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5 text-warning" />
            <p className="text-xs text-warning-foreground">
              Low confidence result. Please retake the image with better lighting and focus for more accurate results.
            </p>
          </div>
        )}

        {/* Action */}
        <div className="pt-1">
          <p className="text-[11px] text-muted-foreground">
            This is a preliminary screening result. Please consult an ophthalmologist for a comprehensive eye examination.
          </p>
        </div>
      </div>
    </div>
  );
}
