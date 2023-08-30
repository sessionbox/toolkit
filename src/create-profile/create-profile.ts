import { Options } from "selenium-webdriver/chrome";
import { StorageType } from '../../lib/enums/storage-type';
import { Response } from '../../lib/interfaces/response'
import { RequestData } from '../../lib/types/request-data'

export async function createProfileUrl(apiKey: string, storageType?: string, targetUrl?: string, profileId?: string) {
    let defaultLink: string | undefined = 'https://www.google.com'
    if (storageType === undefined && targetUrl === undefined && profileId !== undefined) {
        defaultLink = undefined;
    }
    const requestData: RequestData = {
        action: storageType || StorageType.OPEN, 
        url: targetUrl || defaultLink, 
        profileId: profileId
    };
    const requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${apiKey}`
        },
        body: JSON.stringify(requestData)
    };

    const result = await fetch('http://localhost:54789/local-api/v1/action-token', requestOptions);
    if (!result) {
        throw new Error("Could not fetch resources.")
    };
    const data: Response = await result.json();
    if (data.success) {
        const token = data.token 
        if (!token) {
            throw new Error("Generating action token was unsuccessful.")
        };
        const url = `https://open.sessionbox.dev?sbo_token=${token}`; 
        return url;
    } else {
        throw new Error("Token could not be extracted.")
    }
}
