/**
 * Utility functions for inserting text into input fields on web pages
 */

export interface InputTarget {
  element: HTMLInputElement | HTMLTextAreaElement | HTMLElement;
  isContentEditable: boolean;
}

/**
 * Find the currently focused input element
 */
export function getFocusedInput(): InputTarget | null {
  const activeElement = document.activeElement;
  
  if (!activeElement) {
    return null;
  }

  // Check if it's a regular input or textarea
  if (
    activeElement instanceof HTMLInputElement ||
    activeElement instanceof HTMLTextAreaElement
  ) {
    return {
      element: activeElement,
      isContentEditable: false,
    };
  }

  // Check if it's a contentEditable element
  if (
    activeElement instanceof HTMLElement &&
    activeElement.isContentEditable
  ) {
    return {
      element: activeElement,
      isContentEditable: true,
    };
  }

  return null;
}

/**
 * Insert text at the cursor position
 */
export function insertTextAtCursor(text: string, target: InputTarget): void {
  const { element, isContentEditable } = target;

  if (isContentEditable) {
    insertTextInContentEditable(text, element as HTMLElement);
  } else {
    insertTextInInput(text, element as HTMLInputElement | HTMLTextAreaElement);
  }
}

function insertTextInInput(
  text: string,
  input: HTMLInputElement | HTMLTextAreaElement
): void {
  const start = input.selectionStart || 0;
  const end = input.selectionEnd || 0;
  const value = input.value;

  const newValue = value.substring(0, start) + text + value.substring(end);
  input.value = newValue;

  // Set cursor position after inserted text
  const newPosition = start + text.length;
  input.setSelectionRange(newPosition, newPosition);

  // Trigger input event to notify React/Vue/etc.
  input.dispatchEvent(new Event('input', { bubbles: true }));
  input.dispatchEvent(new Event('change', { bubbles: true }));
}

function insertTextInContentEditable(text: string, element: HTMLElement): void {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) {
    return;
  }

  const range = selection.getRangeAt(0);
  range.deleteContents();
  const textNode = document.createTextNode(text);
  range.insertNode(textNode);
  range.setStartAfter(textNode);
  range.collapse(true);
  selection.removeAllRanges();
  selection.addRange(range);

  // Trigger input event
  element.dispatchEvent(new Event('input', { bubbles: true }));
}

/**
 * Delete character before cursor (Backspace)
 */
export function deleteBeforeCursor(target: InputTarget): void {
  const { element, isContentEditable } = target;

  if (isContentEditable) {
    deleteInContentEditable(element as HTMLElement);
  } else {
    deleteInInput(element as HTMLInputElement | HTMLTextAreaElement);
  }
}

function deleteInInput(input: HTMLInputElement | HTMLTextAreaElement): void {
  const start = input.selectionStart || 0;
  const end = input.selectionEnd || 0;
  const value = input.value;

  if (start === end && start > 0) {
    // Delete single character before cursor
    const newValue = value.substring(0, start - 1) + value.substring(start);
    input.value = newValue;
    input.setSelectionRange(start - 1, start - 1);
  } else if (start !== end) {
    // Delete selected text
    const newValue = value.substring(0, start) + value.substring(end);
    input.value = newValue;
    input.setSelectionRange(start, start);
  }

  input.dispatchEvent(new Event('input', { bubbles: true }));
  input.dispatchEvent(new Event('change', { bubbles: true }));
}

function deleteInContentEditable(element: HTMLElement): void {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) {
    return;
  }

  const range = selection.getRangeAt(0);
  if (range.collapsed) {
    // Move back one character and delete
    range.setStart(range.startContainer, Math.max(0, range.startOffset - 1));
  }
  range.deleteContents();
  selection.removeAllRanges();
  selection.addRange(range);

  element.dispatchEvent(new Event('input', { bubbles: true }));
}

/**
 * Simulate key press (for special keys like Enter, Tab, etc.)
 */
export function simulateKeyPress(
  key: string,
  code: string,
  target: InputTarget
): void {
  const { element } = target;

  const keyEventInit: KeyboardEventInit = {
    key,
    code,
    bubbles: true,
    cancelable: true,
  };

  const keyDownEvent = new KeyboardEvent('keydown', keyEventInit);
  const keyPressEvent = new KeyboardEvent('keypress', keyEventInit);
  const keyUpEvent = new KeyboardEvent('keyup', keyEventInit);

  element.dispatchEvent(keyDownEvent);
  element.dispatchEvent(keyPressEvent);
  element.dispatchEvent(keyUpEvent);
}

