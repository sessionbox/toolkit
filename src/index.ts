import { WebDriver } from "selenium-webdriver";
import { createTempProfileUrl } from './create-profile/create-profile'
import { createWebDriver } from "../lib/utils"
import { Options } from "selenium-webdriver/chrome";
import { addExtension, downloadExtension } from "./download-extension/download-extension";
import { getData, postData, deleteData, updateData } from '../lib/fetch'
import 'dotenv/config';
import { StorageType } from "../lib/enums/storage-type";
import { createActionTokenPayload } from '../lib/interfaces/actionTokenPayload';
import { Profile } from '../lib/interfaces/profile'
import { Automation } from '../lib/interfaces/automation'
import { ColorNames } from '../lib/enums/color-names'
import { Cookie } from '../lib/interfaces/cookie'
import { Endpoint } from '../lib/interfaces/endpoint'

export let sessionBoxAPI: Endpoint;
export let sessionBoxAutomation: Automation;

export async function automation(apiKey: string): Promise<Automation> {
     async function openNewProfile(storageType: 'temp' | 'cloud' | 'local', targetUrl?: string, options?: Options): Promise<void> { 
        const driver = await createSessionboxDriver(options);
        const url = await createTempProfileUrl(apiKey, storageType, targetUrl);
        driver.get(url);
    }
    async function openExistingProfile(profileId: string, driverOptions?: Options ) {
        const driver = await createSessionboxDriver(driverOptions);
        const url = await createTempProfileUrl(apiKey, undefined, undefined, profileId);
        driver.get(url);
    }
    async function createSessionboxDriver(options?: Options): Promise<WebDriver> {
        await downloadExtension();
        let optionsWithExtension= addExtension(options || undefined);
        const driver = await createWebDriver(optionsWithExtension);
        return driver
    }
    return {
        openNewProfile, 
        openExistingProfile,
        createSessionboxDriver
    }
}

export async function api(apiKey: string): Promise<Endpoint> {
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

    async function createActionToken(action: string, profileId?: string, url?: string) {
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
        listTeams,

    }
}

export async function init(apiKey: string) {
    sessionBoxAutomation = await automation(apiKey);
    sessionBoxAPI = await api(apiKey);
}


// re-exports
export { ColorNames } from '../lib/enums/color-names';
export { StorageType } from '../lib/enums/storage-type'
export { Cookie } from '../lib/interfaces/cookie';
export { Profile } from '../lib/interfaces/profile';
export { Response } from '../lib/interfaces/response'


