export interface Profile {
    id: string,
    teamId: string,
    name: string,
    color: string,
    group: string,
    icon: string,
    urls: [{
        deletable: boolean,
        id: string,
        name: string,
        url: string
    }]
}

export interface ProfileDTO {
    id: string,
    teamId: string,
    name: string,
    color: string,
    group: string,
    icon: string,
    launchUrl: string
}

export function profileToDTO(profile: Profile): ProfileDTO {
    return {
        id: profile.id,
        teamId: profile.teamId,
        name: profile.name,
        color: profile.color,
        group: profile.group,
        icon: profile.icon,
        launchUrl: profile.urls[0].url || profile.urls[0].name
    };
}