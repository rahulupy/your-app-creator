import { useState } from "react";
import { Loader2, ArrowLeft, Info, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import ImageCapture from "@/components/ImageCapture";
import ResultCard from "@/components/ResultCard";
import { detectCataract, PredictionResult } from "@/lib/ml-api";
import { saveScan, PatientDetails } from "@/lib/scan-history";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";

export default function CataractDetection() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [showPatientForm, setShowPatientForm] = useState(false);
  const [patientName, setPatientName] = useState("");
  const [patientAge, setPatientAge] = useState("");
  const [patientGender, setPatientGender] = useState<string>("");
  const [eyeSide, setEyeSide] = useState<string>("");
  const { toast } = useToast();

  const handleImageCaptured = (file: File) => {
    setPendingFile(file);
    setShowPatientForm(true);
    setResult(null);
  };

  const handlePatientSubmit = async () => {
    if (!pendingFile || !patientName.trim() || !patientAge || !patientGender) return;
    const patient: PatientDetails = {
      name: patientName.trim(),
      age: parseInt(patientAge),
      gender: patientGender as PatientDetails["gender"],
      eyeSide: eyeSide ? (eyeSide as PatientDetails["eyeSide"]) : undefined,
    };
    setShowPatientForm(false);
    setLoading(true);
    try {
      const prediction = await detectCataract(pendingFile, {
        name: patient.name, age: patient.age, gender: patient.gender, eyeSide: patient.eyeSide,
      });
      await saveScan(pendingFile.name, pendingFile, patient, prediction);
      setResult(prediction);
    } catch {
      toast({ title: "Connection Error", description: "Could not reach the analysis service. Please try again.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = patientName.trim() && patientAge && parseInt(patientAge) > 0 && patientGender;

  return (
    <div>
      {/* Breadcrumb */}
      <div className="border-b bg-card/50 backdrop-blur-sm">
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

      {/* Patient Details Dialog */}
      <Dialog open={showPatientForm} onOpenChange={setShowPatientForm}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="font-display">Patient Details</DialogTitle>
            <DialogDescription>Enter the patient's information before proceeding with the analysis.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="patient-name" className="text-xs font-semibold tracking-wide uppercase">Full Name <span className="text-destructive">*</span></Label>
              <Input id="patient-name" value={patientName} onChange={(e) => setPatientName(e.target.value)} placeholder="Enter patient name" maxLength={100} className="h-11 rounded-xl" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="patient-age" className="text-xs font-semibold tracking-wide uppercase">Age <span className="text-destructive">*</span></Label>
                <Input id="patient-age" type="number" min={1} max={150} value={patientAge} onChange={(e) => setPatientAge(e.target.value)} placeholder="Age" className="h-11 rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-semibold tracking-wide uppercase">Gender <span className="text-destructive">*</span></Label>
                <Select value={patientGender} onValueChange={setPatientGender}>
                  <SelectTrigger className="h-11 rounded-xl"><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-semibold tracking-wide uppercase">Eye Side <span className="text-muted-foreground text-[10px] normal-case">(optional)</span></Label>
              <Select value={eyeSide} onValueChange={setEyeSide}>
                <SelectTrigger className="h-11 rounded-xl"><SelectValue placeholder="Select eye" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="left">Left Eye</SelectItem>
                  <SelectItem value="right">Right Eye</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setShowPatientForm(false)} className="flex-1 rounded-xl">Cancel</Button>
            <Button onClick={handlePatientSubmit} disabled={!isFormValid} className="flex-1 rounded-xl glow-sm hover:glow-md transition-shadow">
              <Sparkles className="h-4 w-4 mr-1.5" />
              Start Analysis
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="container max-w-2xl py-8 pb-24 md:pb-8">
        <div className="grid gap-6 md:grid-cols-[1fr,280px]">
          {/* Main content */}
          <div className="space-y-6">
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
              <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground tracking-tight">
                Cataract <span className="gradient-text">Screening</span>
              </h1>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                Upload a clear, close-up photo of the eye for AI-powered analysis.
              </p>
            </motion.div>

            <ImageCapture
              instructions="Ensure the pupil is clearly visible with even lighting"
              onImageCaptured={handleImageCaptured}
              disabled={loading}
            />

            {loading && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-3 py-10 justify-center rounded-2xl border bg-card glow-sm"
              >
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">Analyzing image…</p>
              </motion.div>
            )}

            {result && <ResultCard result={result} type="cataract" />}
          </div>

          {/* Sidebar tips */}
          <div className="hidden md:block space-y-4">
            <motion.div initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2, duration: 0.4 }} className="rounded-2xl border bg-card p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Info className="h-4 w-4 text-primary" />
                </div>
                <h3 className="text-sm font-bold text-foreground">Tips for Best Results</h3>
              </div>
              <ul className="space-y-3">
                {[
                  "Use natural or bright lighting",
                  "Hold the camera 10-15cm from the eye",
                  "Keep the eye fully open",
                  "Avoid flash photography",
                  "Ensure the image is in focus",
                ].map((tip) => (
                  <li key={tip} className="flex items-start gap-2.5 text-xs text-muted-foreground">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                    {tip}
                  </li>
                ))}
              </ul>
            </motion.div>

            <div className="rounded-2xl border bg-accent/30 p-4">
              <p className="text-xs text-muted-foreground leading-relaxed">
                <strong className="text-foreground">Note:</strong> This screening is for informational purposes and does not replace a professional eye examination.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
