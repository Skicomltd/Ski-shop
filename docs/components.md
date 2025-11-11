# Components

- `src/components/ui` – base primitives (buttons, inputs, dialogs, etc.)
- `src/components/shared` – app-level reusable widgets
- `src/components/core` – layout and miscellaneous wrappers

Stories are supported via Storybook. Prefer colocated stories and use `react-docgen-typescript` for props tables.

## Conventions
- Export components from an index.ts file per folder for clean imports.
- Keep components pure and controlled where possible.
- Provide loading/empty/error states.
