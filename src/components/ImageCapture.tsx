import { useRef, useState, useCallback } from "react";
import { Upload, X, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

interface ImageCaptureProps {
  onImageCaptured: (file: File) => void;
  instructions: string;
  disabled?: boolean;
}

export default function ImageCapture({ onImageCaptured, instructions, disabled }: ImageCaptureProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [capturedFile, setCapturedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    (file: File) => {
      setCapturedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target?.result as string);
      reader.readAsDataURL(file);
    },
    []
  );

  const handleSubmit = () => {
    if (capturedFile) onImageCaptured(capturedFile);
  };

  const reset = () => {
    setPreview(null);
    setCapturedFile(null);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl border-2 border-dashed border-border bg-muted/30 p-6 text-center">
        <p className="text-sm text-muted-foreground mb-4">{instructions}</p>

        <AnimatePresence mode="wait">
          {preview ? (
            <motion.div
              key="preview"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative mx-auto max-w-xs"
            >
              <img
                src={preview}
                alt="Captured"
                className="w-full rounded-lg shadow-lg"
              />
              <Button
                variant="destructive"
                size="icon"
                className="absolute -top-2 -right-2 h-8 w-8 rounded-full"
                onClick={reset}
              >
                <X className="h-4 w-4" />
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key="buttons"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col sm:flex-row gap-3 justify-center"
            >
              <Button
                variant="outline"
                className="gap-2"
                onClick={() => fileInputRef.current?.click()}
                disabled={disabled}
              >
                <Upload className="h-4 w-4" />
                Upload Image
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        />
      </div>

      {preview && (
        <div className="flex gap-3 justify-center">
          <Button variant="outline" onClick={reset} className="gap-2" disabled={disabled}>
            <RotateCcw className="h-4 w-4" />
            Retake
          </Button>
          <Button onClick={handleSubmit} className="gap-2" disabled={disabled}>
            Analyze Image
          </Button>
        </div>
      )}
    </div>
  );
}
