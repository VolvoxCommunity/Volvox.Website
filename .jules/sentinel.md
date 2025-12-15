# SENTINEL'S JOURNAL - CRITICAL LEARNINGS ONLY

This journal tracks unique security learnings, vulnerability patterns, and architectural gaps found in this codebase.
Only add entries for CRITICAL learnings, not routine work.

## YYYY-MM-DD - [Template]

**Vulnerability:** [What you found]
**Learning:** [Why it existed]
**Prevention:** [How to avoid next time]

## 2025-12-14 - File-based Content Path Traversal
**Vulnerability:** Unvalidated user input (slug) used directly in `path.join` for file system access in `getPostBySlug`.
**Learning:** In file-based CMS architectures, reliance on file existence checks is insufficient; explicit input validation (allowlisting characters) is required to prevent path traversal.
**Prevention:** Always use strict schema validation (e.g., `normalizeSlug`) before passing user input to file system APIs.
