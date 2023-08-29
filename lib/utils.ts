import { Builder } from "selenium-webdriver";
import { Options } from "selenium-webdriver/chrome";
const os = require('os')

const CRX_PATH = 'path/to/crx'

export function getArchitecture() {
    if (os.arch().includes('86')) {
        return 'x86-32';
    } else if (os.arch().includes('64')) {
        return 'x86-64';
    } else {
        return 'arm';
    }
}

export async function getBrowserVersion() {
    const driver = await new Builder()
        .forBrowser('chrome')
        .setChromeOptions( new Options().addArguments('--headless'))
        .build();
    const capabilities = await driver.getCapabilities();
    driver.close();
    driver.quit();
    return capabilities.get("browserVersion").concat(".170");
}

export async function createWebDriver(options: Options) {
    const driver = await new Builder()
        .forBrowser('chrome')
        .setChromeOptions(options || new Options())
        .build();
    return driver;
}