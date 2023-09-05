# Sessionbox One Toolkit

Easily integrate Sessionbox's API and automation features into your project with our ready-to-use toolkit. Streamline profile and team management, proxy settings and automation workflows.

- [Useful Links](#useful-links)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Getting Started](#getting-started)
- [Documentation](#documentation)
- [API docs](#sessionbox-api)
- [Selenium docs](#sessionbox-automation-with-selenium)
- [Examples](#selenium-automation-example-using-this-module)
- [Types, Enums and Interfaces](#types-enums-and-interfaces)
- [License](#license)
- [Acknowledgments](#acknowledgments)

## Useful Links

- **Homepage**: [sessionbox.io](http://sessionbox.io)
- **Issues**: [Issue tracker on Github](http://github.com/sessionbox/toolkit/issues)

## Prerequisites

Before you begin, ensure you have met the following requirements:

- **Node.js**: Make sure you have Node.js installed. This project requires a minimum Node.js version of 18.x or higher.

- **Selenium WebDriver**: Selenium WebDriver is used as a peer dependency in this project. You will need to have it installed in your project separately. You can install it using:

```bash
npm install selenium-webdriver
```
Additionally, if you're using TypeScript, it's recommended to install the TypeScript typings for Selenium WebDriver:

```bash
npm install @types/selenium-webdriver
```

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
import { sessionBoxInit } from '@sessionbox/toolkit'

const {api, selenium} =  await sessionBoxInit('your-api-key-here');
```

Once initialized, you can freely utilize any part of the package — such as the api and selenium automation — as long as your application is running and the provided API key is valid.

```javascript
const profiles = api.listProfiles();
await selenium.openNewProfile('cloud', 'https://www.sessionbox.io')
```
## Documentation

### SessionBox API

#### `listProfiles`
##### Description:
Returns a list of all Sessionbox profiles.

##### Returns:
A Promise that resolves to an array of Profile objects.

##### Example Usage:
```javascript
const profiles = await api.listProfiles();
```

#### `getProfile`
##### Description:
Return a Sessionbox profile by ID.

##### Parameters:
`profileId: string`

##### Returns:
A `Promise` that resolves to the `Profile` object corresponding to the provided ID.

##### Example Usage:
```javascript
const profile = await api.getProfile('some-profile-id');
```

#### `createProfile`
##### Description:
Creates a new Sessionbox profile with specified attributes.

##### Parameters:
`color: ColorNames`
`group: string`
`name: string`
`url: string`
`storageType: 'local' | 'cloud'`
`cookies: Cookie[]`

##### Returns:
A `Promise` that resolves to the newly created `Profile` object.

##### Example Usage:
```javascript
const newProfile = await api.createProfile(color, group, name, url, storageType, cookies);
```

#### `updateProfile`
##### Description:
Updates a Sessionbox profile by ID.

##### Parameters:
`profileId: string`
`color: ColorNames`
`group: string | undefined`
`name: string | undefined`
`sbProxyId: string | undefined`
`url: string | undefined`

##### Returns:
A `Promise` that resolves once the profile is successfully updated.

##### Example Usage:
```javascript
import { ColorNames } from '@sessionbox/toolkit';

await api.updateProfile('some-profile-id', ColorNames.BLUE, 'My Group', 'My Profile', 'proxy-id', 'https://www.sessionbox.io);
```

#### `deleteProfile`
##### Description:
Deletes a Sessionbox profile by ID.

##### Parameters:
`profileId: string`

##### Returns:
A `Promise` that resolves once the profile is deleted.

##### Example Usage:
```javascript
await api.deleteProfile('some-profile-id');
```

#### `createActionToken`
##### Description:
Returns an action token.

##### Parameters:
`action: 'cloud' | 'local' | 'temp' | 'open'`
`profileId?: string`
`url?: string`

##### Returns:
A `Promise` that resolves to the created action token.

##### Example Usage:
```javascript
const actionToken = await api.createActionToken('some-action', 'some-profile-id', 'some-url');
```

#### `addProxy`
##### Description:
Adds a proxy to Sessionbox.

##### Parameters:
`name: string`
`type: string`
`username: string`
`password: string`
`ip: string`
`port: string`
`teamId?: string`

##### Returns:
A `Promise` that resolves to whatever is returned when a proxy is added.

##### Example Usage:
```javascript
await api.addProxy(name, type, username, password, ip, port, teamId);
```

#### `listProxies`
##### Description:
Lists all proxies in Sessionbox.

##### Returns:
A `Promise` that resolves to a list of all proxies.

##### Example Usage:
```javascript
const proxies = await api.listProxies();
```

#### `removeProxy`
##### Description:
Deletes a proxy in Sessionbox by ID.

##### Parameters:
`proxyId: string`

##### Returns:
A `Promise` that resolves once the proxy is removed.

##### Example Usage:
```javascript
await api.removeProxy('some-proxy-id');
```

#### `listTeams`
##### Description:
Lists all teams in Sessionbox.

##### Returns:
A `Promise` that resolves to a list of all teams.

##### Example Usage:
```javascript
const teams = await api.listTeams();
```

### SessionBox Automation with Selenium

#### `createSessionboxDriver`
##### Description:
Generates a Selenium WebDriver with Sessionbox One extension integration.

##### Parameters:
`options?: Options`

##### Returns:
Returns a Promise that resolves to a SeleniumDriver once the extension is downloaded.

##### Example Usage:
```javascript
await selenium.openExistingProfile(options);
```

#### `openNewProfile`
##### Description:
Opens a new Sessionbox profile.

##### Parameters:
`storageType: 'cloud' | 'local' | 'temp'`
`url: string`
`driver?: SeleniumDriver`

##### Returns:
A promise that resolves once the profile has been created and the desired URL has been opened in the browser.

##### Example Usage:
```javascript
await selenium.openNewProfile('cloud', 'https://www.google.com);
```

#### `openExistingProfile`
##### Description:
Opens an existing Sessionbox profile.

##### Parameters:
`profileId: string`
`driver?: SeleniumDriver`

##### Returns:
A promise that resolves once the existing profile has been opened and the desired URL has been loaded in the browser.

##### Example Usage:
```javascript
await selenium.openExistingProfile('profile-id');
```

## Selenium Automation Example using this module

### Open a new profile

```typescript
import { sessionBoxInit } from '@sessionbox/toolkit';
import { By } from 'selenium-webdriver';

(async () => {
    const apiKey = 'your-api-key';
    const { api, selenium } = await sessionBoxInit(apiKey);

    const sessionBoxDriver = await selenium.createSessionBoxDriver();
    let driver;
    try {
        driver = await selenium.openNewProfile('temp', 'https://www.sessionbox.io', sessionBoxDriver);

        // Continue to interact with the driver as needed, such as navigating to other URLs or performing DOM manipulations
        await driver.get('https://www.github.com');
        const signInButton = await driver.findElement(By.xpath('//a[text()="Sign in"]'));
        await signInButton.click();

        const usernameField = await driver.findElement(By.id('login_field'));
        await usernameField.sendKeys('your-github-username');

    } catch (error) {
        console.error('An error occurred:', error);
    } finally {
        await sessionBoxDriver.quit();
        if (driver) {
          await driver.quit();
        }
    }
})();
```
### Open existing profile

```typescript
import { sessionBoxInit } from '@sessionbox/toolkit';

(async () => {
    const apiKey = 'your-api-key'; 
    const { api, selenium } = await sessionBoxInit(apiKey);

    const profiles = await api.listProfiles();
    const profileIds = profiles.map(profile => 
      {return profile.id
    })
    
    const sessionBoxDriver = await selenium.createSessionBoxDriver();
    let drivers: any;
    try {
        const drivers = await Promise.all(profileIds.map(async(profileId) => {
            return await selenium.openExistingProfile(profileId, sessionBoxDriver);
        }))
        console.log(drivers)
        drivers[0].get("https://www.github.com");
    } catch (error) {
        console.error('An error occurred:', error);
    } finally {
        await sessionBoxDriver.quit();
        if (drivers) {
          drivers.map(async(driver: any) => {
            driver.quit();
          })
        }
       
    }
})();
```

## Types, Enums and Interfaces

### Color Names

We've included a `ColorNames` enum to help you manage various color names consistently in your code. Here are the available color options:

- `ColorNames.RED` ![Red Color](https://via.placeholder.com/15/FF0000/000000?text=+) 
- `ColorNames.PINK` ![Pink Color](https://via.placeholder.com/15/FFC0CB/000000?text=+) 
- `ColorNames.PURPLE` ![Purple Color](https://via.placeholder.com/15/800080/000000?text=+) 
- `ColorNames.DEEP_PURPLE` ![Deep Purple Color](https://via.placeholder.com/15/512DA8/000000?text=+)  
- `ColorNames.INDIGO` ![Indigo Color](https://via.placeholder.com/15/3F51B5/000000?text=+) 
- `ColorNames.LIGHT_BLUE` ![Light Blue Color](https://via.placeholder.com/15/03A9F4/000000?text=+)  
- `ColorNames.CYAN` ![Cyan Color](https://via.placeholder.com/15/00BCD4/000000?text=+) 
- `ColorNames.TEAL` ![Teal Color](https://via.placeholder.com/15/009688/000000?text=+) 
- `ColorNames.GREEN` ![Green Color](https://via.placeholder.com/15/4CAF50/000000?text=+) 
- `ColorNames.LIGHT_GREEN` ![Light Green Color](https://via.placeholder.com/15/8BC34A/000000?text=+)  
- `ColorNames.LIME` ![Lime Color](https://via.placeholder.com/15/CDDC39/000000?text=+) 
- `ColorNames.YELLOW` ![Yellow Color](https://via.placeholder.com/15/FFEB3B/000000?text=+) 
- `ColorNames.AMBER` ![Amber Color](https://via.placeholder.com/15/FFC107/000000?text=+) 
- `ColorNames.ORANGE` ![Orange Color](https://via.placeholder.com/15/FF9800/000000?text=+) 
- `ColorNames.DEEP_ORANGE` ![Deep Orange Color](https://via.placeholder.com/15/FF5722/000000?text=+)  
- `ColorNames.BROWN` ![Brown Color](https://via.placeholder.com/15/795548/000000?text=+) 
- `ColorNames.GREY` ![Grey Color](https://via.placeholder.com/15/9E9E9E/000000?text=+) 
- `ColorNames.BLUE_GREY` ![Blue Grey Color](https://via.placeholder.com/15/607D8B/000000?text=+)  

### Storage Types

We've defined a `StorageType` enum to make it easy for you to work with different storage options. Here are the available storage types:

- `StorageType.CLOUD`: Cloud storage.
- `StorageType.LOCAL`: Local storage.
- `StorageType.TEMP`: Temporary storage.
- `StorageType.OPEN`: You can pass `StorageType.OPEN` as a parameter to *createActionToken* to create and action token for existing profiles.

### Cookie Interface

To work with cookies, we provide a `Cookie` interface with the following properties:

- `name` *- required*
- `value` *- required*
- `domain` 
- `expirationDate` 
- `hostOnly` 
- `httpOnly` 
- `path` 
- `sameSite` 
- `secure` 
- `session` 

### Profile Interface

To manage user profiles, we provide a `Profile` interface with the following properties:

- `id`: A unique identifier for the profile.
- `teamId`: The team ID associated with the profile.
- `launchUrl`: The URL to launch when this profile is loaded.
- `name`: The name of the profile.
- `color`: The color associated with the profile.
- `group`: The group to which the profile belongs.
- `icon`: The icon representing the profile.

You can use this interface to create, update, and manage user profiles within your application.

## Licence

ISC


