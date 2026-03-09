import { useRef, useState, useCallback } from "react";
import { Upload, X, RotateCcw, Camera, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";

interface ImageCaptureProps {
  onImageCaptured: (file: File) => void;
  instructions: string;
  disabled?: boolean;
}

export default function ImageCapture({ onImageCaptured, instructions, disabled }: ImageCaptureProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [capturedFile, setCapturedFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [showPermissionDialog, setShowPermissionDialog] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const handleFile = useCallback((file: File) => {
    setCapturedFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(file);
  }, []);

  const handleSubmit = () => { if (capturedFile) onImageCaptured(capturedFile); };
  const reset = () => { setPreview(null); setCapturedFile(null); };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) handleFile(file);
  };

  const requestCameraPermission = () => setShowPermissionDialog(true);

  const startCamera = async () => {
    setShowPermissionDialog(false); setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 960 } },
      });
      streamRef.current = stream; setCameraActive(true);
      setTimeout(() => {
        if (videoRef.current) { videoRef.current.srcObject = stream; videoRef.current.play(); }
      }, 100);
    } catch (err: any) {
      if (err.name === "NotAllowedError") setCameraError("Camera access was denied. Please allow camera access in your browser settings.");
      else if (err.name === "NotFoundError") setCameraError("No camera found. Please use the upload option.");
      else setCameraError("Could not access camera. Please use the upload option.");
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const vw = videoRef.current.videoWidth, vh = videoRef.current.videoHeight;
    const cropSize = Math.min(vw, vh) * 0.55;
    const cx = (vw - cropSize) / 2, cy = (vh - cropSize) / 2;
    const canvas = document.createElement("canvas");
    canvas.width = cropSize; canvas.height = cropSize;
    const ctx = canvas.getContext("2d"); if (!ctx) return;
    ctx.drawImage(videoRef.current, cx, cy, cropSize, cropSize, 0, 0, cropSize, cropSize);
    canvas.toBlob((blob) => {
      if (blob) { handleFile(new File([blob], "eye-capture.jpg", { type: "image/jpeg" })); stopCamera(); }
    }, "image/jpeg", 0.92);
  };

  const stopCamera = () => {
    if (streamRef.current) { streamRef.current.getTracks().forEach((t) => t.stop()); streamRef.current = null; }
    setCameraActive(false);
  };

  return (
    <div className="space-y-3">
      <Dialog open={showPermissionDialog} onOpenChange={setShowPermissionDialog}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 font-display">
              <Video className="h-5 w-5 text-primary" />
              Camera Access Required
            </DialogTitle>
            <DialogDescription className="text-left leading-relaxed">
              MediScan needs access to your camera to take a photo of your eye for analysis. Your camera feed is only used locally.
            </DialogDescription>
          </DialogHeader>
          <div className="rounded-xl bg-accent/30 border border-accent/50 p-3">
            <p className="text-xs text-muted-foreground leading-relaxed">
              <strong className="text-foreground">Privacy:</strong> The photo will be sent securely to our AI model. No images are saved after processing.
            </p>
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setShowPermissionDialog(false)} className="flex-1 rounded-xl">Cancel</Button>
            <Button onClick={startCamera} className="flex-1 gap-1.5 rounded-xl glow-sm">
              <Camera className="h-4 w-4" /> Allow Camera
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {cameraError && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-3">
          <p className="text-sm text-destructive">{cameraError}</p>
        </div>
      )}

      {cameraActive && !preview && (
        <div className="space-y-3">
          <div className="relative rounded-2xl border bg-foreground overflow-hidden">
            <video ref={videoRef} autoPlay playsInline muted className="w-full aspect-[4/3] object-cover" />
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute inset-0" style={{ background: "radial-gradient(circle 28% at 50% 45%, transparent 98%, rgba(0,0,0,0.55) 100%)" }} />
              <div className="absolute inset-0 flex items-center justify-center" style={{ paddingBottom: "10%" }}>
                <div className="rounded-full border-2 border-dashed border-primary/80 animate-glow-pulse" style={{ width: "55%", aspectRatio: "1" }} />
              </div>
              <div className="absolute top-3 left-0 right-0 flex justify-center">
                <span className="glass text-foreground text-[10px] font-medium px-3 py-1.5 rounded-full">
                  Position eye inside the circle
                </span>
              </div>
            </div>
            <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-3">
              <Button variant="outline" size="sm" onClick={stopCamera} className="glass rounded-xl">Cancel</Button>
              <Button size="sm" onClick={capturePhoto} className="gap-1.5 rounded-xl glow-sm">
                <Camera className="h-4 w-4" /> Capture
              </Button>
            </div>
          </div>
        </div>
      )}

      <AnimatePresence>
        {preview && !cameraActive && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative rounded-2xl border bg-card overflow-hidden premium-shadow"
          >
            <img src={preview} alt="Eye photo" className="w-full aspect-[4/3] object-cover" />
            <button
              onClick={reset}
              className="absolute top-3 right-3 h-8 w-8 rounded-xl glass flex items-center justify-center hover:bg-card/90 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {!preview && !cameraActive && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`rounded-2xl border-2 border-dashed transition-all py-12 flex flex-col items-center gap-5 ${
            dragOver ? "border-primary bg-primary/5 glow-sm" : "border-border bg-card/50"
          } ${disabled ? "opacity-50 pointer-events-none" : ""}`}
        >
          <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Camera className="h-6 w-6 text-primary" />
          </div>
          <p className="text-xs text-muted-foreground text-center px-4">{instructions}</p>
          <div className="flex flex-col sm:flex-row gap-2 w-full px-6 sm:px-0 sm:w-auto">
            <Button variant="default" size="sm" className="gap-1.5 rounded-xl glow-sm" onClick={requestCameraPermission} disabled={disabled}>
              <Camera className="h-3.5 w-3.5" /> Take Photo
            </Button>
            <Button variant="outline" size="sm" className="gap-1.5 rounded-xl" onClick={() => fileInputRef.current?.click()} disabled={disabled}>
              <Upload className="h-3.5 w-3.5" /> Upload Image
            </Button>
          </div>
          <p className="text-[10px] text-muted-foreground tracking-wide">PNG, JPG up to 10MB</p>
        </motion.div>
      )}

      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />

      {preview && !cameraActive && (
        <div className="flex gap-2">
          <Button variant="outline" onClick={reset} size="sm" className="flex-1 gap-1.5 rounded-xl" disabled={disabled}>
            <RotateCcw className="h-3.5 w-3.5" /> Retake
          </Button>
          <Button onClick={handleSubmit} size="sm" className="flex-1 gap-1.5 rounded-xl glow-sm hover:glow-md transition-shadow" disabled={disabled}>
            <Upload className="h-3.5 w-3.5" /> Analyze Image
          </Button>
        </div>
      )}
    </div>
  );
}
