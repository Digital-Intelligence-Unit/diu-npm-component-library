import { HttpClient } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { BaseService } from "./base.service";

@Injectable()
export class APIV2Service extends BaseService {
    /**
     * Authentication API Service Constructor
     */
    constructor(protected http: HttpClient, @Inject("environment") environment) {
        super(http, environment);

        // Set base url
        this.baseUrl = `http${environment.apiURL.includes("localhost") ? "://" : `s://`}` + environment.apiURL;
    }

    public request(routeUrl, params = {}, { observe = "body" }) {
        return this.http.get(this.baseUrl + routeUrl, {
            params: this.createHttpParams(params),
            observe: observe as any
        });
    }

    public requestPost(routeUrl, params = {}) {
        return this.http.post(this.baseUrl + routeUrl, params);
    }

    public requestDelete(routeUrl, params = {}) {
        return this.http.delete(this.baseUrl + routeUrl, {
            params: this.createHttpParams(params)
        });
    }
}
