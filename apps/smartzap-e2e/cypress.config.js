import { defineConfig } from 'cypress';
import { beforeRunHook, afterRunHook } from 'cypress-mochawesome-reporter/lib';
const webhookURL =
  'https://discord.com/api/webhooks/1088166810844680262/H7NZKN9gemQ1B6B2lAaUaO8jxqMKnMS5QPLjZK8e5xvyRk3Lvs8WEhc6Te62jOWX7F_y';
import { sendToDiscordWebhook } from 'cypress-discord-webhook-integration';

const files = ['./cypress/reports/html/index.html'];

export const reporterConfig = {
  reporter: '../../node_modules/cypress-mochawesome-reporter',

  reporterOptions: {
    charts: true,
    reportPageTitle: 'custom-title',
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
      await sendToDiscordWebhook(webhookURL, files);
    });
    return config;
  },
  chromeWebSecurity: false,
  modifyObstructiveCode: false,
  retries: {
    runMode: 1,
    openMode: 0,
  },
  baseUrl: 'https://smartzap-stage.keepsdev.com',
  specPattern: 'cypress/e2e/**/**.cy.ts',
  defaultCommandTimeout: 60000,
  requestTimeout: 60000,
  responseTimeout: 60000,
  pageLoadTimeout: 60000,
  videoUploadOnPasses: false,
  video: false,
  videosFolder: '../../dist/cypress/apps/smartzap-e2e/videos',
  screenshotsFolder: '../../dist/cypress/apps/smartzap-e2e/screenshots',
};

export default defineConfig({
  ...reporterConfig,
  e2e: e2eConfig,
});
