# CI/CD

- Visual testing: Chromatic GitHub Action (`note/workflows/chromatic.yml`).
- Add build and test steps as needed for your pipeline.

Suggested steps:
- Install deps (pnpm i)
- Lint (pnpm lint)
- Build (pnpm build)
- Run unit tests (vitest)
- Publish Storybook to Chromatic
