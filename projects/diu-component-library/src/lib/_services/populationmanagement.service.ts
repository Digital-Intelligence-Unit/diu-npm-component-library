import { HttpClient } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { CrossFilterService } from "./_crossfilterclass.service";
/**
 * Reference to Browser Window
 */
declare const window: any;

/**
 * Population Management Service Class
 */
@Injectable({
    providedIn: "root",
})
export class PopulationManagementService extends CrossFilterService {
    constructor(protected http: HttpClient, @Inject("environment") environment) {
        super(http, environment);
        const origin: string = window.location.href;
        this.baseUrl = this.combineURL(origin, "crossfilter");
    }
}
