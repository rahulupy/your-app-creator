import { useRef, useState, useCallback } from "react";
import { Upload, X, RotateCcw, Camera, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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

  const requestCameraPermission = () => {
    setShowPermissionDialog(true);
  };

  const startCamera = async () => {
    setShowPermissionDialog(false);
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 960 } },
      });
      streamRef.current = stream;
      setCameraActive(true);
      // Wait for DOM to render video element
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      }, 100);
    } catch (err: any) {
      if (err.name === "NotAllowedError") {
        setCameraError("Camera access was denied. Please allow camera access in your browser settings and try again.");
      } else if (err.name === "NotFoundError") {
        setCameraError("No camera found on this device. Please use the upload option instead.");
      } else {
        setCameraError("Could not access camera. Please use the upload option instead.");
      }
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(videoRef.current, 0, 0);
    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], "eye-capture.jpg", { type: "image/jpeg" });
        handleFile(file);
        stopCamera();
      }
    }, "image/jpeg", 0.92);
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  return (
    <div className="space-y-3">
      {/* Camera permission dialog */}
      <Dialog open={showPermissionDialog} onOpenChange={setShowPermissionDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Video className="h-5 w-5 text-primary" />
              Camera Access Required
            </DialogTitle>
            <DialogDescription className="text-left leading-relaxed">
              MediScan needs access to your camera to take a photo of your eye for analysis. 
              Your camera feed is only used locally and is never recorded or stored.
            </DialogDescription>
          </DialogHeader>
          <div className="rounded-md bg-accent/50 border border-accent p-3">
            <p className="text-xs text-muted-foreground leading-relaxed">
              <strong className="text-foreground">Privacy:</strong> The photo will be sent securely to our AI model for analysis. 
              No images are saved on our servers after processing.
            </p>
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setShowPermissionDialog(false)} className="flex-1">
              Cancel
            </Button>
            <Button onClick={startCamera} className="flex-1 gap-1.5">
              <Camera className="h-4 w-4" />
              Allow Camera
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Camera error */}
      {cameraError && (
        <div className="rounded-md border border-destructive/30 bg-destructive/10 p-3">
          <p className="text-sm text-destructive">{cameraError}</p>
        </div>
      )}

      {/* Camera view */}
      {cameraActive && !preview && (
        <div className="space-y-3">
          <div className="relative rounded-lg border bg-foreground overflow-hidden">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full aspect-[4/3] object-cover"
            />
            <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={stopCamera}
                className="bg-background/80 backdrop-blur-sm"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={capturePhoto}
                className="gap-1.5 bg-primary/90 backdrop-blur-sm"
              >
                <Camera className="h-4 w-4" />
                Capture
              </Button>
            </div>
          </div>
          <p className="text-xs text-muted-foreground text-center">
            Position the eye in frame and tap Capture
          </p>
        </div>
      )}

      {/* Preview */}
      {preview && !cameraActive && (
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
      )}

      {/* Upload / Take photo buttons */}
      {!preview && !cameraActive && (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`rounded-lg border-2 border-dashed transition-colors py-10 flex flex-col items-center gap-4 ${
            dragOver
              ? "border-primary bg-accent/50"
              : "border-border bg-card"
          } ${disabled ? "opacity-50 pointer-events-none" : ""}`}
        >
          <div className="h-12 w-12 rounded-full bg-accent flex items-center justify-center">
            <Camera className="h-5 w-5 text-accent-foreground" />
          </div>
          <p className="text-xs text-muted-foreground text-center px-4">{instructions}</p>
          <div className="flex flex-col sm:flex-row gap-2 w-full px-6 sm:px-0 sm:w-auto">
            <Button
              variant="default"
              size="sm"
              className="gap-1.5"
              onClick={requestCameraPermission}
              disabled={disabled}
            >
              <Camera className="h-3.5 w-3.5" />
              Take Photo
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => fileInputRef.current?.click()}
              disabled={disabled}
            >
              <Upload className="h-3.5 w-3.5" />
              Upload Image
            </Button>
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

      {preview && !cameraActive && (
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
