const puppeteer = require('puppeteer-core');
const chromium = require('chrome-aws-lambda');

const INARA_ROOT = "https://inara.cz/market/"

exports.handler = async function(event, context) {

    const { station, system } = event.queryStringParameters

    return {
        statusCode: 200,
        body: buildURLPath(system, station)
    }

    // // 1. Launch a new browser 
    // const browser = await puppeteer.launch({
    //     // Required
    //     executablePath: await chromium.executablePath,

    //     // Optional
    //     args: chromium.args,
    //     defaultViewport: chromium.defaultViewport,
    //     headless: chromium.headless
    // });

    // // 2. Open a new page
    // const page = await browser.newPage();

    // // 3. Navigate to the given URL
    // await page.goto(buildURLPath(system, station));

    // const data = await page.evaluate(() => document.querySelector('*').outerHTML);

    // await browser.close();

    // return {
    //     statusCode: 200,
    //     body: data
    // };
}

function buildURLPath(system, station) {

    let query = `?ps1=${system.replace(' ', '+')}+%5B${station.replace(' ', '+')}%5D`

    return INARA_ROOT + query
}