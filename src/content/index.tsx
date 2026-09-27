import { createRoot, type Root } from "react-dom/client";
import { HOST_ID, TOOLBAR_Z_INDEX } from "../shared/constants";
import { App } from "./overlay/App";
import overlayCss from "./overlay/overlay.css?inline";

interface MountedFrameview {
  host: HTMLDivElement;
  root: Root;
}

let mounted: MountedFrameview | null = null;

function applyHostStyles(host: HTMLDivElement) {
  host.style.all = "initial";
  host.style.position = "absolute";
  host.style.top = "0";
  host.style.left = "0";
  host.style.width = "0";
  host.style.height = "0";
  host.style.overflow = "visible";
  host.style.pointerEvents = "none";
  host.style.zIndex = TOOLBAR_Z_INDEX;
}

function unmount() {
  if (!mounted) {
    document.getElementById(HOST_ID)?.remove();
    return;
  }

  mounted.root.unmount();
  mounted.host.remove();
  mounted = null;
}

function mount() {
  if (mounted || document.getElementById(HOST_ID)) {
    return;
  }

  const host = document.createElement("div");
  host.id = HOST_ID;
  applyHostStyles(host);

  const shadow = host.attachShadow({ mode: "open" });
  const style = document.createElement("style");
  style.textContent = overlayCss;

  const appRoot = document.createElement("div");
  appRoot.className = "frameview-app";
  shadow.append(style, appRoot);

  document.documentElement.append(host);

  const root = createRoot(appRoot);
  root.render(<App />);
  mounted = { host, root };
}

function bootstrap() {
  try {
    mount();
  } catch {
    // Restricted pages and some document types cannot host a content script UI.
  }
}

unmount();
bootstrap();

if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    unmount();
  });
}
