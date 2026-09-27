# Frameview

Paste a design over your website and pixel-check your implementation.

Frameview is a tiny Chrome extension for frontend and design comparison. Copy a frame from Figma (or any other image), paste it on your site, and compare the implementation against the design.

## How it works

1. Copy a Figma frame as PNG.
2. Open your implementation.
3. Paste.
4. Adjust opacity.
5. Compare.

Frameview works with any clipboard image, not only Figma. It never talks to the Figma API. Everything stays local in the browser: no accounts, no backend, no uploads, and no analytics.

## Usage

1. Open the page you want to compare, usually something like `localhost:3000`.
2. In Figma, select a frame and use **Copy as PNG**.
3. Return to Chrome and press `Cmd+V` / `Ctrl+V`.
4. The image appears as an overlay at 50% opacity.
5. Use the floating toolbar to change opacity, scale, position, or visibility.

The overlay does not block clicks. The page stays interactive, and the image scrolls with the document.

### Controls

- **Opacity** — 0% to 100%. Default is 50%.
- **Scale** — Fit Width (viewport width) or 100% (original pixel width).
- **Position** — X and Y offsets, starting at `0px`.
- **Hide / Show** — Toggle the overlay. Shortcut: `Alt+Shift+F`.
- **Remove** — Clear the current reference image.

When the Frameview toolbar is focused, arrow keys nudge the overlay by 1px. Hold Shift for 10px. Arrow keys are not captured while you are using the website normally.

Paste is ignored when you are focused in an input, textarea, or contenteditable field, so normal site behavior is left alone. If the clipboard does not contain an image, Frameview does nothing.

Settings (opacity, visibility, scale, and offsets) persist for the current tab session. The pasted image stays in memory only and is gone after a refresh or tab close.

## Permissions

Frameview requests the minimum it needs to run.

| Permission | Why |
| --- | --- |
| Content scripts on `http://*/*` and `https://*/*` | Detect paste events and draw the overlay on the page you are comparing, including localhost. |

No `clipboardRead` permission is requested. Images are read only from the `paste` event.

No `storage` permission is requested. Settings use `sessionStorage` in the current tab.

Chrome does not allow extensions on some pages (`chrome://`, the Chrome Web Store, and similar). On those pages Frameview simply does not load.

## Development

Requirements: Node.js 20+ and [pnpm](https://pnpm.io).

```bash
pnpm install
```

Run a development build with content-script HMR:

```bash
pnpm dev
```

Typecheck and build the production extension into `dist/`:

```bash
pnpm build
```

### Load the unpacked extension in Chrome

1. Open `chrome://extensions`.
2. Enable **Developer mode**.
3. Click **Load unpacked**.
4. Select the `dist` directory.

After changing source files during `pnpm dev`, reload the extension if Chrome does not pick up the update automatically.

## Project structure

```text
src/
  content/
    index.tsx              Content script entry. Mounts Frameview in Shadow DOM.
    paste.ts               Clipboard image detection. Leaves normal paste alone.
    overlay/
      App.tsx              Overlay state, paste, shortcuts, persistence.
      Overlay.tsx          Reference image.
      Toolbar.tsx          Opacity, scale, position, hide, remove.
      overlay.css          Isolated toolbar and overlay styles.
  background/
    service-worker.ts      Lightweight MV3 worker. Reserved for future commands.
  shared/
    types.ts               Overlay settings types.
    constants.ts           Defaults and shortcut constants.
    storage.ts             sessionStorage read/write for settings.
icons/                     Extension icons.
manifest.config.ts         Chrome Manifest V3.
pnpm-workspace.yaml        pnpm settings (allows esbuild's install script).
```

## Future ideas

These are intentionally not in the MVP:

- Difference mode
- Split comparison
- Blink mode
- Multiple viewport handling

## License

MIT
