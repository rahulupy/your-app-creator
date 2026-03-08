import { PredictionResult } from "@/lib/ml-api";

export interface ScanRecord {
  id: string;
  imageUrl: string;
  imageName: string;
  prediction: PredictionResult;
  date: string;
}

export interface UserProfile {
  username: string;
  email?: string;
  fullName?: string;
  joinedDate: string;
}

const SCANS_KEY = "mediscan_scans";

export function saveScan(imageName: string, imageFile: File, prediction: PredictionResult): ScanRecord {
  const record: ScanRecord = {
    id: crypto.randomUUID(),
    imageUrl: URL.createObjectURL(imageFile),
    imageName,
    prediction,
    date: new Date().toISOString(),
  };

  const existing = getScans();
  existing.unshift(record);
  // Keep last 50 scans
  const trimmed = existing.slice(0, 50);
  sessionStorage.setItem(SCANS_KEY, JSON.stringify(trimmed.map(s => ({ ...s, imageUrl: "" }))));
  
  // Store in memory for current session
  if (!window.__mediscanScans) window.__mediscanScans = [];
  window.__mediscanScans.unshift(record);
  
  return record;
}

export function getScans(): ScanRecord[] {
  return window.__mediscanScans || [];
}

export function getStats() {
  const scans = getScans();
  const cataractCount = scans.filter(s => s.prediction.condition === "cataract").length;
  return {
    totalScans: scans.length,
    cataractDetected: cataractCount,
    normalScans: scans.length - cataractCount,
    lastScanDate: scans.length > 0 ? scans[0].date : null,
  };
}

// Extend window for in-memory scan storage
declare global {
  interface Window {
    __mediscanScans?: ScanRecord[];
  }
}
