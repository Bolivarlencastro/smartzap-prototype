import { defineConfig } from 'cypress';
import { beforeRunHook, afterRunHook } from 'cypress-mochawesome-reporter/lib';

export const reporterConfig = {
  reporter: '../../node_modules/cypress-mochawesome-reporter',
  reporterOptions: {
    charts: true,
    reportPageTitle: 'Konquest E2E Report',
    embeddedScreenshots: true,
    inlineAssets: true,
    saveAllAttempts: false,
  },
};

export const e2eConfig = {
  async setupNodeEvents(on, config) {
    require('@cypress/grep/src/plugin')(config);

    on('before:run', async (details) => {
      await beforeRunHook(details);
    });

    on('after:run', async () => {
      await afterRunHook();
    });

    return config;
  },
  chromeWebSecurity: false,
  modifyObstructiveCode: false,
  retries: {
    runMode: 1,
    openMode: 0,
  },
  baseUrl: 'https://konquest-stage.keepsdev.com',
  specPattern: 'cypress/e2e/**/**.cy.ts',
  defaultCommandTimeout: 60000,
  requestTimeout: 60000,
  responseTimeout: 60000,
  pageLoadTimeout: 60000,
  video: false,
  videosFolder: '../../dist/cypress/apps/konquest-e2e/videos',
  screenshotsFolder: '../../dist/cypress/apps/konquest-e2e/screenshots',
};

export default defineConfig({
  ...reporterConfig,
  e2e: e2eConfig,
});
