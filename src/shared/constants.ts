import type { OverlaySettings } from "./types";

export const HOST_ID = "frameview-root";
export const SETTINGS_KEY = "frameview:settings";

export const DEFAULT_OPACITY = 0.5;
export const DEFAULT_SETTINGS: OverlaySettings = {
  opacity: DEFAULT_OPACITY,
  visible: true,
  scaleMode: "fit-width",
  offsetX: 0,
  offsetY: 0,
};

export const NUDGE_STEP = 1;
export const NUDGE_STEP_LARGE = 10;

export const TOOLBAR_Z_INDEX = "2147483647";
