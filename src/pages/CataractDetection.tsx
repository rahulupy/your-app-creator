import { useState } from "react";
import { Loader2, ArrowLeft, Info } from "lucide-react";
import { Link } from "react-router-dom";
import ImageCapture from "@/components/ImageCapture";
import ResultCard from "@/components/ResultCard";
import { detectCataract, PredictionResult } from "@/lib/ml-api";
import { useToast } from "@/hooks/use-toast";

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
        title: "Connection Error",
        description: "Could not reach the analysis service. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Breadcrumb */}
      <div className="border-b bg-card">
        <div className="container py-3">
          <div className="flex items-center gap-2 text-sm">
            <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
              <ArrowLeft className="h-3.5 w-3.5" />
              Home
            </Link>
            <span className="text-muted-foreground">/</span>
            <span className="text-foreground font-medium">Cataract Screening</span>
          </div>
        </div>
      </div>

      <div className="container max-w-2xl py-8 pb-24 md:pb-8">
        <div className="grid gap-6 md:grid-cols-[1fr,280px]">
          {/* Main content */}
          <div className="space-y-6">
            <div>
              <h1 className="font-display text-xl md:text-2xl font-bold text-foreground">
                Cataract Screening
              </h1>
              <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">
                Upload a clear, close-up photo of the eye for AI-powered analysis.
              </p>
            </div>

            <ImageCapture
              instructions="Ensure the pupil is clearly visible with even lighting"
              onImageCaptured={handleAnalyze}
              disabled={loading}
            />

            {loading && (
              <div className="flex items-center gap-3 py-8 justify-center border rounded-lg bg-card">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">Analyzing image…</p>
              </div>
            )}

            {result && <ResultCard result={result} type="cataract" />}
          </div>

          {/* Sidebar tips */}
          <div className="hidden md:block space-y-4">
            <div className="rounded-lg border bg-card p-4">
              <div className="flex items-center gap-2 mb-3">
                <Info className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-semibold text-foreground">Tips for Best Results</h3>
              </div>
              <ul className="space-y-2.5">
                {[
                  "Use natural or bright lighting",
                  "Hold the camera 10-15cm from the eye",
                  "Keep the eye fully open",
                  "Avoid flash photography",
                  "Ensure the image is in focus",
                ].map((tip) => (
                  <li key={tip} className="flex items-start gap-2 text-xs text-muted-foreground">
                    <span className="h-1 w-1 rounded-full bg-primary mt-1.5 shrink-0" />
                    {tip}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-lg border bg-accent/50 p-4">
              <p className="text-xs text-muted-foreground leading-relaxed">
                <strong className="text-foreground">Note:</strong> This screening is for informational purposes 
                and does not replace a professional eye examination.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
