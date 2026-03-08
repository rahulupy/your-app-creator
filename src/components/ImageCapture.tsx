import { useRef, useState, useCallback } from "react";
import { Upload, X, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";

interface ImageCaptureProps {
  onImageCaptured: (file: File) => void;
  instructions: string;
  disabled?: boolean;
}

export default function ImageCapture({ onImageCaptured, instructions, disabled }: ImageCaptureProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [capturedFile, setCapturedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File) => {
    setCapturedFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(file);
  }, []);

  const handleSubmit = () => {
    if (capturedFile) onImageCaptured(capturedFile);
  };

  const reset = () => {
    setPreview(null);
    setCapturedFile(null);
  };

  return (
    <div className="space-y-4">
      <AnimatePresence mode="wait">
        {preview ? (
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            className="relative"
          >
            <div className="overflow-hidden rounded-xl border bg-card">
              <img
                src={preview}
                alt="Captured eye"
                className="w-full aspect-[4/3] object-cover"
              />
            </div>
            <button
              onClick={reset}
              className="absolute top-3 right-3 h-7 w-7 rounded-full bg-foreground/70 text-background flex items-center justify-center hover:bg-foreground/90 transition-colors"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </motion.div>
        ) : (
          <motion.button
            key="upload"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled}
            className="w-full rounded-xl border-2 border-dashed border-border hover:border-primary/40 bg-muted/30 hover:bg-accent/30 transition-colors py-16 flex flex-col items-center gap-3 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/15 transition-colors">
              <Upload className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Upload image</p>
              <p className="text-xs text-muted-foreground mt-0.5">{instructions}</p>
            </div>
          </motion.button>
        )}
      </AnimatePresence>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
      />

      {preview && (
        <div className="flex gap-3">
          <Button variant="outline" onClick={reset} className="flex-1 gap-2 rounded-full" disabled={disabled}>
            <RotateCcw className="h-3.5 w-3.5" />
            Retake
          </Button>
          <Button onClick={handleSubmit} className="flex-1 gap-2 rounded-full" disabled={disabled}>
            Analyze
          </Button>
        </div>
      )}
    </div>
  );
}
