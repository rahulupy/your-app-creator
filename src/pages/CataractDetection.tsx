import { useState } from "react";
import { Eye, Loader2 } from "lucide-react";
import ImageCapture from "@/components/ImageCapture";
import ResultCard from "@/components/ResultCard";
import { detectCataract, PredictionResult } from "@/lib/ml-api";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

export default function CataractDetection() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const { toast } = useToast();

  const handleAnalyze = async (file: File) => {
    setLoading(true);
    setResult(null);
    try {
      const prediction = await detectCataract(file);
      setResult(prediction);
    } catch {
      toast({
        title: "Analysis Failed",
        description: "Could not connect to the ML service. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container max-w-xl py-8 pb-24 md:pb-8 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2"
      >
        <div className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-3 py-1 text-sm font-medium text-accent">
          <Eye className="h-4 w-4" />
          Cataract Screening
        </div>
        <h1 className="font-display text-2xl font-bold text-foreground">
          Cataract Detection
        </h1>
        <p className="text-sm text-muted-foreground">
          Capture a clear, well-lit photo of the eye. For best results, use a macro
          lens or zoom in close to the eye.
        </p>
      </motion.div>

      <ImageCapture
        instructions="Take a close-up photo of the eye. Ensure the lens and pupil are clearly visible with even lighting."
        onImageCaptured={handleAnalyze}
        disabled={loading}
      />

      {loading && (
        <div className="flex flex-col items-center gap-3 py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground animate-pulse-gentle">
            Analyzing eye image…
          </p>
        </div>
      )}

      {result && <ResultCard result={result} type="cataract" />}
    </div>
  );
}
