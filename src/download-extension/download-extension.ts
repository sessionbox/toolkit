import fs from 'fs';
import { Options } from 'selenium-webdriver/chrome';
import { getArchitecture, getBrowserVersion } from '../../lib/utils';

const PATH_TO_EXTENSION = 'extension/chrome_extension.crx';

export async function downloadExtension() {
    if (!fs.existsSync('extension')) fs.mkdirSync('extension');
    const architecture = getArchitecture();
    const browserVersion = await getBrowserVersion();
    const response = await fetch(`https://clients2.google.com/service/update2/crx?response=redirect&prodversion=${browserVersion}&acceptformat=crx2,crx3&x=id%3Dgmechnknnhcmhlciielglhgodjlcbien%26uc&nacl_arch=${architecture}`);
    const buffer = await response.arrayBuffer();
    fs.writeFileSync(PATH_TO_EXTENSION, Buffer.from(buffer));
}

export function addExtension(options?: Options): Options {
    if (options) return options.addExtensions(PATH_TO_EXTENSION);
    else return new Options().addExtensions(PATH_TO_EXTENSION);
    // return options || new Options;
}