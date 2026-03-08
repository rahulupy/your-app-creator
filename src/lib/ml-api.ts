// ML API Integration Service
// Configure your ML API endpoint here once deployed

const ML_API_BASE_URL = import.meta.env.VITE_ML_API_URL || "";

export interface PredictionResult {
  condition: "normal" | "cataract" | "anemia";
  confidence: number;
  severity?: "mild" | "moderate" | "severe";
  description: string;
}

export function getSeverityDescription(
  condition: string,
  confidence: number,
  severity?: string
): string {
  if (confidence < 0.6) {
    return "Inconclusive. Please ensure the image is clear and well-lit, then retake the photo.";
  }

  if (condition === "normal") {
    return "No signs of the condition were detected. If you have concerns, please consult a healthcare professional.";
  }

  if (condition === "cataract") {
    switch (severity) {
      case "mild":
        return "Early signs of cataract detected. Regular monitoring and consultation with an ophthalmologist is recommended.";
      case "moderate":
        return "Moderate cataract indicators observed. Please schedule an appointment with an eye specialist for further evaluation.";
      case "severe":
        return "Significant cataract indicators detected. Please seek immediate consultation with an ophthalmologist.";
      default:
        return "Cataract indicators detected. Please consult an eye care professional for proper diagnosis.";
    }
  }

  if (condition === "anemia") {
    switch (severity) {
      case "mild":
        return "Mild pallor detected in conjunctival analysis. Consider a blood test to check hemoglobin levels.";
      case "moderate":
        return "Notable pallor observed. A complete blood count (CBC) test is recommended.";
      case "severe":
        return "Significant pallor detected suggesting low hemoglobin. Please seek medical attention promptly.";
      default:
        return "Signs of anemia detected. Please consult a healthcare provider for blood work.";
    }
  }

  return "Analysis complete. Please consult a medical professional for interpretation.";
}

export async function detectCataract(
  imageFile: File
): Promise<PredictionResult> {
  if (!ML_API_BASE_URL) {
    // Demo mode — simulate a result
    await new Promise((r) => setTimeout(r, 2000));
    const random = Math.random();
    const severity =
      random > 0.7 ? "severe" : random > 0.4 ? "moderate" : "mild";
    const confidence = 0.65 + Math.random() * 0.3;
    const condition = random > 0.3 ? "cataract" : "normal";
    return {
      condition: condition as PredictionResult["condition"],
      confidence,
      severity: condition === "cataract" ? (severity as PredictionResult["severity"]) : undefined,
      description: getSeverityDescription(condition, confidence, severity),
    };
  }

  const formData = new FormData();
  formData.append("image", imageFile);

  const response = await fetch(`${ML_API_BASE_URL}/predict/cataract`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }

  const data = await response.json();
  return {
    ...data,
    description: getSeverityDescription(data.condition, data.confidence, data.severity),
  };
}

export async function detectAnemia(
  imageFile: File
): Promise<PredictionResult> {
  if (!ML_API_BASE_URL) {
    await new Promise((r) => setTimeout(r, 2500));
    const random = Math.random();
    const severity =
      random > 0.7 ? "severe" : random > 0.4 ? "moderate" : "mild";
    const confidence = 0.6 + Math.random() * 0.35;
    const condition = random > 0.35 ? "anemia" : "normal";
    return {
      condition: condition as PredictionResult["condition"],
      confidence,
      severity: condition === "anemia" ? (severity as PredictionResult["severity"]) : undefined,
      description: getSeverityDescription(condition, confidence, severity),
    };
  }

  const formData = new FormData();
  formData.append("image", imageFile);

  const response = await fetch(`${ML_API_BASE_URL}/predict/anemia`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }

  const data = await response.json();
  return {
    ...data,
    description: getSeverityDescription(data.condition, data.confidence, data.severity),
  };
}
