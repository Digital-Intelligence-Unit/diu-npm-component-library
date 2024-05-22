import { iTeam } from "./teams.interface";

/**
 * Organisation Elements Type
 */
export interface iOrganisation {
    /**
     * Organisation Name
     */
    name: string;
    /**
     * Organisation Authentication Method
     */
    authmethod: string;
    /**
     * Organisation Short code
     */
    code?: string;
    /**
     * Organisation contact person email
     */
    contact?: string;
}

export interface iOrganisationMembers {
    id: string;
    organisationcode: string;
    username: string;
    rolecode?: string;
    joindate: Date;
    enddate?: Date;
}

export interface iRoles {
    id: string;
    code: string;
    name: string;
    description: string;
    organisationcode: string;
    permissioncodes: string[];
    responsiblepeople: string[];
}

export interface iNetwork {
    name: string;
    description: string;
    code: string;
    archive: boolean;
    responsiblepeople: any[];
    teams?: iTeam[];
}

export interface iNetworkMembers {
    id: string;
    networkcode: string;
    teamcode: string;
    joindate: Date;
    enddate?: Date;
}
