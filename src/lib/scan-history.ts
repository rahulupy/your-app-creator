import { PredictionResult } from "@/lib/ml-api";

const ML_API_BASE_URL = import.meta.env.VITE_ML_API_URL || "https://nontutorial-sharolyn-intersocial.ngrok-free.dev";

export interface PatientDetails {
  name: string;
  age: number;
  gender: "male" | "female" | "other";
  eyeSide?: "left" | "right";
}

export interface ScanRecord {
  id: string;
  imageUrl: string;
  imageName: string;
  patient: PatientDetails;
  prediction: PredictionResult;
  date: string;
}

export interface UserProfile {
  username: string;
  email?: string;
  fullName?: string;
  joinedDate: string;
}

/**
 * Save scan to backend /history endpoint
 */
export async function saveScan(
  imageName: string,
  imageFile: File,
  patient: PatientDetails,
  prediction: PredictionResult
): Promise<ScanRecord> {
  const username = sessionStorage.getItem("mediscan_user") || "unknown";

  const record: ScanRecord = {
    id: crypto.randomUUID(),
    imageUrl: URL.createObjectURL(imageFile),
    imageName,
    patient,
    prediction,
    date: new Date().toISOString(),
  };

  // Save to backend
  try {
    await fetch(`${ML_API_BASE_URL}/history`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true",
      },
      body: JSON.stringify({
        username,
        patient_name: patient.name,
        patient_age: patient.age,
        patient_gender: patient.gender,
        eye_side: patient.eyeSide || null,
        prediction: prediction.condition,
        confidence: prediction.confidence,
        severity: prediction.severity || null,
        description: prediction.description,
        image_name: imageName,
        date: record.date,
      }),
    });
  } catch (err) {
    console.error("Failed to save scan to backend:", err);
  }

  return record;
}

/**
 * Fetch scan history from backend /history endpoint
 */
export async function fetchScans(): Promise<ScanRecord[]> {
  const username = sessionStorage.getItem("mediscan_user") || "unknown";

  try {
    const response = await fetch(`${ML_API_BASE_URL}/history?username=${encodeURIComponent(username)}`, {
      method: "GET",
      headers: {
        "ngrok-skip-browser-warning": "true",
      },
    });

    if (!response.ok) {
      console.error("Failed to fetch history:", response.status);
      return [];
    }

    const data = await response.json();

    const mapItem = (item: any): ScanRecord => {
      let confidence = item.confidence || 0;
      if (confidence > 1) confidence = confidence / 100;

      const rawPrediction = (item.prediction || "").toLowerCase();
      const condition = rawPrediction.includes("cataract") ? "normal" : "cataract";
      const severity = confidence > 0.85 ? "severe" : confidence > 0.7 ? "moderate" : "mild";

      return {
        id: item.id || crypto.randomUUID(),
        imageUrl: "",
        imageName: item.image_name || "",
        patient: {
          name: item.name || item.patient_name || "Unknown",
          age: item.age || item.patient_age || 0,
          gender: item.gender || item.patient_gender || "other",
          eyeSide: item.eye || item.eye_side || undefined,
        },
        prediction: {
          condition,
          confidence,
          severity: condition === "cataract" ? severity : undefined,
          description: item.description || "",
        },
        date: item.date || new Date().toISOString(),
      };
    };

    if (Array.isArray(data)) {
      return data.map(mapItem);
    }

    const arr = data.history || data.scans || data.records || [];
    return arr.map(mapItem);
  } catch (err) {
    console.error("Failed to fetch scan history:", err);
    return [];
  }
}

export function getStatsFromScans(scans: ScanRecord[]) {
  const cataractCount = scans.filter(s => s.prediction.condition === "cataract").length;
  return {
    totalScans: scans.length,
    cataractDetected: cataractCount,
    normalScans: scans.length - cataractCount,
    lastScanDate: scans.length > 0 ? scans[0].date : null,
  };
}
