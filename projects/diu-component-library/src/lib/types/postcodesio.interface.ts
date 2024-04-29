export interface Postcodes {
    status: number;
    result: {
        postcode: string;
        quality: number;
        eastings: number;
        northings: number;
        country: string;
        nhs_ha: string;
        longitude: number;
        latitude: number;
        european_electoral_region: string;
        primary_care_trust: string;
        region: string;
        lsoa: string;
        msoa: string;
        incode: string;
        outcode: string;
        parliamentary_constituency: string;
        admin_district: string;
        parish: string;
        admin_county: null;
        admin_ward: string;
        ced: null;
        ccg: string;
        nuts: string;
        codes: { [key: string]: string };
    }
}