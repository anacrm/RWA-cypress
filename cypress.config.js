const { defineConfig } = require("cypress");
const dotenv = require ('dotenv')

dotenv.config()

module.exports = defineConfig({
  projectId: 'mg9i4y',
  env: {
    DEFAULT_USERNAME: process.env.DEFAULT_USERNAME,
    DEFAULT_PASSWORD: process.env.DEFAULT_PASSWORD,
    API_KEY: ''
  },
  e2e: {
    baseUrl: 'http://localhost:3000',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
