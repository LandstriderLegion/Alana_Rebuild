const puppeteer = require('puppeteer-core');
const chromium = require('chrome-aws-lambda');

exports.handler = async function(event, context) {
    // 1. Launch a new browser 
    const browser = await puppeteer.launch({
        // Required
        executablePath: await chromium.executablePath,

        // Optional
        args: chromium.args,
        defaultViewport: chromium.defaultViewport,
        headless: chromium.headless
    });

    // 2. Open a new page
    const page = await browser.newPage();

    // 3. Navigate to the given URL
    await page.goto('https://google.com');

    const data = await page.evaluate(() => document.querySelector('*').outerHTML);

    await browser.close();

    return {
        statusCode: 200,
        body: data
    };
}