# Commit Policies

This document defines the rules for all Git commits made to the ToEscalado repository.

## 1. Language Rule
- **Mandatory English:** All commit messages, branch names, and code comments MUST be written in **English**.

## 2. Pre-Commit Security Check
- **Crucial Requirement:** Before any commit is created, a **Security Check** must be performed.
- Check for accidentally exposed secrets (e.g., `.env` keys, hardcoded credentials, JWT secrets).
- Ensure no sensitive PII (Personally Identifiable Information) or internal infrastructure details are being leaked in the code.
- Validate that Row Level Security (RLS) is not bypassed improperly.

## 3. Conventional Commits Standard
- Commits must follow the Conventional Commits format:
  `<type>(<optional scope>): <description>`
  
- **Types:**
  - `feat:` A new feature.
  - `fix:` A bug fix.
  - `docs:` Documentation only changes.
  - `style:` Changes that do not affect the meaning of the code (white-space, formatting, etc.).
  - `refactor:` A code change that neither fixes a bug nor adds a feature.
  - `perf:` A code change that improves performance.
  - `test:` Adding missing tests or correcting existing tests.
  - `chore:` Changes to the build process or auxiliary tools and libraries.

## 4. Message Quality
- The description must be clear and explain **what** was done and **why** (if not obvious).
- Limit the subject line to 50 characters.
- Use the body of the commit to explain the context or detailed changes if necessary.

## 5. Semantic Versioning & Version Bump
- **Mandatory Versioning:** Every commit must include a version bump in `package.json` following Semantic Versioning (**X.Y.Z**).
  - **Z (Patch):** For every small commit, bug fix, or minor correction.
  - **Y (Minor):** When a new screen, UI component, or feature is added.
  - **X (Major):** When there is a major visual redesign or fundamental mechanic change.
- **AI Rule (Crucial):** Before making ANY commit, the AI **must** suggest the new version number to the user and **wait for confirmation**, explicitly explaining why the bump matches the X.Y.Z rule above.
