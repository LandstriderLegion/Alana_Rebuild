const puppeteer = require('puppeteer-core');
const chromium = require('chrome-aws-lambda');

const INARA_ROOT = "https://inara.cz/market/"

exports.handler = async function (event, context) {

    const { station, system } = event.queryStringParameters

    if (!station || station.length === 0 || !system || system.length === 0) {
        return {
            statusCode: 400,
            body: 'Error - Bad input'
        }
    }

    let data = 'No Data'

    try {
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

        page.on("pageerror", function(err) {  
            const temp = err.toString();
            console.log("Page error: " + temp); 
        })

        page.on("error", function (err) {  
            const temp = err.toString();
            console.log("Error: " + temp); 
        })

        const url = buildURL(system, station)

        console.log('Url target: ', url)

        // 3. Navigate to the given URL
        await page.goto(url);

        data = await page.evaluate(() => {

            console.log('Evaluating page...')

            const nodeList = document.querySelectorAll('.mainblock.maintable')

            // Node list length is 3 if market not found (station/system not found)
            if (nodeList.length === 3) {
                return ({ data: 'System/Station Not Found' })
            }

            const marketDiv = nodeList[3]

            //return { data: marketDiv.length }

            const tableBody = marketDiv.children[0].tBodies[0]

            const rows = tableBody.rows

                // return { data: rows.length }
            
            const results = []
            
            for (let i = 0; i < rows.length; i++) {
                const row = rows[i]

                let name, sellPrice, supply

                if (row.children[0].classList.contains('subheader')) {
                    continue
                } else {
                    name = rows[1].children[0].children[0].innerText

                    sellPrice = rows[1].children[1].innerText

                    supply = rows[1].children[4].innerText

                    if (supply === '-') {
                        continue
                    }

                    //const marketRow = new MarketRow(name, sellPrice, supply)

                    results.push({ name, sellPrice, supply })
                }
            }

            return { data: results }
        });

        await browser.close();
    } catch (e) {
        return {
            statusCode: 500,
            body: 'Server Error: \n' + e
        }
    }

    console.log('Data: ', data)

    return {
        statusCode: 200,
        body: JSON.stringify(data)
    };
}

function buildURL(system, station) {

    let query = `?ps1=${system.replace(' ', '+')}+%5B${station.replace(' ', '+')}%5D`

    return INARA_ROOT + query
}

class MarketRow {

    constructor(name, sellPrice, supply) {
        this.name = name
        this.sellPrice = sellPrice
        this.supply = supply
    }
}