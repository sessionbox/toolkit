# Sessionbox One Toolkit

Easily integrate Sessionbox's API and automation features into your project with our ready-to-use package. Streamline profile and team management, proxy settings and automation workflows.

## Installation


Install the package using npm:

```bash
npm install @sessionbox/toolkit
```


Or with yarn:

```bash
yarn add @sessionbox/toolkit
```

## Getting Started

To begin, initialize the package by inserting your API key, which can be located in your Sessionbox One settings.

```javascript
import { init } from '@sessionbox/toolkit'

const {sessionBoxAPI, sessionBoxAutomation} =  await init('your-api-key-here');
```

Once initialized, you can freely utilize any part of the package—such as sessionBoxAPI and sessionBoxAutomation—as long as your application is running and the provided API key is valid.

```javascript
import { init, sessionBoxAPI } from '@sessionbox/toolkit'

await init('your-api-key-here');
const profiles = sessionBoxAPI.listProfiles();
```
## API Documentation

1. SessionBox API

    ### `listProfiles`
    #### Description:
    Returns a list of all Sessionbox profiles.

    #### Returns:
    A Promise that resolves to an array of Profile objects.

    #### Example Usage:
    ```javascript
    const profiles = await sessionBoxAPI.listProfiles();
    ```

    ### `getProfile`
    #### Description:
    Return a Sessionbox profile by ID.

    #### Parameters:
    `profileId: string`

    #### Returns:
    A `Promise` that resolves to the `Profile` object corresponding to the provided ID.

    #### Example Usage:
    ```javascript
    const profile = await sessionBoxAPI.getProfile('some-profile-id');
    ```

    ### `createProfile`
    #### Description:
    Creates a new Sessionbox profile with specified attributes.

    #### Parameters:
    `color: ColorNames`
    `group: string`
    `name: string`
    `url: string`
    `storageType: 'local' | 'cloud'`
    `cookies: Cookie[]`

    #### Returns:
    A `Promise` that resolves to the newly created `Profile` object.

    #### Example Usage:
    ```javascript
    const newProfile = await sessionBoxAPI.createProfile(color, group, name, url, storageType, cookies);
    ```

    ### `createActionToken`
    #### Description:
    Returns an action token.

    #### Parameters:
    `action: string`
    `profileId?: string`
    `url?: string`

    #### Returns:
    A `Promise` that resolves to the created action token.

    #### Example Usage:
    ```javascript
    const actionToken = await sessionBoxAPI.createActionToken('some-action', 'some-profile-id', 'some-url');
    ```

    ### `deleteProfile`
    #### Description:
    Deletes a Sessionbox profile by ID.

    #### Parameters:
    `profileId: string`

    #### Returns:
    A `Promise` that resolves once the profile is deleted.

    #### Example Usage:
    ```javascript
    await sessionBoxAPI.deleteProfile('some-profile-id');
    ```

    ### `addProxy`
    #### Description:
    Adds a proxy to Sessionbox.

    #### Parameters:
    `name: string`
    `type: string`
    `username: string`
    `password: string`
    `ip: string`
    `port: string`
    `teamId?: string`

    #### Returns:
    A `Promise` that resolves to whatever is returned when a proxy is added.

    #### Example Usage:
    ```javascript
    await sessionBoxAPI.addProxy(name, type, username, password, ip, port, teamId);
    ```

    ### `listProxies`
    #### Description:
    Lists all proxies in Sessionbox.

    #### Returns:
    A `Promise` that resolves to a list of all proxies.

    #### Example Usage:
    ```javascript
    const proxies = await sessionBoxAPI.listProxies();
    ```

    ### `removeProxy`
    #### Description:
    Deletes a proxy in Sessionbox by ID.

    #### Parameters:
    `proxyId: string`

    #### Returns:
    A `Promise` that resolves once the proxy is removed.

    #### Example Usage:
    ```javascript
    await sessionBoxAPI.removeProxy('some-proxy-id');
    ```

    ### `listTeams`
    #### Description:
    Lists all teams in Sessionbox.

    #### Returns:
    A `Promise` that resolves to a list of all teams.

    #### Example Usage:
    ```javascript
    const teams = await sessionBoxAPI.listTeams();
    ```

2. SessionBox Automation

    ### `openNewProfile`
    #### Description:
    Opens a new Sessionbox profile.

    #### Parameters:
    `storageType: 'cloud' | 'local' | 'temp'`
    `url: string`
    `options?: Options`

    #### Returns:
    A promise that resolves once the profile has been created and the desired URL has been opened in the browser.

    #### Example Usage:
    ```javascript
   await sessionBoxAutomation.openNewProfile('cloud', 'https://www.google.com);
    ```

    ### `openExistingProfile`
    #### Description:
    Opens an existing Sessionbox profile.

    #### Parameters:
    `profileId: string`
    `options?: Options`

    #### Returns:
   A promise that resolves once the existing profile has been opened and the desired URL has been loaded in the browser.

    #### Example Usage:
    ```javascript
   await sessionBoxAutomation.openExistingProfile('profile-id');
    ```