"use client";

import { useCallback, useEffect, useState } from "react";

/**
 * Keyboard shortcut definition used by the homepage and related UIs.
 *
 * @property key - The base key that triggers the shortcut (lowercase, e.g. "h").
 * @property description - Human-readable description shown in the help dialog.
 * @property action - Callback invoked when the shortcut is triggered.
 * @property displayKey - Optional label to display in the UI instead of `key`
 * (for example, "⌘K" or "Cmd+K").
 */
export interface KeyboardShortcut {
  key: string;
  description: string;
  action: () => void;
  displayKey?: string;
}

interface UseKeyboardShortcutsOptions {
  /**
   * Collection of shortcuts to register.
   */
  shortcuts: KeyboardShortcut[];
  /**
   * Whether keyboard shortcuts are currently enabled.
   * Defaults to true.
   */
  enabled?: boolean;
}

interface UseKeyboardShortcutsResult {
  /**
   * Whether the help modal is currently open.
   */
  isHelpModalOpen: boolean;
  /**
   * Setter for controlling the help modal open state.
   */
  setIsHelpModalOpen: (open: boolean) => void;
  /**
   * Registered shortcuts (excluding the "?" help shortcut).
   */
  shortcuts: KeyboardShortcut[];
}

/**
 * Register global keyboard shortcuts for the homepage and expose state for the
 * keyboard shortcuts help modal.
 *
 * - Pressing "?" (Shift + "/") toggles the help modal.
 * - Custom shortcuts are ignored while the user is typing in text fields.
 *
 * @param options - Configuration for the hook, including shortcuts and enabled flag.
 * @returns Modal state and the list of registered shortcuts.
 */
export function useKeyboardShortcuts(
  options: UseKeyboardShortcutsOptions
): UseKeyboardShortcutsResult {
  const { shortcuts, enabled = true } = options;
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled) return;

      const target = event.target as HTMLElement | null;
      const isTypingTarget =
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.getAttribute("contenteditable") === "true");

      if (isTypingTarget) {
        return;
      }

      const rawKey = event.key;
      const key = rawKey.toLowerCase();

      // "?" help shortcut (usually Shift + "/")
      if (rawKey === "?" || (key === "/" && event.shiftKey)) {
        event.preventDefault();
        setIsHelpModalOpen((open) => !open);
        return;
      }

      const shortcut = shortcuts.find((s) => s.key.toLowerCase() === key);

      if (shortcut) {
        event.preventDefault();
        shortcut.action();
      }
    },
    [enabled, shortcuts]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  return {
    isHelpModalOpen,
    setIsHelpModalOpen,
    shortcuts,
  };
}
