export interface iTeamResults {
    id: string;
    joindate: string;
    teamcode: string;
    username: string;
}

export interface iTeam {
    id: string;
    name: string;
    description: string;
    code: string;
    organisationcode: string;
    responsiblepeople: any[];
}

export interface iTeamMembers {
    id: string;
    teamcode: string;
    username: string;
    organisation: string;
    rolecode?: string;
    joindate: Date;
    enddate?: Date;
}

export interface iTeamRequest {
    id?: string;
    username: string;
    teamcode: string;
    organisation: string;
    requestdate: Date;
    requestor?: string;
    requestapprover?: string;
    approveddate?: Date;
    refusedate?: Date;
    emailto: string;
}
