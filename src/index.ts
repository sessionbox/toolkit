import { WebDriver } from "selenium-webdriver";
import { createProfileUrl } from './create-profile/create-profile'
import { createWebDriver } from "../lib/utils"
import type { Options } from "selenium-webdriver/chrome";
import { addExtension, downloadExtension } from "./download-extension/download-extension";
import { getData, postData, deleteData, updateData } from '../lib/fetch'
import { StorageType } from "../lib/enums/storage-type";
import { createActionTokenPayload } from '../lib/interfaces/actionTokenPayload';
import { Profile } from '../lib/interfaces/profile'
import {Automation, WebDriverWithExtension} from '../lib/interfaces/automation'
import { ColorNames } from '../lib/enums/color-names'
import { Cookie } from '../lib/interfaces/cookie'
import { Endpoint } from '../lib/interfaces/endpoint'

function selenium(apiKey: string): Automation<WebDriver, Options> {
    type SeleniumDriver = WebDriverWithExtension<WebDriver>;
    function isWebDriverWithExtension(driver: WebDriver): driver is SeleniumDriver {
        return (driver as SeleniumDriver).sbExtension;
    }

    function checkDriver(driver: SeleniumDriver | WebDriver) {
        if (!isWebDriverWithExtension(driver)) {
            throw new Error('Driver does not have SessionBox extension installed. Please initialize driver with createSessionBoxDriver.');
        }
    }

    async function waitUntilNavigation(driver: SeleniumDriver) {
        await driver.wait(async () => {
            return driver!.getCurrentUrl().then(function (url) {
                return !url.startsWith('https://open.sessionbox.dev') && !url.startsWith('chrome-extension://');
            });
        });
    }

     async function openNewProfile(storageType: 'temp' | 'cloud' | 'local', targetUrl?: string, driver?: SeleniumDriver): Promise<SeleniumDriver> {
        const url = await createProfileUrl(apiKey, storageType, targetUrl);
        if (!driver) {
            driver = await createSessionBoxDriver();
        }
        checkDriver(driver);
        await driver.get(url);
        await waitUntilNavigation(driver);
        return driver!;
    }

    async function openExistingProfile(profileId: string, driver?: SeleniumDriver ): Promise<SeleniumDriver> {
        const url = await createProfileUrl(apiKey, undefined, undefined, profileId);
        if (!driver) {
            driver = await createSessionBoxDriver();
        }
        checkDriver(driver);
        await driver.get(url);
        await waitUntilNavigation(driver);
        return driver;
    }

    async function createSessionBoxDriver(options?: Options): Promise<SeleniumDriver> {
        await downloadExtension();
        let optionsWithExtension= addExtension(options || undefined);
        const driver = await createWebDriver(optionsWithExtension) as any;
        driver.sbExtension = true;
        return driver
    }
    return {
        openNewProfile, 
        openExistingProfile,
        createSessionBoxDriver: createSessionBoxDriver
    }
}

function api(apiKey: string): Endpoint {
    async function listProfiles(): Promise<Profile[]> {
        return await getData(apiKey, 'http://localhost:54789/local-api/v1/profiles');
    }

    async function getProfile(profileId: string): Promise<Profile> {
        return await getData(apiKey, `http://localhost:54789/local-api/v1/profiles/${profileId}`);
    }

    async function createProfile(color: ColorNames, group: string, name: string, url: string, storageType: 'local' | 'cloud', cookies: Cookie[]) {
        const payload = {
            "color": color,
            "group": group,
            "name": name,
            "url": url,
            "storageType": storageType,
            "cookies": cookies
        }
        const result = await postData(apiKey, 'http://localhost:54789/local-api/v1/profiles', payload)
        return result;
    }
    
    async function updateProfile(profileId: string, color?: ColorNames | undefined, group?: string | undefined, name?: string | undefined, sbProxyId?: string | undefined, url?: string | undefined): Promise<void> {
        const payload = {
            ...(color !== undefined && { "color": color }),
            ...(group !== undefined && { "group": group }),
            ...(name !== undefined && { "name": name }),
            ...(sbProxyId !== undefined && { "sbProxyId": sbProxyId }),
            ...(url !== undefined && { "url": url })
        };
        await updateData(apiKey, `http://localhost:54789/local-api/v1/profiles/${profileId}`, payload)
    }

    async function deleteProfile(profileId: string) {
        await deleteData(apiKey, `http://localhost:54789/local-api/v1/profiles/${profileId}`); 
    }

    async function createActionToken(action: string, profileId?: string, url?: string) { // action should be more specific
        const payload: createActionTokenPayload = {
            action: action, 
            url: url
        }

        if (action = StorageType.OPEN) {
            payload.profileId = profileId;
        }
        const result  = await postData(apiKey, 'http://localhost:54789/local-api/v1/action-token', payload);
        if (result.success) {
            return result.token;
        } else {
            throw new Error('Token not found');
        }
    }

    async function addProxy(name: string, type: string, username: string, password: string, ip: string, port: string, teamId?: string) {  
        const payload =  {
            name: name,
            type: type,
            username: username, 
            password: password, 
            ip: ip,
            port: port,
            teamId: teamId
        }
        return await postData(apiKey, 'http://localhost:54789/local-api/v1/proxies', payload)
    }

    async function listProxies() {
        return await getData(apiKey, 'http://localhost:54789/local-api/v1/proxies')
    }

    async function removeProxy(proxyId: string) {
        return await deleteData(apiKey, `http://localhost:54789/local-api/v1/proxies/${proxyId}`)
    }

    async function listTeams() {
        return await getData(apiKey, 'http://localhost:54789/local-api/v1/teams')
    }

    return {
        listProfiles, 
        getProfile, 
        createProfile,
        deleteProfile, 
        updateProfile, 
        createActionToken, 
        addProxy, 
        removeProxy,
        listProxies,
        listTeams
    }
}

/**
 * Initializes the SessionBox API and Automation instances.
 *
 * @param {string} apiKey - The API key for authentication.
 * @returns {{ sessionBoxAPI: Endpoint, sessionBoxAutomation: Automation }} An object containing initialized API and Automation instances.
 */
export function sessionBoxInit(apiKey: string): { api: Endpoint, selenium: Automation<WebDriver, Options>} {
    const seleniumAutomation = selenium(apiKey);
    const sessionBoxAPI = api(apiKey);
    return { api: sessionBoxAPI, selenium: seleniumAutomation };
}


// re-exports
export { ColorNames } from '../lib/enums/color-names';
export { StorageType } from '../lib/enums/storage-type'
export { Cookie } from '../lib/interfaces/cookie';
export { Profile } from '../lib/interfaces/profile';
export { Response } from '../lib/interfaces/response'


