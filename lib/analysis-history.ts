export type AnalysisBias = "Long" | "Short" | "Neutral";
export type AnalysisConfidence = "Low" | "Medium" | "High";

export type AnalysisHistoryItem = {
  id: string;
  createdAt: string;
  bias: AnalysisBias;
  confidence: AnalysisConfidence;
  summary: string;
  entryZone: string;
  invalidationZone: string;
  takeProfitTargets: string[];
  imagePreview: string | null;
};

const STORAGE_KEY = "chart-insight-assistant.analysis-history";
const MAX_HISTORY_ITEMS = 12;
const MAX_PREVIEW_STORAGE_BYTES = 350 * 1024;

function canUseStorage() {
  return typeof window !== "undefined";
}

function parseHistoryItems(value: string | null): AnalysisHistoryItem[] {
  if (!value) {
    return [];
  }

  try {
    const parsed = JSON.parse(value);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter((item): item is AnalysisHistoryItem => {
      return (
        typeof item === "object" &&
        item !== null &&
        typeof item.id === "string" &&
        typeof item.createdAt === "string" &&
        typeof item.bias === "string" &&
        typeof item.confidence === "string" &&
        typeof item.summary === "string" &&
        typeof item.entryZone === "string" &&
        typeof item.invalidationZone === "string" &&
        Array.isArray(item.takeProfitTargets)
      );
    });
  } catch {
    return [];
  }
}

function readHistoryItems() {
  if (!canUseStorage()) {
    return [];
  }

  return parseHistoryItems(window.localStorage.getItem(STORAGE_KEY));
}

function writeHistoryItems(items: AnalysisHistoryItem[]) {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function getAnalysisHistory() {
  return readHistoryItems();
}

export function saveAnalysisHistoryItem(item: AnalysisHistoryItem) {
  const nextItems = [item, ...readHistoryItems().filter((entry) => entry.id !== item.id)].slice(
    0,
    MAX_HISTORY_ITEMS,
  );

  writeHistoryItems(nextItems);
}

export function deleteAnalysisHistoryItem(id: string) {
  writeHistoryItems(readHistoryItems().filter((item) => item.id !== id));
}

export function createAnalysisHistoryId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `analysis-${Date.now()}`;
}

export async function createHistoryImagePreview(file: File) {
  // Avoid stuffing large data URLs into localStorage.
  if (file.size > MAX_PREVIEW_STORAGE_BYTES) {
    return null;
  }

  return new Promise<string | null>((resolve) => {
    const reader = new FileReader();

    reader.onload = () => {
      resolve(typeof reader.result === "string" ? reader.result : null);
    };

    reader.onerror = () => {
      resolve(null);
    };

    reader.readAsDataURL(file);
  });
}
