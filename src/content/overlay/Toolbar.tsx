import { useRef, useState, type PointerEvent, type KeyboardEvent } from "react";
import { NUDGE_STEP, NUDGE_STEP_LARGE } from "../../shared/constants";
import type { OverlaySettings, ScaleMode } from "../../shared/types";

interface ToolbarProps {
  settings: OverlaySettings;
  onOpacityChange: (opacity: number) => void;
  onScaleModeChange: (mode: ScaleMode) => void;
  onOffsetChange: (axis: "offsetX" | "offsetY", value: number) => void;
  onToggleVisible: () => void;
  onRemove: () => void;
}

export function Toolbar({
  settings,
  onOpacityChange,
  onScaleModeChange,
  onOffsetChange,
  onToggleVisible,
  onRemove,
}: ToolbarProps) {
  const toolbarRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<{ left: number; top: number } | null>(
    null,
  );
  const dragRef = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    originLeft: number;
    originTop: number;
  } | null>(null);

  const opacityPercent = Math.round(settings.opacity * 100);

  function focusToolbar() {
    toolbarRef.current?.focus();
  }

  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    if ((event.target as HTMLElement).closest("input, button")) {
      return;
    }

    const toolbar = toolbarRef.current;
    if (!toolbar) {
      return;
    }

    const rect = toolbar.getBoundingClientRect();
    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      originLeft: rect.left,
      originTop: rect.top,
    };
    toolbar.setPointerCapture(event.pointerId);
    focusToolbar();
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) {
      return;
    }

    const maxLeft = window.innerWidth - 48;
    const maxTop = window.innerHeight - 48;
    setPosition({
      left: Math.min(maxLeft, Math.max(0, drag.originLeft + event.clientX - drag.startX)),
      top: Math.min(maxTop, Math.max(0, drag.originTop + event.clientY - drag.startY)),
    });
  }

  function handlePointerUp(event: PointerEvent<HTMLDivElement>) {
    if (dragRef.current?.pointerId === event.pointerId) {
      dragRef.current = null;
    }
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.target instanceof HTMLInputElement) {
      return;
    }

    const step = event.shiftKey ? NUDGE_STEP_LARGE : NUDGE_STEP;
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      onOffsetChange("offsetX", settings.offsetX - step);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      onOffsetChange("offsetX", settings.offsetX + step);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      onOffsetChange("offsetY", settings.offsetY - step);
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      onOffsetChange("offsetY", settings.offsetY + step);
    }
  }

  return (
    <div
      ref={toolbarRef}
      className="frameview-toolbar"
      tabIndex={-1}
      style={
        position
          ? { top: position.top, left: position.left, right: "auto" }
          : undefined
      }
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onKeyDown={handleKeyDown}
    >
      <div className="frameview-toolbar-header">
        <p className="frameview-title">FRAMEVIEW</p>
      </div>

      <div className="frameview-field">
        <span className="frameview-label">Opacity</span>
        <div className="frameview-opacity-row">
          <input
            className="frameview-range"
            type="range"
            min={0}
            max={100}
            value={opacityPercent}
            aria-label="Opacity"
            onChange={(event) =>
              onOpacityChange(Number(event.target.value) / 100)
            }
          />
          <span className="frameview-value">{opacityPercent}%</span>
        </div>
      </div>

      <div className="frameview-field">
        <span className="frameview-label">Scale</span>
        <div className="frameview-scale">
          <button
            type="button"
            className={settings.scaleMode === "fit-width" ? "active" : undefined}
            onClick={() => onScaleModeChange("fit-width")}
          >
            Fit Width
          </button>
          <button
            type="button"
            className={settings.scaleMode === "actual" ? "active" : undefined}
            onClick={() => onScaleModeChange("actual")}
          >
            100%
          </button>
        </div>
      </div>

      <div className="frameview-field">
        <span className="frameview-label">Position</span>
        <div className="frameview-position-row">
          <label>
            X
            <input
              className="frameview-number"
              type="number"
              step={1}
              value={settings.offsetX}
              aria-label="X offset"
              onChange={(event) => {
                const next = event.currentTarget.valueAsNumber;
                if (Number.isFinite(next)) {
                  onOffsetChange("offsetX", Math.round(next));
                }
              }}
            />
          </label>
          <label>
            Y
            <input
              className="frameview-number"
              type="number"
              step={1}
              value={settings.offsetY}
              aria-label="Y offset"
              onChange={(event) => {
                const next = event.currentTarget.valueAsNumber;
                if (Number.isFinite(next)) {
                  onOffsetChange("offsetY", Math.round(next));
                }
              }}
            />
          </label>
        </div>
      </div>

      <div className="frameview-actions">
        <button type="button" title="Alt+Shift+F" onClick={onToggleVisible}>
          {settings.visible ? "Hide" : "Show"}
        </button>
        <button type="button" onClick={onRemove}>
          Remove
        </button>
      </div>

      <p className="frameview-hint">Alt+Shift+F toggles visibility</p>
    </div>
  );
}
