import { HttpClient } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { CrossFilterService } from "./crossfilter.service";
/**
 * Reference to Browser Window
 */
declare const window: any;

/**
 * Real Time Surveillance Service Class
 */
@Injectable({
    providedIn: "root",
})
export class RTSService extends CrossFilterService {
    constructor(protected http: HttpClient, @Inject("environment") environment) {
        super(http, environment);
        const origin: string = window.location.href;
        this.baseUrl = this.combineURL(origin, "rts");
    }

    public registerRTSCase(payload: any) {
        return this.http.post(this.baseUrl + "dataset/register/", payload);
    }

    public updateRTSCase(payload: any) {
        return this.http.post(this.baseUrl + "dataset/update/", payload);
    }

    public removeRTSCase(payload: any) {
        return this.http.post(this.baseUrl + "dataset/remove/", payload);
    }
}
