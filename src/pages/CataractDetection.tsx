import { useState } from "react";
import { Loader2 } from "lucide-react";
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
        title: "Something went wrong",
        description: "Couldn't reach the analysis service. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container max-w-lg py-10 pb-24 md:pb-10 space-y-8">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <p className="text-sm font-medium text-primary tracking-wide uppercase mb-2">
          Cataract screening
        </p>
        <h1 className="font-display text-2xl md:text-3xl font-semibold text-foreground">
          Scan your eye
        </h1>
        <p className="text-sm text-muted-foreground mt-2 leading-relaxed max-w-sm">
          Upload a clear, close-up photo of the eye. Make sure the pupil is visible and the lighting is even.
        </p>
      </motion.div>

      <ImageCapture
        instructions="Tap below to upload a photo. A well-lit, focused image gives the best results."
        onImageCaptured={handleAnalyze}
        disabled={loading}
      />

      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-3 py-6 justify-center"
        >
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Analyzing…</p>
        </motion.div>
      )}

      {result && <ResultCard result={result} type="cataract" />}
    </div>
  );
}
