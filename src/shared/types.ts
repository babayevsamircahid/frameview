export type ScaleMode = "fit-width" | "actual";

/**
 * Overlay comparison settings persisted per tab session.
 *
 * Future comparison modes (not implemented): difference, split, blink.
 */
export interface OverlaySettings {
  opacity: number;
  visible: boolean;
  scaleMode: ScaleMode;
  offsetX: number;
  offsetY: number;
}
