# Change Log

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Added

- **ui: Redesign neural stream section with improved visual effects**
- **ui: Add team member list and detail pages** (`/team`, `/team/[slug]`)
- **ui: Full UI overhaul**
- **SEO: Add IndexNow GitHub Actions workflow for automatic search engine indexing** (`.github/workflows/indexnow.yml`)
- **Changelog: Add CHANGELOG.md with Keep a Changelog and SemVer format** (changelog-check.ts, changelog-generate.ts)
- **Changelog: Add pre-commit hook that auto-generates draft entries from commit messages** (.husky/pre-commit)
- **Changelog: Add npm scripts for changelog generation and validation** (package.json)
- **Changelog: Add CHANGELOG guidelines to CLAUDE.md with category to SemVer mapping** (CLAUDE.md)

### Changed

- **Docs: Redesign README with centered logo, badges (build, codecov, E2E, last-commit, Discord, Zread), Quick Links navigation, and improved documentation structure** (README.md)
- **Visual: Update footer visual baseline for current implementation** (e2e/visual.spec.ts-snapshots)

### Deprecated

### Removed

- **SEO: Remove redundant IndexNow API route** (GitHub workflow calls IndexNow directly per best practices)

### Fixed

### Security
