import { WebDriver } from "selenium-webdriver";
import { Options } from "selenium-webdriver/chrome";


export interface Automation {
    /**
     * Opens a new Sessionbox profile.
     *
     * @param {'temp' | 'cloud' | 'local'} sessionType - The type of session you wish to create.
     * @param {string} [targetUrl] - Optional. The URL you wish to open. Defaults to 'sessionbox.io'.
     * @param {Options} [options] - Optional. The options you wish to feed to the selenium chrome driver. If not provided, no options will be added to the driver.
     * @returns {Promise<void>} A promise that resolves once the profile has been created and the desired URL has been opened in the browser.
     */
    openNewProfile: (sessionType: 'temp' | 'cloud' | 'local', targetUrl?: string, options?: Options) => Promise<void>;
    /**
     * Opens an existing Sessionbox profile.
     *
     * @param {string} profileId - The ID of the existing profile you wish to open.
     * @param {Options} [driverOptions] - Optional. The options you wish to feed to the selenium chrome driver.
     * @returns {Promise<void>} A promise that resolves once the existing profile has been opened and the desired URL has been loaded in the browser.
     */
    openExistingProfile: (profileId: string, driverOptions?: Options) => Promise<void>;
    createSessionboxDriver: (options?: Options) => Promise<WebDriver>;
}
  