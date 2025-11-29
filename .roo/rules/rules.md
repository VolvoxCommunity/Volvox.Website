# Code Quality Requirements

**MANDATORY**: After changing or editing any files, you MUST follow this workflow:

1. **Formatting**: Run `pnpm format` to ensure consistent code formatting
2. **Type Checking**: Run `pnpm typecheck` to verify TypeScript type safety
3. **Linting**: Run `pnpm lint` to check for code quality issues (includes type-aware linting)
4. **Build**: Run `pnpm build` to verify production build passes
5. **Commit and Push**: After all checks pass, commit and push all changes

These checks are not optional. All validation steps must pass before committing. If any check fails, resolve the issues and re-run all validation steps before proceeding.

**Complete Workflow:**

```bash
# Step 1-4: Run all validation checks
pnpm format && pnpm typecheck && pnpm lint && pnpm build

# Step 5: If all checks pass, commit and push
git add .
git commit -m "your commit message"
git push
```

**Important:**

- Do NOT commit or push changes - allow the user to do this manually
- Do NOT skip the validation checks to save time
- All validation checks must pass before changes are considered complete

**Why this matters:**

- Prevents TypeScript errors from reaching production
- Catches type safety issues with type-aware ESLint rules
- Maintains consistent code style across the project
- Catches potential bugs and issues early (floating promises, unsafe any usage, etc.)
- Ensures CI/CD pipeline will pass
- Keeps remote repository in sync with local changes
