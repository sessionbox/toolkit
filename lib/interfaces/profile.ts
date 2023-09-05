export interface Profile {
    id: string,
    teamId: string,
    name: string,
    color: string,
    group: string,
    icon: string,
    urls: {
        deletable: boolean,
        id: string,
        name: string,
        url: string
    }
}