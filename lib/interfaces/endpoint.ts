import { ColorNames } from '../enums/color-names';
import { Cookie } from './cookie';
import { Profile, ProfileDTO } from './profile'

export interface Endpoint {
    /**
     * Returns a list of all Sessionbox profiles.
     *
     * @returns {Promise<Profile[]>} A promise containing an array of Profile objects.
     */
    listProfiles: () => Promise<ProfileDTO[]> 
    
    /**
     * Return a Sessionbox profile by ID.
     * @param {string} profileID - The ID of the profile to retrieve.
     * @returns {Promise<Profile>} A Promise containing the Profile object corresponding to the provided ID.
     */
    getProfile: (profileId: string) => Promise<ProfileDTO> 

    /**
     * Creates a Sessionbox profile with the specified attributes.
     *
     * @param {string} color - Profile color.
     * @param {string} group - Profile group.
     * @param {string} name - Profile name.
     * @param {string} url - Profile URL.
     * @param {string} storageType - Profile storage type. Can be 'local' or 'cloud'.
     * @param {string} cookies - Profile cookies (Optional).
     * @returns {Promise<Profile>} A promise that resolves to the result of the profile creation.
     */
    createProfile: (color: ColorNames, group: string, name: string, url: string, storageType: 'local' | 'cloud', cookies?: Cookie[], sbProxyId?: string) => Promise<Profile>;

    /**
     * Returns an action token.
     *
     * @param action - Profile color.
     * @param url - Profile URL (Optional).
     * @param profileId - Profile Id (Optional).
     * @returns {Promise<string>} A promise that resolves to the created action token.
     */
    createActionToken: (action: "open" | "local" | "cloud" | "temp", url?: string, profileId?: string) => Promise<string>;

    /**
     * Deletes a Sessionbox profile by ID.
     *
     * @param {string} profileId - The ID of the profile to delete.
     */
    deleteProfile: (profileId: string) => Promise<void>;

    /**
     * Updates Sessionbox profile by ID.
     *
     * @param {string} profileId -The ID of the profile to update.
     * @param {string} color - Profile color (optional).
     * @param {string} group - Profile group (optional).
     * @param {string} name - Profile name (optional).
     * @param {string} sbProxyId - Id of proxy (optional).
     * @param {string} url - Profile URL (optional). 
     * @returns {Promise<Profile>} A promise that resolves to the result of the updated profile.
     */
    updateProfile: (profileId: string, color?: ColorNames, group?: string, name?: string, sbProxyId?: string, url?: string) => Promise<void>;

    /**
     * Adds a proxy to Sessionbox.
     *
     * @param {string} name - Proxy name.
     * @param {string} type - Proxy type.
     * @param {string} username - Proxy username.
     * @param {string} password - Proxy password.
     * @param {string} ip - Proxy IP.
     * @param {string} port - Proxy port.
     * @param {string} teamId - Team ID (optional). If not provided, it will be saved to the personal account.
     */
    addProxy: (name: string, type: string, username: string, password: string, ip: string, port: string, teamId?: string) => Promise<any>;

    /**
     * Lists all proxies in Sessionbox.
     */
    listProxies: () => Promise<any>;

    /**
     * Deletes a proxy in Sessionbox by ID.
     *
     * @param proxyId - The ID of the proxy to delete.
     */
    removeProxy: (proxyId: string) => Promise<void>;

    /**
     * Lists all teams in Sessionbox.
     */
    listTeams: () => Promise<any>;
   
}