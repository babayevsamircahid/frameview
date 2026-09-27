import type { ScaleMode } from "../../shared/types";

interface OverlayProps {
  src: string;
  opacity: number;
  visible: boolean;
  scaleMode: ScaleMode;
  offsetX: number;
  offsetY: number;
  viewportWidth: number;
  onError: () => void;
}

export function Overlay({
  src,
  opacity,
  visible,
  scaleMode,
  offsetX,
  offsetY,
  viewportWidth,
  onError,
}: OverlayProps) {
  if (!visible) {
    return null;
  }

  return (
    <img
      className="frameview-overlay"
      src={src}
      alt=""
      draggable={false}
      onError={onError}
      style={{
        top: offsetY,
        left: viewportWidth / 2 + offsetX,
        width: scaleMode === "fit-width" ? viewportWidth : "auto",
        opacity,
      }}
    />
  );
}
