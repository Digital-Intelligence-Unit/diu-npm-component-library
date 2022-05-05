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
    _id: string;
    organisationcode: string;
    username: string;
    rolecode?: string;
    joindate: Date;
    enddate?: Date;
    isArchived?: boolean;
}

export interface iRoles {
    _id: string;
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
    _id: string;
    networkcode: string;
    teamcode: string;
    joindate: Date;
    enddate?: Date;
    isArchived?: boolean;
}
