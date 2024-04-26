// Puppeteer
const puppeteer = require("puppeteer");

async function go() {
    const browser = await puppeteer.launch({
        headless: false,
        slowMo: 50
    });
    const page = await browser.newPage();

    // visit site to be tested
    await page.goto("hooferslocaltrips.web.app");

    // User Create Account

    // User Login

    // User Trip Sign-Up

    // User Sign-Out

    // Admin Login

    // Admin Create Trip

    // Admin Delete Trip

    // Admin Sign-Out

    // Close the browser
    browser.close();
}

// run the test
go();
