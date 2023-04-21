const fs = require('fs');
const { exec } = require("child_process");
const puppeteer = require('puppeteer');

const urlBaseSegment = 'https://zoom.earth/maps/satellite/';
const urlViewSegment = 'view=37.8,-97.1,5.11z';
const frameCount = 6 * 24 * 3;

function zeropad(num:number, size:number = 2): string {
    return ("0".repeat(size) + num).slice(-size);
}

(async () => {
    const browser = await puppeteer.launch({
        args: [`--window-size=1920,1080`],
        defaultViewport: {
          width:1920,
          height:1080
        }
    });
    const page = await browser.newPage();

    const now = new Date();
    const datestr = `${now.getFullYear()}-${zeropad(now.getMonth()+1)}-${zeropad(now.getDate())}`;

    const midnight = Date.parse(`${datestr}T00:00:00`);
    let epoch = midnight.valueOf();
    // console.log('starting epoch', epoch);

    const starturl = `${urlBaseSegment}#${urlViewSegment}/date=${datestr},00:00,-${now.getTimezoneOffset()/60}`;
    console.log('starting from', starturl);
    await page.goto(starturl);
    await page.$$eval('div.panel', els => els.forEach(el => el.style.opacity=0)).catch(() => {});
    await page.$eval('button.title', el => el.remove()).catch(() => {});
    await page.$eval('nav.panel.select-satellite', el => el.remove()).catch(() => {});
    await page.$$eval('main > aside', els => els.forEach(el => el.remove())).catch(() => {});
    await page.$$eval('main > button', els => els.forEach(el => el.remove())).catch(() => {});
    await page.$$eval('main > div.group', els => els.forEach(el => el.remove())).catch(() => {});

    let files = <string[]>[];

    for (let frame = frameCount; frame > 0; frame--) {
        await page.$eval('div.minute button.down', el => el.click()).catch(() => {});
        epoch -= 600000;
        // console.log('next epoch', epoch);
        
        const filename = `images/${epoch}.webp`;
        files.push(filename)
        await page.waitForTimeout(500)
        if (fs.existsSync(filename)) {
            console.log('skipping', filename);
        } else {
            console.log('creating', filename);
            await page.screenshot({ path: filename });
        }
    }

    // console.log(JSON.stringify(files, null, 4))
    await browser.close();
    
    console.log("building animation");
    exec(`convert -delay 10 -loop 0 ${files.reverse().join(' ')} -resize 44% animations/${datestr}.webp`, (error, stdout, stderr) => {
        if (error) {
            console.log(`error building animation: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`stderr building animation: ${stderr}`);
            return;
        }
        // console.log(`animation build stdout: ${stdout}`);
        console.log('done building animation', `${datestr}.gif`);
        
    });
})();