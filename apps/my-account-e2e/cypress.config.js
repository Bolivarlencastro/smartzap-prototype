import { defineConfig } from 'cypress';
import { beforeRunHook, afterRunHook } from 'cypress-mochawesome-reporter/lib';
// import { sendToDiscordWebhook } from 'cypress-discord-webhook-integration'

// const webhookURL = '<DISCORD_WEBHOOK_URL>'
// const files = ['./cypress/reports/html/index.html']

export default defineConfig({
  reporter: '../../node_modules/cypress-mochawesome-reporter',
  reporterOptions: {
    charts: true,
    reportPageTitle: 'MyAccount E2E Report',
    embeddedScreenshots: true,
    inlineAssets: true,
    saveAllAttempts: false,
  },
  e2e: {
    setupNodeEvents(on, config) {
      on('before:run', async (details) => {
        console.log('override before:run');
        await beforeRunHook(details);
      });

      on('after:run', async () => {
        console.log('override after:run');
        await afterRunHook();
        // await sendToDiscordWebhook(webhookURL, files)
      });

      return config;
    },
    chromeWebSecurity: false,
    modifyObstructiveCode: false,
    retries: {
      runMode: 2,
      openMode: 0,
    },
    baseUrl: 'https://myaccount-stage.keepsdev.com/',
    defaultCommandTimeout: 60000,
    requestTimeout: 60000,
    responseTimeout: 60000,
    pageLoadTimeout: 60000,
    videosFolder: '../../dist/cypress/apps/my-account-e2e/videos',
    screenshotsFolder: '../../dist/cypress/apps/my-account-e2e/screenshots',
  },
});
