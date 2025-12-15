# Palette's Journal

This journal captures critical UX and accessibility learnings.

## 2025-12-13 - [Cookie Banner A11y & Theming]

**Learning:** Hardcoded hex values in components (like switches) break theme consistency and make maintenance harder. Using theme tokens (e.g., `bg-input`, `bg-primary`) ensures components look correct in both light and dark modes automatically.
**Action:** Always check `globals.css` or theme config for available semantic tokens before resorting to arbitrary values.

## 2025-12-14 - [Interactive Card Accessibility]

**Learning:** Using `div` elements for interactive cards (like blog posts) excludes keyboard users unless `role="button"`, `tabIndex`, and keyboard handlers are explicitly added.
**Action:** Always wrap interactive cards in semantic buttons or add full ARIA support (`role="button"`, `tabIndex={0}`, `onKeyDown`) to the container.
