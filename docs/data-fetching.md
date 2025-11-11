# Data Fetching

- HTTP client: axios wrappers in `src/lib/http` (expand as needed).
- Caching and async state: TanStack Query.
- Mocking: MSW handlers in `src/mocks/` toggled by environment variables.

## Patterns

1. Create a query key in a `keys.ts` (suggested).
2. Use `useQuery` / `useMutation` in client components.
3. Provide fallbacks when offline or mocked.

## Example

```tsx
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

function useProducts() {
  return useQuery({
    queryKey: ["products"],
    queryFn: async () => (await axios.get("/api/products")).data,
  });
}
```

## Mock Awareness
Use `useMockStatus` to branch logic when mocks are active.
