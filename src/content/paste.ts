function isEditableElement(element: Element | null): boolean {
  if (!element) {
    return false;
  }

  if (
    element instanceof HTMLInputElement ||
    element instanceof HTMLTextAreaElement ||
    element instanceof HTMLSelectElement
  ) {
    return true;
  }

  if (element instanceof HTMLElement && element.isContentEditable) {
    return true;
  }

  return Boolean(
    element.closest(
      'input, textarea, select, [contenteditable=""], [contenteditable="true"]',
    ),
  );
}

export function isEditableTarget(target: EventTarget | null): boolean {
  const element = target instanceof Element ? target : null;
  return isEditableElement(element) || isEditableElement(document.activeElement);
}

export function getClipboardImageFile(event: ClipboardEvent): File | null {
  const data = event.clipboardData;
  if (!data) {
    return null;
  }

  for (const file of Array.from(data.files)) {
    if (file.type.startsWith("image/")) {
      return file;
    }
  }

  for (const item of Array.from(data.items)) {
    if (item.kind === "file" && item.type.startsWith("image/")) {
      return item.getAsFile();
    }
  }

  return null;
}
