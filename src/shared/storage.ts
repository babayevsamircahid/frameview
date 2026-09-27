import { DEFAULT_SETTINGS, SETTINGS_KEY } from "./constants";
import type { OverlaySettings, ScaleMode } from "./types";

function isScaleMode(value: unknown): value is ScaleMode {
  return value === "fit-width" || value === "actual";
}

function clampOpacity(value: unknown): number {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return DEFAULT_SETTINGS.opacity;
  }
  return Math.min(1, Math.max(0, value));
}

function toOffset(value: unknown): number {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return 0;
  }
  return Math.round(value);
}

export function loadSettings(): OverlaySettings {
  try {
    const raw = sessionStorage.getItem(SETTINGS_KEY);
    if (!raw) {
      return { ...DEFAULT_SETTINGS };
    }

    const parsed = JSON.parse(raw) as Partial<OverlaySettings>;
    return {
      opacity: clampOpacity(parsed.opacity),
      visible: parsed.visible !== false,
      scaleMode: isScaleMode(parsed.scaleMode)
        ? parsed.scaleMode
        : DEFAULT_SETTINGS.scaleMode,
      offsetX: toOffset(parsed.offsetX),
      offsetY: toOffset(parsed.offsetY),
    };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

export function saveSettings(settings: OverlaySettings): void {
  try {
    sessionStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch {
    // Private mode, quota, or a sandboxed page — settings stay in memory.
  }
}
