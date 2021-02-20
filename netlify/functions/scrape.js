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

        // 3. Navigate to the given URL
        await page.goto(buildURLPath(system, station));

        data = await page.evaluate(() => {

            // document.querySelector('#ui-id-4').click()

            // await Timeout.set(getBoundedRandomDelay())

            const nodeList = document.querySelectorAll('.mainblock.maintable')

            // Node list length is 3 if market not found (station/system not found)
            if (nodeList.length === 3) {
                return ({ data: 'System/Station Not Found' })
            }

            const marketDiv = nodeList[3]

            console.log('md: ', marketDiv)

            const tableBody = marketDiv.children[0].tBodies[0]

            console.log('tb: ', tableBody)

            const rows = tableBody.rows

            console.log('rows: ', rows)
            
            const results = []
            
            for (let i = 0; i < rows.length; i++) {
                const row = rows[i]

                let name, sellPrice, supply

                if (row.children[0].classList.contains('subheader')) {
                    return
                } else {
                    name = rows[1].children[0].children[0].innerText

                    sellPrice = rows[1].children[1].innerText

                    supply = rows[1].children[4].innerText

                    if (supply === '-') {
                        return
                    }

                    //const marketRow = new MarketRow(name, sellPrice, supply)

                    results.push({ name, sellPrice, supply })
                }
            }

            return results
        });

        await browser.close();
    } catch (e) {
        return {
            statusCode: 500,
            body: 'Server Error: \n' + e
        }
    }

    console.log(data)

    return {
        statusCode: 200,
        body: JSON.stringify(data)
    };
}

function buildURLPath(system, station) {

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