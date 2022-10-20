# RWA-cypress

## Description
A project to practice and showcase how to write automated tests in JavaScript using Cypress.

This project contains many test scenarios for the cypress [realworld app](https://github.com/cypress-io/cypress-realworld-app).

## Usage

Requirements:
* node v16.16.0 (or newer)
* npm v8.11.0 (or newer)

Clone the repository and install the dependencies

```
git clone https://github.com/anacrm/RWA-cypress.git
cd RWA-cypress
npm install
```

To open the cypress Launchpad (interactive mode) 
```
npm run cy:interactive
```

To run the tests in headless mode generating a report
```
npm run cy:report
```
## Test Report
After running the tests, the reports will be available in both HTML and JSON formats. And the reports files can be found in the `reports` folder:

* mochawesome-html-report 
* report.json

The html report can be opened on the browser and here is an example of how it looks:

![HTML report](readme/htmlReport.png)

## CI/CD integrations

It is also easy to integrate your own CI/CD tools with this project. I used Jenkins and here how it looks:

![Jenkins report](readme/Jenkins.png)

## Contact

You can contact me here on GitHub, via [LinkedIn](https://www.linkedin.com/in/ana-reis-qa/) or email at reismedeiros.ana@gmail.com