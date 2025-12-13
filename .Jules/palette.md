## 2025-02-27 - Icon-Only Buttons with asChild Pattern

**Learning:** When using the `asChild` pattern with UI components (like Button wrapping an anchor), it's easy to forget accessibility labels because the wrapper component looks like a button.
**Action:** Always check inner elements of `asChild` components for accessible names, especially for icon-only links.
