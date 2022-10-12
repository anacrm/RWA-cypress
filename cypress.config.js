const { defineConfig } = require("cypress");
const dotenv = require('dotenv')

dotenv.config()

module.exports = defineConfig({
  projectId: 'woudxx',
  viewportWidth: 1920,
  viewportHeight: 1080,
  env: {
    DEFAULT_USERNAME: process.env.DEFAULT_USERNAME,
    DEFAULT_PASSWORD: process.env.DEFAULT_PASSWORD,
    DEFAULT_FULLNAME: process.env.DEFAULT_FULLNAME,
    ACCESSORY_USERNAME: process.env.ACCESSORY_USERNAME,
    ACCESSORY_PASSWORD: process.env.ACCESSORY_PASSWORD,
    ACCESSORY_FULLNAME: process.env.ACCESSORY_FULLNAME,
    EDIT_USERNAME: process.env.EDIT_USERNAME,
    EDIT_PASSWORD: process.env.EDIT_PASSWORD,
    API_KEY: ''
  },
  e2e: {
    baseUrl: 'http://localhost:3000',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    reporter: "mochawesome",
    reporterOptions: {
      "reportDir": "cypress/reports/mochawesome-report",
      "overwrite": false,
      "html": false,
      "json": true,
      "timestamp": "mmddyyyy_HHMMss"
    },

  },
});
