import { PredictionResult } from "@/lib/ml-api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle, ShieldAlert } from "lucide-react";
import { motion } from "framer-motion";

interface ResultCardProps {
  result: PredictionResult;
  type: "cataract" | "anemia";
}

function getSeverityColor(severity?: string) {
  switch (severity) {
    case "mild":
      return "bg-warning/15 text-warning border-warning/30";
    case "moderate":
      return "bg-accent/15 text-accent border-accent/30";
    case "severe":
      return "bg-destructive/15 text-destructive border-destructive/30";
    default:
      return "bg-muted text-muted-foreground";
  }
}

function getConditionIcon(condition: string) {
  if (condition === "normal") return <CheckCircle className="h-6 w-6 text-success" />;
  return <ShieldAlert className="h-6 w-6 text-warning" />;
}

export default function ResultCard({ result, type }: ResultCardProps) {
  const confidencePercent = Math.round(result.confidence * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="overflow-hidden">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {getConditionIcon(result.condition)}
              <CardTitle className="font-display text-lg capitalize">
                {result.condition === "normal"
                  ? "No Condition Detected"
                  : `${type === "cataract" ? "Cataract" : "Anemia"} Detected`}
              </CardTitle>
            </div>
            {result.severity && (
              <Badge
                variant="outline"
                className={`capitalize ${getSeverityColor(result.severity)}`}
              >
                {result.severity}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Confidence */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Confidence</span>
              <span className="font-semibold text-foreground">{confidencePercent}%</span>
            </div>
            <Progress value={confidencePercent} className="h-2" />
          </div>

          {/* Description */}
          <div className="rounded-lg bg-muted/50 p-4">
            <p className="text-sm leading-relaxed text-foreground">{result.description}</p>
          </div>

          {/* Low confidence warning */}
          {result.confidence < 0.6 && (
            <div className="flex items-start gap-2 rounded-lg bg-warning/10 p-3">
              <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5 text-warning" />
              <p className="text-xs text-warning">
                Low confidence result. Please retake the image with better lighting and focus.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
