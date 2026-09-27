import { useEffect, useRef, useState } from "react";
import { loadSettings, saveSettings } from "../../shared/storage";
import type { OverlaySettings, ScaleMode } from "../../shared/types";
import { getClipboardImageFile, isEditableTarget } from "../paste";
import { Overlay } from "./Overlay";
import { Toolbar } from "./Toolbar";

export function App() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [settings, setSettings] = useState<OverlaySettings>(loadSettings);
  const [viewportWidth, setViewportWidth] = useState(
    () => document.documentElement.clientWidth,
  );
  const imageUrlRef = useRef<string | null>(null);

  useEffect(() => {
    imageUrlRef.current = imageUrl;
  }, [imageUrl]);

  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  useEffect(() => {
    const onResize = () => {
      setViewportWidth(document.documentElement.clientWidth);
    };

    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    const onPaste = (event: ClipboardEvent) => {
      if (isEditableTarget(event.target)) {
        return;
      }

      const file = getClipboardImageFile(event);
      if (!file) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();

      const nextUrl = URL.createObjectURL(file);
      if (imageUrlRef.current) {
        URL.revokeObjectURL(imageUrlRef.current);
      }

      setImageUrl(nextUrl);
      setSettings((current) => ({ ...current, visible: true }));
    };

    document.addEventListener("paste", onPaste, true);
    return () => document.removeEventListener("paste", onPaste, true);
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (
        event.altKey &&
        event.shiftKey &&
        event.code === "KeyF" &&
        imageUrlRef.current
      ) {
        event.preventDefault();
        setSettings((current) => ({ ...current, visible: !current.visible }));
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    return () => {
      if (imageUrlRef.current) {
        URL.revokeObjectURL(imageUrlRef.current);
      }
    };
  }, []);

  function updateSettings(patch: Partial<OverlaySettings>) {
    setSettings((current) => ({ ...current, ...patch }));
  }

  function handleRemove() {
    if (imageUrl) {
      URL.revokeObjectURL(imageUrl);
    }
    imageUrlRef.current = null;
    setImageUrl(null);
  }

  function handleImageError() {
    handleRemove();
  }

  if (!imageUrl) {
    return null;
  }

  return (
    <>
      <Overlay
        src={imageUrl}
        opacity={settings.opacity}
        visible={settings.visible}
        scaleMode={settings.scaleMode}
        offsetX={settings.offsetX}
        offsetY={settings.offsetY}
        viewportWidth={viewportWidth}
        onError={handleImageError}
      />
      <Toolbar
        settings={settings}
        onOpacityChange={(opacity) => updateSettings({ opacity })}
        onScaleModeChange={(scaleMode: ScaleMode) =>
          updateSettings({ scaleMode })
        }
        onOffsetChange={(axis, value) => updateSettings({ [axis]: value })}
        onToggleVisible={() => updateSettings({ visible: !settings.visible })}
        onRemove={handleRemove}
      />
    </>
  );
}
