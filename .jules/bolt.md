# Bolt's Journal

This file contains critical learnings from Bolt's performance optimization sessions.

## 2024-05-23 - [Bolt Initialization]

**Learning:** Bolt journal initialized.
**Action:** Consult this journal for past learnings before every session.

## 2024-05-23 - [Async Scroll Tests]

**Learning:** Throttling scroll handlers with `requestAnimationFrame` makes state updates asynchronous. Existing synchronous tests using `fireEvent.scroll` will fail unless updated with `waitFor`.
**Action:** Always check for associated tests when optimizing event handlers and anticipate async behavior changes.
