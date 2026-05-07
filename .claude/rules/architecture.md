# Architecture

## Library Import Aliases

All libraries import via `@keeps-platform-frontend-workspace/<name>`:

| Alias                                          | Library                                                            |
| ---------------------------------------------- | ------------------------------------------------------------------ |
| `@keeps-platform-frontend-workspace/kp-keeps`  | `libs/core`                                                        |
| `@keeps-platform-frontend-workspace/ui`        | `libs/shared-ui/ui` (prefeer granular imports: `.../ui/kp-button`) |
| `@keeps-platform-frontend-workspace/layout`    | `libs/shared-ui/layout`                                            |
| `@keeps-platform-frontend-workspace/<feature>` | `libs/<feature>`                                                   |
