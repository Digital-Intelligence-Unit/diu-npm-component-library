import { HttpClient } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { CrossFilterService } from "./crossfilter.service";
/**
 * Reference to Browser Window
 */
declare const window: any;

/**
 * Population Service Class
 */
@Injectable()
export class PopulationService extends CrossFilterService {
    miniUrl = "";
    /**
     * Population Service Constructor
     */
    constructor(protected http: HttpClient, @Inject("environment") environment) {
        super(http, environment);
        const origin: string = window.location.href;
        this.baseUrl = this.combineURL(origin, "population");
        this.miniUrl = this.combineURL(origin, "popmini");
    }

    /**
     * GET: Method to retrieve mini cross filter data
     */
    public getMiniCFServer() {
        return this.http.get(this.miniUrl + "dataset/getCrossfilter/");
    }
}
