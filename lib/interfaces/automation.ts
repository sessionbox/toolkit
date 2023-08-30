export type WebDriverWithExtension<T> = T & { readonly sbExtension: true};

export interface Automation<D, O> {
    /**
     * Opens a new Sessionbox profile.
     *
     * @param {'temp' | 'cloud' | 'local'} sessionType - The type of session you wish to create.
     * @param {string} [targetUrl] - Optional. The URL you wish to open. Defaults to 'sessionbox.io'.
     * @param {WebDriverWithExtension} [driver] - Optional. The webdriver you wish to do the automation on. If not provided, a default option will be provided.
     * @returns {Promise<void>} A promise that resolves once the profile has been created and the desired URL has been opened in the browser.
     */
    openNewProfile: (sessionType: 'temp' | 'cloud' | 'local', targetUrl?: string, driver?: WebDriverWithExtension<D>) => Promise<WebDriverWithExtension<D>>;
    /**
     * Opens an existing Sessionbox profile.
     *
     * @param {string} profileId - The ID of the existing profile you wish to open.
     * @param {WebDriverWithExtension} [driver] - Optional. The webdriver you wish to do the automation on. If not provided, a default option will be provided.
     * @returns {Promise<void>} A promise that resolves once the existing profile has been opened and the desired URL has been loaded in the browser.
     */
    openExistingProfile: (profileId: string, driver?: WebDriverWithExtension<D>) => Promise<WebDriverWithExtension<D>>;
    /**
     * Creates a Webdriver with a Sessionbox extension and provided driver options.
     *
     * @param {Options} [options] - Optional. The options you wish to feed to the selenium chrome driver.
     * @returns {Promise<WebDriverWithExtension>} A promise that resolves once the driver is created.
     */
    createSessionBoxDriver: (options?: O) => Promise<WebDriverWithExtension<D>>;
}
