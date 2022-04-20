import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { iApplication, iNewsFeed } from "../_models/installations.interface";
import { BaseService } from "./_baseclass.service";
import { iOrganisation } from "../_models/organisation.interface";
/**
 * Reference to Browser Window
 */
declare var window: any;

/**
 * Dynamic API Service Class
 */
@Injectable({ providedIn: "root" })
export class DynamicApiService extends BaseService {
  systemalertUrl;
  newsfeedUrl: string;

  /**
   * Dynamic API Service Constructor
   */
  constructor(
    /**
     * HTTP Request Handler
     */
    protected http: HttpClient
  ) {
    super(http);
    const parsedUrl = window.location.href;
    const origin = parsedUrl;
    this.baseUrl = this.combineURL(origin, "apig");
    this.systemalertUrl = this.baseUrl + "systemalerts/";
    this.newsfeedUrl = this.baseUrl + "newsfeeds/";
  }

  /**
   * Method to get Payloads by ID
   */
  public getPayloadById(payloadID) {
    return this.http.get(this.baseUrl + "payloads/getByid?id=" + payloadID);
  }

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
   * GET: Method to retrieve news feeds
   */
  public getNewsFeeds() {
    return this.http.get(this.baseUrl + "newsfeeds/getAll/");
  }

  /**
   * GET: Method to retrieve ward details
   */
  public getWardDetails() {
    return this.http.get(this.baseUrl + "warddetails/getAll");
  }

  public archiveTask(payload: any) {
    return this.http.put(this.baseUrl + "tasks/delete", payload);
  }

  // System Alerts
  public getSystemAlerts() {
    return this.http.get(this.systemalertUrl + "getAll/");
  }
  public getActiveSystemAlerts() {
    return this.http.get(this.systemalertUrl + "getActive/");
  }
  public updateSystemAlert(payload: any, id: any) {
    return this.http.post(this.systemalertUrl + "update", payload);
  }
  public addSystemAlert(payload: any) {
    return this.http.post(this.systemalertUrl + "register/", payload);
  }

  public getApps() {
    return this.http.get(this.baseUrl + "publicapps/getAll/");
  }

  public addApp(payload: iApplication) {
    return this.http.post(this.baseUrl + "apps/register/", payload);
  }

  public updateApp(payload: iApplication) {
    return this.http.post(this.baseUrl + "apps/update", payload);
  }

  public archiveApp(payload: iApplication) {
    return this.http.post(this.baseUrl + "apps/delete", payload);
  }

  public addNewsFeed(payload: iNewsFeed) {
    return this.http.post(this.newsfeedUrl + "register/", payload);
  }
  public updateNewsFeed(payload: iNewsFeed) {
    return this.http.post(this.newsfeedUrl + "update", payload);
  }
  public archiveNewsFeed(payload: iNewsFeed) {
    return this.http.post(this.newsfeedUrl + "delete", payload);
  }

  public getOrganisations() {
    return this.http.get(this.baseUrl + "organisation/getAll");
  }

  public addOrganisation(payload: iOrganisation) {
    return this.http.post(this.baseUrl + "organisations/register/", payload);
  }

  public updateOrganisation(payload: iOrganisation) {
    return this.http.post(this.baseUrl + "organisations/update", payload);
  }

  public getPointsOfInterest() {
    return this.http.get(this.baseUrl + "pointsofinterest/getAll");
  }

  public getMosiacs() {
    return this.http.get(this.baseUrl + "mosaic/getAll");
  }

  public getCodefromPostCode(code) {
    return this.http.get(this.baseUrl + "mosaic/getCodefromPostCode?postcode=" + code);
  }
}
