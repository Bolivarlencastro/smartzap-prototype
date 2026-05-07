import { defineConfig } from 'cypress';
import { reporterConfig, e2eConfig } from './cypress.config';
export default defineConfig({
  ...reporterConfig,
  e2e: {
    ...e2eConfig,
    viewportWidth: 414,
    viewportHeight: 896,
    specPattern: 'cypress/mobile/**/**.cy.ts',
  },
});
