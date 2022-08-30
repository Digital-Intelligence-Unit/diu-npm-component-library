import { HttpClient } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { iCredentials, iFullUser } from "../_models/user.interface";
import { BaseService } from "./_baseclass.service";
import { map } from "rxjs/operators";
import { iTeam, iTeamMembers, iTeamRequest } from "../_models/teams.interface";
import { iOrganisation } from "../_models/organisation.interface";
import { iApplication, iNewsFeed } from "../_models/installations.interface";

/**
 * API Service Class
 */
@Injectable({
    providedIn: "root",
})
export class APIService extends BaseService {
    /**
     * Authentication API Service Constructor
     */
    constructor(protected http: HttpClient, @Inject("environment") environment) {
        super(http, environment);
        const origin = window.location.href;
        this.baseUrl = this.combineURL(origin, "api");
    }

    // Authentication
    public register(payload: any) {
        return this.http.post(this.baseUrl + "users/register/", payload);
    }

    public login(credentials: iCredentials) {
        return this.http.post(this.baseUrl + "users/authenticate", credentials).pipe(map((response: any) => response));
    }

    public refreshAuthenticatedUser() {
        return this.http.post(this.baseUrl + "users/authentication-refresh", null);
    }

    public logout(redirect: string) {
        document.location.href = redirect;
    }

    // ACCESS LOGS

    public getAllAccessLogs(filters: { date?: string; type?: string; pageKey?: string }) {
        return this.http.get(this.baseUrl + "access-logs", {
            params: filters,
        });
    }

    public getAllAccessLogsByUser(filters: { user: string; date?: string; pageKey?: string }) {
        return this.http.get(`${this.baseUrl}${encodeURIComponent(filters.user)}/access-logs`, {
            params: filters,
        });
    }

    public getAllAccessLogsStatistics(date_from?: string, date_to?: string) {
        return this.http.get(this.baseUrl + "access-logs/statistics", {
            params: {
                date_from,
                date_to,
            },
        });
    }

    public createAccessLog(payload: any) {
        return this.http.post(this.baseUrl + "access-logs/create", payload);
    }

    // APPLICATION

    public getApps() {
        return this.http.get(this.baseUrl + "apps/");
    }

    public addApp(payload: iApplication) {
        return this.http.post(this.baseUrl + "apps/create/", payload);
    }

    public updateApp(payload: iApplication) {
        return this.http.put(this.baseUrl + "apps/update", payload);
    }

    public archiveApp(payload: iApplication) {
        return this.http.delete(this.baseUrl + "apps/delete", { body: payload });
    }

    // CAPABILITIES

    /**
     * GET: Method to get all capabilities
     *
     * @returns HTTP GET Promise
     */
    public getCapabilities() {
        return this.http.get(this.baseUrl + "capabilities");
    }

    /**
     * GET: Method to get capability by id
     *
     * @returns HTTP GET Promise
     */
    public getCapabilityById(id: string | number) {
        return this.http.get(`${this.baseUrl}capabilities/${id}`);
    }

    /**
     * POST: Method to create capability
     *
     * @returns HTTP POST Promise
     */
    public createCapability(payload) {
        return this.http.post(this.baseUrl + "capabilities/create", payload);
    }

    /**
     * POST: Method to update capability
     *
     * @returns HTTP POST Promise
     */
    public updateCapability(payload) {
        return this.http.put(this.baseUrl + "capabilities/update", payload);
    }

    /**
     * DELETE: Method to delete capability
     *
     * @returns HTTP POST Promise
     */
    public deleteCapability(id) {
        return this.http.delete(this.baseUrl + "capabilities/delete", { body: { id } });
    }

    public getAllCapabilitiesByTag(tags: string) {
        return this.http.get(this.baseUrl + "capabilities/getByTag?tags=" + tags);
    }

    public getAllCapabilitiesByTagsAnd(tags: string[]) {
        return this.http.get(this.baseUrl + "capabilities/getByTagsAnd?tags=" + tags.toString());
    }

    public getAllCapabilitiesByTagsOr(tags: string[]) {
        return this.http.get(this.baseUrl + "capabilities/getByTagsOr?tags=" + tags.toString());
    }

    public getCapabilitiesByRoleName(roleName: string) {
        return this.http.get(this.baseUrl + "capabilities/getByRoleName?roleName=" + roleName);
    }

    public getAllCapabilitiesByTeamIDs(teamname: string[]) {
        return this.http.get(this.baseUrl + "capabilities/getByTeamIDs?teamname=" + teamname.toString());
    }

    public getAllCapabilitiesWithTeamAndUsername(teamname: string[], username: string) {
        return this.http.post(this.baseUrl + "capabilities/getAllCapabilitiesWithTeamAndUsername", {
            teamname,
            username,
        });
    }

    public createCapabiltiesLink(capability_id: number, link_id: string, link_type: string, valuejson: any = null) {
        return this.http.post(this.baseUrl + "capabilities/links/create", {
            capability_id,
            link_id,
            link_type,
            ...(valuejson !== null && { valuejson }),
        });
    }

    public deleteCapabilitiesLink(capability_id: number, link_id: string, link_type: string) {
        return this.http.delete(this.baseUrl + "capabilities/links/delete", {
            body: { capability_id, link_id, link_type },
        });
    }

    /**
     * GET: Method to get a list of capabilities with a link and type combo
     *
     * @returns HTTP POST Promise
     */
    public getCapabilitiesByTypeId(linkType: string, linkId: string) {
        return this.http.get(`${this.baseUrl}${linkType}/${encodeURIComponent(linkId)}/capabilities`);
    }

    /**
     * POST: Method to sync a list of capability ids with a link and type combo
     *
     * @returns HTTP POST Promise
     */
    public syncCapabilityLinks(ids, linkType, linkId) {
        return this.http.post(this.baseUrl + "capabilities/links/sync", {
            capabilities: ids,
            link_type: linkType,
            link_id: linkId,
        });
    }

    // Cohorts

    /**
     * GET: Method to return all PHMv1 cohorts
     */
    public getCohorts() {
        return this.http.get(this.baseUrl + "cohorts/");
    }

    /**
     * GET: Method to return all PHMv1 cohorts assigned to a user
     */
    public getCohortsByUsername(username: string) {
        return this.http.get(this.baseUrl + "cohorts/?username=" + username);
    }

    /**
     * GET: Method to return all PHMv1 cohorts assigned to a team
     */
    public getCohortsByTeamcode(teamcode: string) {
        return this.http.get(this.baseUrl + "cohorts/?teamcode=" + teamcode);
    }

    /**
     * POST: Method to create a new PHMv1 cohort
     */
    public createCohort(payload) {
        return this.http.post(this.baseUrl + "cohorts/create", payload);
    }

    /**
     * PUT: Method to update an existing PHMv1 cohort
     */
    public updateCohort(payload) {
        return this.http.put(this.baseUrl + "cohorts/update", payload);
    }

    /**
     * DELETE: Method to delete an PHMv1 cohort
     */
    public deleteCohort(payload) {
        return this.http.delete(this.baseUrl + "cohorts/delete", { body: payload });
    }

    // CONFLUENCE

    public searchConfluenceContent(keyword: string) {
        return this.http.get(this.baseUrl + "confluence/content/search?keyword=" + keyword);
    }

    public getConfluenceContent(id: string) {
        return this.http.get(this.baseUrl + "confluence/content/" + id);
    }

    // CVICohorts

    /**
     * GET: Method to return all PHMv2 cohorts
     */
    public getCVICohorts() {
        return this.http.get(this.baseUrl + "cvicohorts/");
    }

    /**
     * GET: Method to return all PHMv2 cohorts assigned to a user
     */
    public getCVICohortsByUsername(username: string) {
        return this.http.get(this.baseUrl + "cvicohorts/?username=" + username);
    }

    /**
     * GET: Method to return all PHMv2 cohorts assigned to a team
     */
    public getCVICohortsByTeamcode(teamcode: string) {
        return this.http.get(this.baseUrl + "cvicohorts/?teamcode=" + teamcode);
    }

    /**
     * POST: Method to create a new PHMv2 cohort
     */
    public createCVICohort(payload) {
        return this.http.post(this.baseUrl + "cvicohorts/create", payload);
    }

    /**
     * PUT: Method to update an existing PHMv2 cohort
     */
    public updateCVICohort(payload) {
        return this.http.put(this.baseUrl + "cvicohorts/update", payload);
    }

    /**
     * DELETE: Method to delete an PHMv2 cohort
     */
    public deleteCVICohort(payload) {
        return this.http.delete(this.baseUrl + "cvicohorts/delete", { body: payload });
    }

    // DASHBOARDS

    public getDashboards() {
        return this.http.get(this.baseUrl + "dashboards/");
    }

    public addDashboard(payload: iApplication) {
        return this.http.post(this.baseUrl + "dashboards/create/", payload);
    }

    public updateDashboard(payload: iApplication) {
        return this.http.put(this.baseUrl + "dashboards/update", payload);
    }

    public archiveDashboard(payload: iApplication) {
        return this.http.delete(this.baseUrl + "dashboards/delete", { body: payload });
    }

    // DEMOGRAPHICS

    /**
     * GET: Method to retrieve a patients demographics
     */
    public getPatientDemographics(nhsnumber: string) {
        return this.http.get(this.baseUrl + "demographics/demographicsbynhsnumber?NHSNumber=" + nhsnumber);
    }

    /**
     * POST: Method to validate a patient's NHS number
     */
    public valiateNHSNumber(payload: any) {
        return this.http.post(this.baseUrl + "demographics/valiateNHSNumber/", payload);
    }

    /**
     * POST: Method to retrieve a patients NHS number
     */
    public findNHSNumber(payload: any) {
        return this.http.post(this.baseUrl + "demographics/findMyNHSNumber/", payload);
    }

    // DOCOBO

    public getAllDocoboAcknowledgements() {
        return this.http.get(this.baseUrl + "docobo/acknowledgements/");
    }

    public reportDocoboAcknowledgements(payload: any) {
        return this.http.post(this.baseUrl + "docobo/acknowledgements/report/", payload);
    }

    // DOCOBOOUTBOUND

    public getDocoboOutboundPatientsByOrg(orgcode: string) {
        return this.http.post(this.baseUrl + "docobooutbound/getpatientsbyorg/", { orgcode });
    }

    public getDocoboOutboundPatientData(patientid: string) {
        return this.http.post(this.baseUrl + "docobooutbound/getpatientdata/", { patientid });
    }

    public getProcessForDocoboOutbound() {
        return this.http.get(this.baseUrl + "docobooutbound/processDocoboInfo/");
    }

    // GOVUKNOTIFY

    public govukCallback(payload) {
        return this.http.post(this.baseUrl + "govuknotify/callback", payload);
    }

    public govukMainCallback(payload) {
        return this.http.post(this.baseUrl + "govuknotify/maincallback", payload);
    }

    // GPINPATIENTS

    /**
     * POST: Method to create a token if the JWT is authorised to include in other calls
     */
    public authenticate() {
        return this.http.post(this.baseUrl + "gpinpatients/authenticate", null);
    }

    /**
     * POST: Method to retrieve inpatient count
     */
    public inpatientCounts(token: string) {
        return this.http.post(this.baseUrl + "gpinpatients/inpatientcounts", {
            token,
        });
    }

    /**
     * POST: Method to retrieve outpatient count
     */
    public outpatientCounts(token: string) {
        return this.http.post(this.baseUrl + "gpinpatients/outpatientcounts", {
            token,
        });
    }

    /**
     * POST: Method to retrieve accident & emergency patient count
     */
    public aeCounts(token: string) {
        return this.http.post(this.baseUrl + "gpinpatients/aecounts", {
            token,
        });
    }

    /**
     * POST: Method to retrieve enhanced care service patient count
     */
    public ecsCounts(token: string) {
        return this.http.post(this.baseUrl + "gpinpatients/ecscounts", {
            token,
        });
    }

    /**
     * POST: Method to retrieve enhanced primary care patient count
     */
    public epcCounts(token: string) {
        return this.http.post(this.baseUrl + "gpinpatients/epccounts", {
            token,
        });
    }

    /**
     * POST: Method to retrieve inpatient GP summary
     */
    public inpatientGPSummary(token: string) {
        return this.http.post(this.baseUrl + "gpinpatients/inpatientgpsummary", {
            token,
        });
    }

    /**
     * POST: Method to retrieve Accident & Emergency GP summary
     */
    public aeGPSummary(token: string) {
        return this.http.post(this.baseUrl + "gpinpatients/aegpsummary", {
            token,
        });
    }

    // GPPRACTICES

    /**
     * GET: Method to retrieve all GP Practices
     */
    public getGPPractices() {
        return this.http.get(this.baseUrl + "gppractices");
    }

    // GRANDINDEX

    /**
     * GET: Method to retrieve all Grand Index data for Mosaic
     */
    public getGrandIndex() {
        return this.http.get(this.baseUrl + "grandindex");
    }

    // HOUSEHOLDISOCHRONE

    /**
     * POST: Method to retrieve all households within a given isochrone
     */
    public getHouseholdIsochrone(isochrone_bounds: string) {
        return this.http.post(this.baseUrl + "isochrone/houses-within-isochrone", isochrone_bounds);
    }

    // LPRESVIEWER

    /**
     * POST: Method to retrieve LPRES validation key
     */
    public getLPRESViewerValidationKey(nhsnumber: string) {
        return this.http.post(this.baseUrl + "lpresviewer/generate-validation-key", nhsnumber);
    }

    // MFA

    /**
     * Function to check if logged in user has MFA setup
     *
     * @returns HTTP GET Promise
     */
    checkMFA() {
        return this.http.get(this.baseUrl + "mfa/checkmfa/");
    }

    /**
     * Function to begin registration of a device for MFA
     *
     * @returns HTTP GET Promise
     */
    registerMFA() {
        return this.http.get(this.baseUrl + "mfa/register/");
    }

    /**
     * Function to register a device for MFA
     *
     * @returns HTTP POST Promise
     */
    verifyMFA(token, tempSecret) {
        return this.http.post(this.baseUrl + "mfa/verify/", {
            token,
            tempSecret,
        });
    }

    /**
     * Function to validate a device already registered for MFA
     *
     * @returns HTTP POST Promise
     */
    validateMFA(token) {
        return this.http.post(this.baseUrl + "mfa/validate/", {
            token,
        });
    }

    /**
     * Function to unregister a device for MFA
     *
     * @returns HTTP GET Promise
     */
    unregisterMFA() {
        return this.http.get(this.baseUrl + "mfa/unregister/");
    }

    /**
     * POST: Method to validate a one-time token for access
     */
    public validateOTPCode(code: string) {
        return this.http.post(this.baseUrl + "otp/validate", { code });
    }

    /**
     * GET: Method to generate a one-time token for access
     */
    public generateOTPCode() {
        return this.http.get(this.baseUrl + "otp/generate");
    }

    // MOSAIC

    public getMosiacs() {
        return this.http.get(this.baseUrl + "mosaic");
    }

    public getCodefromPostCode(code: string) {
        return this.http.get(this.baseUrl + "mosaic?postcode=" + code);
    }

    // NEWSFEEDS

    /**
     * GET: Method to retrieve news feeds
     */
    public getNewsFeeds() {
        return this.http.get(this.baseUrl + "newsfeeds/");
    }
    public addNewsFeed(payload: iNewsFeed) {
        return this.http.post(this.baseUrl + "newsfeeds/create/", payload);
    }
    public updateNewsFeed(payload: iNewsFeed) {
        return this.http.put(this.baseUrl + "newsfeeds/update", payload);
    }
    public archiveNewsFeed(payload: iNewsFeed) {
        return this.http.delete(this.baseUrl + "newsfeeds/delete", {
            body: payload,
        });
    }

    // NICEEVIDENCE

    /**
     * POST: Method to search guidance from NICE
     */
    public searchNICEEvidence(search_query: string, search_length?: number) {
        return this.http.post(this.baseUrl + "niceevidence/evidencesearch", { search_query, search_length });
    }

    // OPENSOURCE

    public getOpenSourceByPage(page: string, limit: string) {
        return this.http.post(this.baseUrl + "opensource/getByPage", {
            page,
            limit,
        });
    }

    public addOpenSourceView(payload: { page: string; parent: string }) {
        return this.http.post(this.baseUrl + "opensource/addView", payload);
    }

    // ORGANISATIONS

    public getOrganisations() {
        return this.http.get(this.baseUrl + "organisations");
    }

    public addOrganisation(payload: iOrganisation) {
        return this.http.post(this.baseUrl + "organisations/create/", payload);
    }

    public updateOrganisation(payload: iOrganisation) {
        return this.http.put(this.baseUrl + "organisations/update", payload);
    }

    public removeOrganisation(payload: iOrganisation) {
        return this.http.delete(this.baseUrl + "organisations/delete", { body: payload });
    }

    // (ORG)BOUNDARIES

    public getOrgBoundaries() {
        return this.http.get(this.baseUrl + "orgboundaries/topo-json");
    }

    // OUTBREAK

    /**
     * GET: Method to retrieve all Outbreak map information
     */
    public getOutbreakGeoJson() {
        return this.http.get(this.baseUrl + "outbreak/mapinfo");
    }

    // PASSWORD

    public updatePassword(username: any, authmethod: any, newPassword: any, code: any = null) {
        return this.http.put(this.baseUrl + "password/update", {
            username,
            authmethod,
            newpassword: newPassword,
            code,
        });
    }

    //  /**
    //  * POST: Method to generate a password for a new starter
    //  */
    //      public generatePassword(payload: any) {
    //       return this.http.post(this.baseUrl + "password/generate", payload);
    //   }

    //   /**
    //    * POST: Method to validate a password for a new starter
    //    */
    //   public verifyPassword(payload: any) {
    //       return this.http.post(this.baseUrl + "password/verify", payload);
    //   }

    // PATIENTHISTORY

    /**
     * GET: Method to retrieve a patients history
     */
    public getPatientHistory(nhsnumber: string) {
        return this.http.get(this.baseUrl + "patienthistory/patienthistorybynhsnumber?NHSNumber=" + nhsnumber);
    }

    /**
     * GET: Method to retrieve a patients council data
     */
    public getDistrictHistory(nhsnumber: string) {
        return this.http.get(this.baseUrl + "patienthistory/districthistorybynhsnumber?NHSNumber=" + nhsnumber);
    }

    // PATIENTLISTS

    /**
     * GET: Method to retrieve all patients
     */
    public getPatients(limit: string) {
        return this.http.get(this.baseUrl + "patientlists/?Limit=" + limit);
    }

    /**
     * GET: Method to retrieve all patients from a cohort
     */
    public getPatientsByCohort(limit: string, cohort: string) {
        return this.http.get(this.baseUrl + "patientlists/getPatientsByCohort?limit=" + limit + "&cohort=" + cohort);
    }

    /**
     * GET: Method to retrieve a patients details
     */
    public getPatientDetail(nhsnumber: string) {
        return this.http.get(this.baseUrl + "patientlists/patientdetailsbynhsnumber?NHSNumber=" + nhsnumber);
    }

    // PCNINFORMATION

    public getTopoJSON() {
        return this.http.get(this.baseUrl + "pcninformation/topo-json");
    }

    public getPCNInformation() {
        return this.http.get(this.baseUrl + "pcninformation");
    }

    public getHexGeojson() {
        return this.http.get(this.baseUrl + "pcninformation/hexgeo-json");
    }

    // POINTSOFINTEREST

    public getPointsOfInterest() {
        return this.http.get(this.baseUrl + "pointsofinterest");
    }

    // POSTCODES

    public getAllPostcodes() {
        return this.http.get(this.baseUrl + "postcodes/");
    }

    /**
     * GET: Method to retrieve all Postcode map lookups
     */
    public getPostcodeLookup() {
        return this.http.get(this.baseUrl + "postcodes/postcode-lookup");
    }

    // REAL TIME SURVEILLANCE
    public getSPIIncidents() {
        return this.http.get(this.baseUrl + "real_time_surveillance/");
    }

    public createSPIIncident(payload: any) {
        return this.http.post(this.baseUrl + "real_time_surveillance/create", payload);
    }

    public updateSPIIncident(payload: any) {
        return this.http.put(this.baseUrl + "real_time_surveillance/update", payload);
    }

    public deleteSPIIncident(payload: any) {
        return this.http.delete(this.baseUrl + "real_time_surveillance/delete", { body: payload });
    }

    // REQUESTS
    public getRequests(params) {
        return this.http.get(this.baseUrl + "requests", {
            params,
        });
    }

    public getRequest(id: string) {
        return this.http.get(this.baseUrl + "requests/" + id);
    }

    public sendAccessRequest(payload) {
        return this.http.post(this.baseUrl + "requests/account", payload);
    }

    public sendAccessRequestComplete(payload) {
        return this.http.post(this.baseUrl + "requests/account/complete", payload);
    }

    public sendPermissionsRequest(payload) {
        return this.http.post(this.baseUrl + "requests/permissions", payload);
    }

    public sendPermissionsRequestComplete(payload) {
        return this.http.post(this.baseUrl + "requests/permissions/complete", payload);
    }

    public sendHelpRequest(payload) {
        return this.http.post(this.baseUrl + "requests/help", payload);
    }

    /**
     * GET: Method to get all roles
     *
     * @returns HTTP GET Promise
     */
    public getRoles() {
        return this.http.get(this.baseUrl + "roles");
    }

    /**
     * GET: Method to get role by id
     *
     * @returns HTTP GET Promise
     */
    public getRoleById(id: string) {
        return this.http.get(this.baseUrl + "roles/" + id);
    }

    /**
     * POST: Method to create role
     *
     * @returns HTTP POST Promise
     */
    public createRole(payload) {
        return this.http.post(this.baseUrl + "roles/create", payload);
    }

    /**
     * POST: Method to update role
     *
     * @returns HTTP POST Promise
     */
    public updateRole(payload) {
        return this.http.put(this.baseUrl + "roles/update", payload);
    }

    /**
     * DELETE: Method to delete role
     *
     * @returns HTTP DELETE Promise
     */
    public deleteRole(id: string) {
        return this.http.delete(this.baseUrl + "roles/delete", { body: { id } });
    }

    /**
     * GET: Method to get a roles of capabilities with a link and type combo
     *
     * @returns HTTP GET Promise
     */
    public getRolesByTypeId(linkType: string, linkId: string) {
        return this.http.get(`${this.baseUrl}${linkType}/${encodeURIComponent(linkId)}/roles`);
    }

    /**
     * POST: Method to sync a list of role ids with a link and type combo
     *
     * @returns HTTP POST Promise
     */
    public syncRoleLinks(ids, linkType, linkId) {
        return this.http.post(this.baseUrl + "roles/links/sync", {
            roles: ids,
            link_type: linkType,
            link_id: linkId,
        });
    }

    /**
     * DELETE: Method to delete roles links
     *
     * @returns HTTP POST Promise
     */
    public deleteRolesLink(role_id: number, link_id: string, link_type: string) {
        return this.http.delete(this.baseUrl + "roles/links/delete", {
            body: { role_id, link_id, link_type },
        });
    }

    // SEARCHTEAMS

    /**
     * GET: Method to carry out search for teams where the name contains the string;
     */
    public searchTeamsByName(searchterm: string) {
        return this.http.get(this.baseUrl + "searchs/teams?searchterm=" + searchterm);
    }

    // SEARCHUSERS

    /**
     * GET: Method to carry out search for Staff profiles searching multiple fields with the search term
     */
    public searchUserProfiles(searchterm: string) {
        return this.http.get(this.baseUrl + "searchusers/profiles?searchterm=" + searchterm);
    }

    /**
     * GET: Method to carry out search for Staff profiles searching multiple fields with the search term from a specific organisation
     */
    public searchOrgUserProfiles(searchterm: string, organisation: string) {
        return this.http.get(this.baseUrl + "searchusers/org-profiles?searchterm=" + searchterm + "&organisation=" + organisation);
    }

    // SERVICEACCOUNTS

    public checkServiceAccounts(org: string, key: string) {
        return this.http.post(this.baseUrl + "serviceaccounts/check", {
            org,
            key,
        });
    }

    // SHIELDINGLIST

    /**
     * GET: Method to retrieve all shielding citizens
     */
    public getCitizens(limit = null) {
        return this.http.get(this.baseUrl + "shielding", {
            params: { limit },
        });
    }

    // SPIINCIDENTMETHODS

    /**
     * GET: Method to return all incidents
     */
    public getSpiIncidents() {
        return this.http.get(this.baseUrl + "spi_incidentmethods/");
    }

    /**
     * POST: Method to create a new incident
     */
    public createSpiIncident(payload) {
        return this.http.post(this.baseUrl + "spi_incidentmethods/create", payload);
    }

    /**
     * PUT: Method to update an existing incident
     */
    public updateSpiIncident(payload) {
        return this.http.put(this.baseUrl + "spi_incidentmethods/update", payload);
    }

    /**
     * DELETE: Method to delete an incident
     */
    public deleteSpiIncident(payload) {
        return this.http.delete(this.baseUrl + "spi_incidentmethods/delete", { body: payload });
    }

    // SYSTEMALERTS

    public getSystemAlerts() {
        return this.http.get(this.baseUrl + "systemalerts/");
    }
    public getActiveSystemAlerts() {
        return this.http.get(this.baseUrl + "systemalerts/getActive/");
    }
    public updateSystemAlert(payload: any) {
        return this.http.put(this.baseUrl + "systemalerts/update", payload);
    }
    public addSystemAlert(payload: any) {
        return this.http.post(this.baseUrl + "systemalerts/create/", payload);
    }
    public removeSystemAlert(payload: any) {
        return this.http.delete(this.baseUrl + "systemalerts/delete", { body: payload });
    }

    // TEAMMEMBERS

    /**
     * GET: Method to get all teams from the database
     */
    public getTeamMembers() {
        return this.http.get(this.baseUrl + "teammembers");
    }

    public getTeamMemberByID(id: string) {
        return this.http.get(this.baseUrl + "teammembers/" + id);
    }

    /**
     * GET: Method to get all teams that match the code provided from the database
     */
    public getTeamMembersByCode(code: string) {
        return this.http.get(this.baseUrl + "teammembers/teamcode/" + code);
    }

    /**
     * GET: Method to get all teams that the user is associated with from the database
     */
    public getTeamMembershipsByUsername(username: string) {
        return this.http.get(this.baseUrl + "teammembers/username/" + username);
    }

    /**
     * POST: Method to add a team member to the database
     */
    public addTeamMember(payload: iTeamMembers) {
        return this.http.post(this.baseUrl + "teammembers/create/", payload);
    }

    /**
     * POST: Method to add a team member to the database
     */
    public updateTeamMember(payload: iTeamMembers) {
        return this.http.put(this.baseUrl + "teammembers/update/", payload);
    }

    /**
     * PUT: Method to remove a team member from the database
     */
    public removeTeamMember(payload: iTeamMembers) {
        return this.http.delete(this.baseUrl + "teammembers/delete", { body: payload });
    }

    // TEAMREQUESTS

    /**
     * GET: Method to get all team requests
     */
    public getTeamRequests() {
        return this.http.get(this.baseUrl + "teamrequests/");
    }

    /**
     * GET: Method to get team requests by id
     */
    public getTeamRequestByID(id: string) {
        return this.http.get(this.baseUrl + "teamrequests/" + id);
    }

    /**
     * GET: Method to get team requests by username, this includes all approved and rejected requests
     */
    public getTeamRequestsByUsername(username: string) {
        return this.http.get(this.baseUrl + "teamrequests/username/" + username);
    }

    /**
     * GET: Method to get team requests by team code, this includes all approved and rejected requests
     */
    public getTeamRequestsByTeamCode(code: string) {
        return this.http.get(this.baseUrl + "teamrequests/teamcode/" + code);
    }

    /**
     * POST: Method to add a team request to the database
     */
    public addTeamRequest(payload: iTeamRequest) {
        return this.http.post(this.baseUrl + "teamrequests/create/", payload);
    }

    /**
     * PUT: Method to update a team request in the database
     */
    public updateTeamRequest(payload: iTeamRequest) {
        return this.http.put(this.baseUrl + "teamrequests/update", payload);
    }

    /**
     * PUT: Method to remove a team request from the database
     */
    public archiveTeamRequest(payload: iTeamRequest) {
        return this.http.delete(this.baseUrl + "teamrequests/delete", { body: payload });
    }

    // TEAMS

    /**
     * GET: Method to return all teams
     */
    public getTeams() {
        return this.http.get(this.baseUrl + "teams/");
    }

    /**
     * POST: Method to create a new team
     */
    public createTeam(payload: iTeam) {
        return this.http.post(this.baseUrl + "teams/create", payload);
    }

    /**
     * POST: Method to update an existing team
     */
    public updateTeam(payload: iTeam) {
        return this.http.put(this.baseUrl + "teams/update", payload);
    }

    /**
     * DELETE: Method to delete a team
     */
    public deleteTeam(payload: iTeam) {
        return this.http.delete(this.baseUrl + "teams/delete", { body: payload });
    }

    public getTeamByCode(teamcode: string) {
        return this.http.get(this.baseUrl + "teams/getTeamByCode?code=" + teamcode);
    }

    public getTeamsByOrgCode(orgcode: string) {
        return this.http.get(this.baseUrl + "teams/getTeamsByOrgCode?orgcode=" + orgcode);
    }

    public getTeamsByPartialTeamName(partialteam: string) {
        return this.http.get(this.baseUrl + "teams/getTeamsByPartialTeamName?partialteam=" + partialteam);
    }

    public getTeamsByPartialTeamNameAndOrgCode(partialteam: string, orgcode: string) {
        return this.http.get(this.baseUrl + "teams/getTeamsByPartialTeamNameAndOrgCode?partialteam=" + partialteam + "&orgcode=" + orgcode);
    }

    // TRIALS

    public getAllClinicalTrials() {
        return this.http.get(this.baseUrl + "trials");
    }

    public searchClinicalTrials(search: string, phases: string, min_date: string) {
        return this.http.post(this.baseUrl + "trials/search-top-100", { search, phases, min_date });
    }

    // USERPROFILES

    /**
     * GET: Method to return all user profiles
     */
    public getUserProfiles() {
        return this.http.get(this.baseUrl + "userprofiles");
    }

    /**
     * GET: Method to get profile by username
     */
    public getUserProfileByUsernameAndOrganisation(username: string) {
        return this.http.get(this.baseUrl + "userprofiles/" + encodeURIComponent(username));
    }

    /**
     * GET: Method to get profile by username
     */
    public getUserProfileByUsername(username: string) {
        return this.http.get(this.baseUrl + "userprofiles/username/" + encodeURIComponent(username));
    }

    /**
     * POST: Method to add a new user profile
     */
    public addUserProfile(payload: any) {
        return this.http.post(this.baseUrl + "userprofiles/create/", payload);
    }

    /**
     * PUT: Method to update user profile by ID + updated profile JSON object
     */
    public updateUserProfiles(payload: iFullUser) {
        return this.http.put(this.baseUrl + "userprofiles/update", payload);
    }

    /**
     * PUT: Method to remove user profile by id
     */
    public removeUserProfiles(payload: iFullUser) {
        return this.http.delete(this.baseUrl + "userprofiles/delete/", { body: payload });
    }

    // USERS

    /**
     * GET: Method to return all users
     */
    public getUsers(filters = {}) {
        return this.http.get(this.baseUrl + "users", { params: filters });
    }

    /**
     * GET: Method to retreieve a user by their id
     */
    public getUser(id: string) {
        return this.http.get(this.baseUrl + `users/${encodeURIComponent(id)}`);
    }

    /**
     * DELETE: Method to delete a user by their id
     */
    public deleteUser(username, organisation) {
        return this.http.delete(this.baseUrl + `users/delete`, {
            body: {
                username,
                organisation,
            },
        });
    }

    /**
     * POST: Method to send code
     */
    public sendVerificationCode(username) {
        return this.http.post(this.baseUrl + "users/send-code", {
            email: username,
        });
    }
    /**
     * POST: Method to verify code
     */
    public checkVerificationCode(username, code) {
        return this.http.post(this.baseUrl + "users/verify-code", {
            email: username,
            code,
        });
    }

    // VIRTUALWARDS

    /**
     * GET: Method to get a list of all Lighter Touch Pathway patients
     */
    public getAllLTPPatients(limit: string) {
        return this.http.get(this.baseUrl + "virtualward/?Limit=" + limit);
    }

    /**
     * POST: Method to update a Lighter Touch Pathway patient
     */
    public updateLTPPatient(payload: any) {
        return this.http.put(this.baseUrl + "virtualward/update", payload);
    }

    // WARDDETAILS

    /**
     * GET: Method to retrieve ward details
     */
    public getWardDetails() {
        return this.http.get(this.baseUrl + "warddetails");
    }

    // WARDS

    /**
     * GET: Method to retrieve virtual ward decisions
     */
    public getVWDecisionPatients(limit: string) {
        return this.http.get(this.baseUrl + "virtualward_decision/?Limit=" + limit);
    }

    /**
     * GET: Method to retrieve all virtual ward decisions that have been actioned
     */
    public getVWDecisionActioned(limit: string) {
        return this.http.get(this.baseUrl + "virtualward_decision/getAllActioned?Limit=" + limit);
    }

    /**
     * POST: Method to retrieve virtual ward decisions by patient and status
     */
    public getVWDecisionPatientsByStatus(status, limit) {
        return this.http.post(this.baseUrl + "virtualward_decision/getAllByStatus", { status, limit });
    }

    /**
     * POST: Method to update virtual ward status (option to pass a reason)
     */
    public updateVWStatus(id, status, reason?) {
        if (reason && reason !== null) {
            return this.http.post(this.baseUrl + "virtualward_decision/status/update", {
                id,
                status,
                nonreferral_reason: reason,
            });
        } else {
            return this.http.post(this.baseUrl + "virtualward_decision/status/update", { id, status });
        }
    }

    /**
     * POST: Method to update virtual ward contact
     */
    public updateVWContact(id, contact) {
        return this.http.post(this.baseUrl + "virtualward_decision/contact/update", { id, contact });
    }

    /**
     * POST: Method to clear virtual ward contact
     */
    public clearVWContact(id) {
        return this.http.post(this.baseUrl + "virtualward_decision/contact/clear", { id });
    }

    /**
     * POST: Method to clear virtual ward notes
     */
    public clearVWNotes(id) {
        return this.http.post(this.baseUrl + "virtualward_decision/notes/clear", { id });
    }

    /**
     * POST: Method to update virtual ward notes
     */
    public updateVWNotes(id, notes) {
        return this.http.post(this.baseUrl + "virtualward_decision/notes/update", { id, notes });
    }

    /**
     * GET: Method to retrieve all Wards
     */
    public getWards() {
        return this.http.get(this.baseUrl + "wards");
    }

    // ATOMICFORMDATA

    public getFormDataById(payloadID: string) {
        return this.http.get(this.baseUrl + "atomic/formdata/" + payloadID);
    }

    public getAllFormData() {
        return this.http.get(this.baseUrl + "atomic/formdata");
    }

    public addFormData(payload: any) {
        return this.http.post(this.baseUrl + "atomic/formdata/create", payload);
    }

    public updateFormData(payload: any) {
        return this.http.put(this.baseUrl + "atomic/formdata/update", payload);
    }

    public deleteFormData(payload: any) {
        return this.http.delete(this.baseUrl + "atomic/formdata/delete", { body: payload });
    }

    // ATOMICPAYLOADS

    /**
     * Method to get Payloads by ID
     */
    public getPayloadById(payloadID: string) {
        return this.http.get(this.baseUrl + "atomic/payloads/" + payloadID);
    }

    public getAllPayloads() {
        return this.http.get(this.baseUrl + "atomic/payloads");
    }

    public addPayload(payload: any) {
        return this.http.post(this.baseUrl + "atomic/payloads/create", payload);
    }

    public updatePayload(payload: any) {
        return this.http.put(this.baseUrl + "atomic/payloads/update", payload);
    }

    public deletePayload(payload: any) {
        return this.http.delete(this.baseUrl + "atomic/payloads/delete", { body: payload });
    }

    // GENERIC HTTP REST METHODS

    /**
     * Generic Method to make any GET request
     */
    public genericGetAPICall(url: string) {
        return this.http.get(url);
    }

    /**
     * Generic Method to make any GET request with paramaters
     */
    public genericGetAPICallByParam(url: string, param: string) {
        return this.http.get(url + param);
    }

    /**
     * POST: Generic Method to make any POST request
     */
    public genericPostAPICall(url: string, payload) {
        return this.http.post(url, payload);
    }

    /**
     * DELETE: Generic Method to make any DELETE request
     */
    public genericPutAPICall(url: string, payload) {
        return this.http.put(url, payload);
    }

    /**
     * DELETE: Generic Method to make any DELETE request
     */
    public genericDeleteAPICall(url: string, payload) {
        return this.http.delete(url, { body: payload });
    }
}
