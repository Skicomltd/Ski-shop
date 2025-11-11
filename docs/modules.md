# Modules

Feature modules in `src/modules/` encapsulate domain logic (e.g. play-to-win, tracking). Each module may contain:

- UI components
- hooks
- services
- schemas

Keep module boundaries clear. Avoid cross-importing internal files between modules; use shared libs or services instead.
