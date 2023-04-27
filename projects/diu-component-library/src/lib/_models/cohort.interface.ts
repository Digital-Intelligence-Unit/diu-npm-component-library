export interface Caseload {
    createdDT: Date;
    username: string;
    caseloadName: string;
    caseloadList: string[];
    teamcode?: string;
}

export class CVICohort {
    username: string = null;
    name: string = null;
    data = "{}";
    teamcode?: string;
    created: Date;
    global?: boolean;

    public constructor(init?: Partial<Cohort>) {
        Object.assign(this, init);
    }
}

export class Cohort {
    id: string = null;
    user: string = null;
    cohortName: string = null;
    cohorturl = "{}";
    teamcode?: string;
    // filterObject: CohortFilters = new CohortFilters();
    isDeleted: boolean = null;

    public constructor(init?: Partial<Cohort>) {
        Object.assign(this, init);
    }
}

export class CohortFilters {
    id: string = null;
    agechart: Range = null;
    sexchart: string[] = [];
    riskchart: Range = null;
    imdchart: string[] = [];
    mosaicchart: string[] = [];
    wardmapleaflet: string[] = [];
    taxonomychart: string[] = [];
    gpmapleaflet: string[] = [];
    ltcchart: string[] = [];
    noselectedltcselect: string[] = [];
    ltccountchart: string[] = [];
    ccgselect: string[] = [];
    neighbourhoodselect: string[] = [];
    dcdatacount: number = null;
    totalPopulation: number = null;
    custBaseline: string[] = [];
    totalSelected: number = null;
    percentSelected: number = null;

    public constructor(init?: Partial<CohortFilters>) {
        Object.assign(this, init);
    }
}

export class Range {
    id?: number;
    x: number;
    y: number;
}

export const DeprivationColors = [
    "#000000",
    "#40004b",
    "#762a83",
    "#9970ab",
    "#c2a5cf",
    "#e7d4e8",
    "#d9f0d3",
    "#a6dba0",
    "#5aae61",
    "#1b7837",
    "#00441b",
];
