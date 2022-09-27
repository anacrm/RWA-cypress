const { defineConfig } = require("cypress");
const dotenv = require('dotenv')

dotenv.config()

module.exports = defineConfig({
  projectId: 'mg9i4y',
  viewportWidth: 1920,
  viewportHeight: 1080,
  env: {
    DEFAULT_USERNAME: process.env.DEFAULT_USERNAME,
    DEFAULT_PASSWORD: process.env.DEFAULT_PASSWORD,
    ACCESSORY_USERNAME: process.env.ACCESSORY_USERNAME,
    ACCESSORY_PASSWORD: process.env.ACCESSORY_PASSWORD,
    USER_NAME: process.env.USER_NAME,
    USER_NAME_ACCESSORY: process.env.USER_NAME_ACCESSORY,

    API_KEY: ''
  },
  e2e: {
    baseUrl: 'http://localhost:3000',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
