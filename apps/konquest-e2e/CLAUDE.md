# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# konquest-e2e

Cypress E2E test suite for the `konquest-web` application. Tests run against the **staging** environment (`https://konquest-stage.keepsdev.com`) by default.

---

## Commands

Run from the **workspace root** (prefix with `npm exec`):

```bash
# Open Cypress UI against staging
npm run e2e:konquest

# Run headlessly against staging
npm run e2e:konquest-run

# CI mode (staging)
npm run e2e:konquest:ci

# Run against local dev server
npm exec nx run konquest-e2e:e2e-local

# Run a single spec file
npm exec nx run konquest-e2e:e2e --spec="cypress/e2e/missions/mission-delete.cy.ts"

# Run by grep tag (uses @cypress/grep)
npm exec nx run konquest-e2e:e2e --env grep="tag-name"

# Lint
npm exec nx run konquest-e2e:lint
```

---

## Architecture

### Directory Layout

```
cypress/
  e2e/                   # Test specs grouped by feature
    channel/             # 8 specs
    classroom/           # 3 specs
    enrollments/         # 5 specs
    global-search/       # 4 specs
    groups/              # 4 specs
    missions/            # 13 specs
    pulse/               # 4 specs
    settings/            # 7 specs
    trails/              # 6 specs
  fixtures/dev/          # Test data JSON files (mission, trail, channel, pulse, etc.)
  support/
    API/                 # 14 API client modules (cy.API* commands)
    commands/            # 20 feature command modules (cy.Mission*, cy.Channel*, etc.)
    elements/            # 16 page-object classes with element selectors
    interfaces/          # TypeScript interfaces for fixture/API types
    constants/
      utils.ts           # ~100 exported constants (IDs, status strings, types)
      users.ts           # User name/ID constants
    commands.ts          # Generic commands + fixture loaders registered here
    e2e.js               # Global setup: plugin registration, error suppression
```

### Separation of Concerns

| Layer           | Location                         | Responsibility                                            |
| --------------- | -------------------------------- | --------------------------------------------------------- |
| **API helpers** | `support/API/*.api.ts`           | HTTP calls via `cy.keepsApi()` for setup/teardown         |
| **Commands**    | `support/commands/*.ts`          | UI workflow steps (navigation, form filling, assertions)  |
| **Elements**    | `support/elements/*-elements.ts` | Selector methods — `data-test` attrs + Material selectors |
| **Interfaces**  | `support/interfaces/*.ts`        | TypeScript shapes for fixtures and API responses          |
| **Constants**   | `support/constants/utils.ts`     | Shared IDs, enum values, expected messages                |

---

## Key Conventions

### Test Structure

Every spec follows this pattern:

```typescript
/// <reference types="cypress" />
import { getRandomName } from '../../support/commands';
import SomeElements from '../../support/elements/some-elements';
import * as util from '../../support/constants/utils';
import { SomeInterface } from '../../support/interfaces';

let createdResource: SomeInterface;

describe('Feature description', () => {
  beforeEach(() => {
    cy.FixturesMission().then((fixture) => {
      fixture.name = getRandomName(); // Randomize to avoid conflicts
      cy.Login('admin');
      cy.APIMissionCreate(fixture).then((res) => {
        createdResource = res.body;
      });
    });
  });

  it('Should do something', () => {
    // GUI test using custom commands and element selectors
  });

  afterEach(() => {
    cy.Login('admin');
    cy.APICourseDelete(createdResource.id); // API cleanup
  });
});
```

### Authentication

```typescript
cy.Login('admin'); // Admin user (newadmcypress@gmail.com)
cy.Login('admin2'); // Second admin
cy.Login('user'); // Standard learner
cy.Login('user2'); // Second learner
cy.Login('superAdmin'); // Platform super admin
cy.Login('instructor'); // Instructor role
```

Login uses Keycloak OIDC, stores the token in localStorage, and selects the `Cypress Teste` workspace. All API modules (`cy.keepsApi()`) read auth headers from localStorage automatically.

### Fixture Loading

```typescript
cy.FixturesMission(); // loads fixtures/dev/mission/default.json
cy.FixturesTrail(); // loads fixtures/dev/trail/default.json
cy.FixturesChannel(); // loads fixtures/dev/channel/default.json
cy.FixturesPulse(); // loads fixtures/dev/pulse/default.json
cy.FixturesEnrollment(); // loads fixtures/dev/enrollment/default.json
cy.FixturesMissionStageContent(); // loads mission + stage + content together
```

Always call `getRandomName()` on `name` fields after loading to ensure test isolation.

### API vs GUI

- **Setup and cleanup** are done via API (`cy.APIMissionCreate`, `cy.APICourseDelete`, etc.)
- **Tests themselves** exercise the UI using custom commands
- Use `cy.intercept(...).as('alias')` + `cy.wait('@alias')` instead of arbitrary waits

### Element Selectors

Page-object element classes return chainable Cypress queries:

```typescript
import MissionElements from '../../support/elements/mission-elements';

MissionElements.buttonSave().click();
MissionElements.inputName().type('test');
```

Primary selector strategy: `data-test` attributes. Fallback: Material component selectors (`mat-row`, `mat-button`).

### Naming Constants

Use `utils.ts` and `users.ts` for IDs and expected strings instead of hardcoding:

```typescript
import * as util from '../../support/constants/utils';
// util.WORKSPACE_DEFAULT, util.MISSION_TYPE_INTERNAL, util.STATUS_ACTIVE, ...
```

---

## Environment

Credentials and API URLs live in `cypress.env.json` at the project root. The `ENVIRONMENT` variable (`"dev"`) is used to resolve fixture paths:

```typescript
const path = `${Cypress.env('ENVIRONMENT')}/mission/default`;
// → 'dev/mission/default'
```

Target API: `https://learning-platform-api-stage.keepsdev.com/konquest`
