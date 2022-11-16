import { HttpClient, HttpParams } from "@angular/common/http";

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
}
