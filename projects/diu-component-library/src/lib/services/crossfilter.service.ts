import { HttpClient } from "@angular/common/http";
import { Inject } from "@angular/core";
import { BaseService } from "./base.service";

export class CrossFilterService extends BaseService {
    constructor(protected http: HttpClient, @Inject("environment") environment) {
        super(http, environment);
    }

    /**
     * GET: Method to retrieve all population data
     */
    public get() {
        return this.http.get(this.baseUrl + "dataset/getAll/");
    }

    /**
     * GET: Method to retrieve cross filter
     */
    public getCFServer() {
        return this.http.get(this.baseUrl + "dataset/getCrossfilter/");
    }

    /**
     * GET: Method to rebuild and retrieve new cross filter
     */
    public rebuildCFServer() {
        return this.http.get(this.baseUrl + "dataset/rebuildCrossfilter/");
    }

    /**
     * POST: Method to rebuild and retrieve new cross filter
     */
    public getComparison(payload: any) {
        return this.http.post(this.baseUrl + "dataset/getComparison/", payload);
    }
}
