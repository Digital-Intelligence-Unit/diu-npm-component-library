import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable, of } from "rxjs";
import { map } from "rxjs/operators";

export class BaseService {
    /**
     * API Subdomain
     */
    baseUrl = "";
    devURL = "nhs-bi-platform.co.uk";

    constructor(protected http: HttpClient, env?: any) {
        if (env) this.devURL = env.websiteURL || "nhs-bi-platform.co.uk";
    }

    /**
     * Method for adding Subdomain to current Browser Location
     */
    public combineURL(origin: string, subdomain: string) {
        return `http${this.devURL.includes("localhost") ? "://" : `s://${subdomain}.`}${this.devURL}/`;
    }

    /**
     * Method to check that API is online
     */
    public checkendpoint() {
        return this.http.get(this.baseUrl, { responseType: "text" });
    }

    /**
     * Method to convert params
     */
    public createHttpParams(params: any): HttpParams {
        let httpParams: HttpParams = new HttpParams();
        Object.keys(params).forEach(param => {
            if (params[param]) {
                httpParams = httpParams.set(param, params[param]);
            }
        });

        return httpParams;
    }

    /**
     * Cache http requests
     */
    public cacheHttpRequest(request: Observable<any>, key, options = { age: 10 }) {
        // Get cached data?
        const cachedData = JSON.parse(sessionStorage.getItem("cached-requests") || "{}");

        // Remove expired
        for (const key in cachedData) {
            if(new Date().getTime() > cachedData[key].expiry) {
                delete cachedData[key];
            }
        }

        // Exists?
        if(cachedData[key]) {
            // Store updated cache
            sessionStorage.setItem("cached-requests", JSON.stringify(cachedData));

            // Return cached value
            return of(cachedData[key].value);
        } else {
            return request.pipe(
                map((data: any) => {
                    // Set cache
                    cachedData[key] = { expiry: new Date().getTime() + (60000 * options.age), value: data };

                    // Store
                    sessionStorage.setItem("cached-requests", JSON.stringify(cachedData));

                    return data;
                })
            );
        }
    }
}
