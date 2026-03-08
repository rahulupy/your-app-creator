import { useState } from "react";
import { Heart, Loader2 } from "lucide-react";
import ImageCapture from "@/components/ImageCapture";
import ResultCard from "@/components/ResultCard";
import { detectAnemia, PredictionResult } from "@/lib/ml-api";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

export default function AnemiaDetection() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const { toast } = useToast();

  const handleAnalyze = async (file: File) => {
    setLoading(true);
    setResult(null);
    try {
      const prediction = await detectAnemia(file);
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
        <div className="inline-flex items-center gap-2 rounded-full bg-destructive/10 px-3 py-1 text-sm font-medium text-destructive">
          <Heart className="h-4 w-4" />
          Anemia Screening
        </div>
        <h1 className="font-display text-2xl font-bold text-foreground">
          Anemia Detection
        </h1>
        <p className="text-sm text-muted-foreground">
          Gently pull down your lower eyelid to expose the palpebral conjunctiva
          (inner surface). Capture a clear photo in natural lighting.
        </p>
      </motion.div>

      <ImageCapture
        instructions="Pull down the lower eyelid and photograph the inner surface (conjunctiva). Use natural, even lighting for best results."
        onImageCaptured={handleAnalyze}
        disabled={loading}
      />

      {loading && (
        <div className="flex flex-col items-center gap-3 py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground animate-pulse-gentle">
            Analyzing conjunctival image…
          </p>
        </div>
      )}

      {result && <ResultCard result={result} type="anemia" />}
    </div>
  );
}
