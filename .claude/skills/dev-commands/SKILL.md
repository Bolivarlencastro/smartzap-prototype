---
description: >
  Use this skill when the user wants to start or serve an app, run unit tests,
  run e2e tests, lint, format, build, run SonarQube analysis, or encounters a
  memory/build error.
---

# Dev Commands

## Serving Apps

```bash
npm run start:konquest          # konquest-web (main LMS, port 4200)
npm run start:analytics         # learning-analytics-web
npm run start:my-account        # my-account
npm run start:smartzap-admin    # smartzap-admin
npm run start:smartzap-view     # smartzap-view
```

## Unit Tests

```bash
npm run test:konquest            # Run konquest-web tests
npm run test:affected            # Run tests for affected projects
npm run test:all                 # Run all unit tests
npm exec nx test <project>       # Run a specific project's tests
npm exec nx test <project> --testFile=path/to/file.spec.ts  # Single file
```

## E2E Tests (Cypress)

```bash
npm run e2e:konquest             # Open Cypress UI
npm run e2e:konquest-run         # Headless run
npm run e2e:konquest:ci          # CI mode
npm run e2e:my-account           # Open Cypress for my-account
npm run e2e:smartzap             # Open Cypress for smartzap
```

Cypress
base
URL:
`https://konquest-stage.keepsdev.com`

## Linting & Formatting

```bash
npm run lint                     # ESLint on affected projects
npm run style:lint               # stylelint on affected projects
npm run format:fix               # Prettier on staged files
npm exec nx lint <project>       # Lint a specific project
```

Pre-commit
hook
runs
`format:fix`,
`lint`,
and
`style:lint`
automatically.

## Building

```bash
npm run build:affected           # Build affected apps
npm run build:all                # Build all apps
npm exec nx build <project>      # Build a specific app
```

## SonarQube

Run
tests
first (
coverage
report
required),
then:

```bash
npm run sonar:affected
npm run sonar:all
```

Requires
a
`.env.sonar`
file
with
`SONAR_TOKEN` (
see
`.env.sonar.example`).

## Memory Issues

For
large
builds
on
low-memory
machines:

```bash
export NODE_OPTIONS="--max-old-space-size=8192"
```
