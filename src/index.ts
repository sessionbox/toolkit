import { WebDriver, until } from "selenium-webdriver";
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
import { urlContains } from "selenium-webdriver/lib/until";

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

     async function openNewProfile(storageType: 'temp' | 'cloud' | 'local', launchUrl?: string, driver?: SeleniumDriver): Promise<SeleniumDriver> {
        const url = await createProfileUrl(apiKey, storageType, launchUrl);
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
        return await getData(apiKey, 'http://localhost:54789/local-api/v1/profiles', 'profiles');
    }

    async function getProfile(profileId: string): Promise<Profile> {
        return await getData(apiKey, `http://localhost:54789/local-api/v1/profiles/${profileId}`, "profile");
    }

    async function createProfile(color: ColorNames, group: string, name: string, url: string, storageType: 'local' | 'cloud', cookies?: Cookie[], sbProxyId?: string): Promise<Profile> {
        const payload = {
            "color": color,
            "group": group,
            "name": name,
            "url": url,
            "storageType": storageType,
            "cookies": cookies, 
            "sbProxyId": sbProxyId
        }
        const result = await postData(apiKey, 'http://localhost:54789/local-api/v1/profiles', "profile", payload)
        return result;
    }
    
    async function updateProfile(profileId: string, color?: ColorNames | undefined, group?: string | undefined, name?: string | undefined, sbProxyId?: string | undefined, url?: string | undefined): Promise<void> {
        const payload = {
            ...(color !== undefined ? { "color": color } : { "color": undefined }),
            ...(group !== undefined ? { "group": group } : { "group": undefined }),
            ...(name !== undefined ? { "name": name } : { "name": undefined }),
            ...(sbProxyId !== undefined ? { "sbProxyId": sbProxyId } : { "sbProxyId": undefined }),
            ...(url !== undefined ? { "url": url } : { "url": undefined })
        };
        await updateData(apiKey, `http://localhost:54789/local-api/v1/profiles/${profileId}`, payload)
    }

    async function deleteProfile(profileId: string) {
        await deleteData(apiKey, `http://localhost:54789/local-api/v1/profiles/${profileId}`); 
    }

    async function createActionToken(action: "open" | "local" | "cloud" | "temp", url?: string, profileId?: string) { // action should be more specific
        let launchUrl;
        if (!url && profileId) {
            const profile = await getProfile(profileId);
            console.log(profile);
            launchUrl = profile.urls.url;
            console.log(launchUrl);
        }
        const payload: createActionTokenPayload = {
            action: action, 
            url: url || launchUrl
        }
        console.log(payload)
        
        if (action = StorageType.OPEN) {
            payload.profileId = profileId;
        }
        console.log(payload);
        const result  = await postData(apiKey, 'http://localhost:54789/local-api/v1/action-token', "token", payload);
        return result;
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
        return await postData(apiKey, 'http://localhost:54789/local-api/v1/proxies', "proxy", payload)
    }

    async function listProxies() {
        return await getData(apiKey, 'http://localhost:54789/local-api/v1/proxies', "proxies")
    }

    async function removeProxy(proxyId: string) {
        return await deleteData(apiKey, `http://localhost:54789/local-api/v1/proxies/${proxyId}`)
    }

    async function listTeams() {
        return await getData(apiKey, 'http://localhost:54789/local-api/v1/teams', "teams")
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


