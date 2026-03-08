import { useRef, useState, useCallback } from "react";
import { Upload, X, RotateCcw, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImageCaptureProps {
  onImageCaptured: (file: File) => void;
  instructions: string;
  disabled?: boolean;
}

export default function ImageCapture({ onImageCaptured, instructions, disabled }: ImageCaptureProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [capturedFile, setCapturedFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
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

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) handleFile(file);
  };

  return (
    <div className="space-y-3">
      {preview ? (
        <div className="relative rounded-lg border bg-card overflow-hidden">
          <img
            src={preview}
            alt="Eye photo"
            className="w-full aspect-[4/3] object-cover"
          />
          <button
            onClick={reset}
            className="absolute top-2 right-2 h-7 w-7 rounded-full bg-foreground/60 text-background flex items-center justify-center hover:bg-foreground/80 transition-colors"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ) : (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`rounded-lg border-2 border-dashed cursor-pointer transition-colors py-12 flex flex-col items-center gap-3 ${
            dragOver
              ? "border-primary bg-accent/50"
              : "border-border bg-card hover:border-primary/40 hover:bg-accent/20"
          } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          <div className="h-12 w-12 rounded-full bg-accent flex items-center justify-center">
            <Camera className="h-5 w-5 text-accent-foreground" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-foreground">
              Click to upload or drag & drop
            </p>
            <p className="text-xs text-muted-foreground mt-1">{instructions}</p>
          </div>
          <p className="text-[10px] text-muted-foreground">PNG, JPG up to 10MB</p>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
      />

      {preview && (
        <div className="flex gap-2">
          <Button variant="outline" onClick={reset} size="sm" className="flex-1 gap-1.5" disabled={disabled}>
            <RotateCcw className="h-3.5 w-3.5" />
            Retake
          </Button>
          <Button onClick={handleSubmit} size="sm" className="flex-1 gap-1.5" disabled={disabled}>
            <Upload className="h-3.5 w-3.5" />
            Analyze Image
          </Button>
        </div>
      )}
    </div>
  );
}
