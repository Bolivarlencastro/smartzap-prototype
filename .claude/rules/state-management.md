# State Management

## Signals (local component state)

- Use signals for local component state
- Use `computed()` for derived state
- Do NOT use `mutate` on signals, use `update` or `set` instead

## NgRx (global state)

- Use `toSignal()` to convert NgRx store selectors to signals
- Keep state transformations pure and predictable
- Do NOT update NgRx store via signals, use `dispatch` instead
- Standard actions → effects → feature pattern
- Global state slices: user profile, notifications, gamification scores, workspace settings
- Feature states are colocated with feature libs and registered lazily
- When using `concatLatestFrom`, pass all selectors in a **single array** — never chain multiple `concatLatestFrom` calls one after another
