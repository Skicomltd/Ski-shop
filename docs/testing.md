# Testing

This project is set up with Vitest and Playwright potential. Suggested approach:

- Unit tests: Vitest + React Testing Library
- Component docs/tests: Storybook + @storybook/test
- E2E: Playwright

## Example Commands

```bash
# unit
vitest

# storybook test runner
pnpm storybook

# e2e
npx playwright test
```

See package.json devDependencies for available tools.
