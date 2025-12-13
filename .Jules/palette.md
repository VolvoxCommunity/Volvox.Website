# Palette's Journal

This journal captures critical UX and accessibility learnings.
## 2025-12-13 - [Cookie Banner A11y & Theming]
**Learning:** Hardcoded hex values in components (like switches) break theme consistency and make maintenance harder. Using theme tokens (e.g., `bg-input`, `bg-primary`) ensures components look correct in both light and dark modes automatically.
**Action:** Always check `globals.css` or theme config for available semantic tokens before resorting to arbitrary values.
