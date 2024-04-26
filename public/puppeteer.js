// Puppeteer
const puppeteer = require("puppeteer");

async function go() {
    const browser = await puppeteer.launch({
        headless: false,
        slowMo: 50
    });
    const page = await browser.newPage();

    // Visit Site To Be Tested
    await page.goto("https://hooferslocaltrips.web.app/");

    // User Create Account
    //await page.click("#signupbutton");
    //await page.

    // User Login


    // User Trip Sign-Up


    // User Sign-Out
    /*
    await page.click("#navbar > nav > ul > div:nth-child(2) > div > a");
    await page.click("#signoutbutton");
    */

    // Admin Login
    await page.click("#signinbutton");
    await page.type("#email2", "admin@hoofersns.org");
    await page.type("#password2", "password");
    await page.click("#signin_form > div.pt-4 > button.button.is-primary");

    // Admin Create Trip
    await page.click("#addeventbtn");
    await page.type("#eventName", "Puppeteer Event");
    await page.type("#trip_price", "$123");
    await page.type("#trip_location", "Puppet Town");
    await page.type("#trip_date","04-25-2024");
    await page.type("#trip_starttime","6:30PM");
    await page.type("#trip_endtime","9:30PM");
    await page.type("#trip_description", "Puppet Description");
    await page.type("#car1driver", "Puppet Driver");
    await page.type("#car1pickuptime", "5:30PM");
    await page.click("#addTrip_Submit");
    await page.click("#aeclose");

    // Admin Delete Trip
    await page.click("#trash1714080480010");

    // Admin Sign-Out
    await page.click("#navbar > nav > ul > div:nth-child(2) > div > a");
    await page.click("#signoutbutton");

    // Close the browser
    browser.close();
}

// run the test
go();
