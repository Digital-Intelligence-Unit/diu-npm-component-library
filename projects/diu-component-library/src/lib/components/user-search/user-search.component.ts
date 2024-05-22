import { Component, OnInit, Input, EventEmitter, Output } from "@angular/core";
import { cComponentHandler } from "../../types/componentHandler";
import { iOrganisation } from "../../types/organisation.interface";
import { iFullUser, iSearchResults, iSection } from "../../types/user.interface";
import { BrokerService } from "./legacy-broker.service";
import jwtDecode from "jwt-decode"
import { APIService } from "../../services/api.service";

/**
 * User Search Component Class
 */
@Component({
    selector: "lib-user-search",
    templateUrl: "./user-search.component.html",
    styleUrls: ["./user-search.component.css"],
})
export class UserSearchComponent implements OnInit {
    /**
     * Input: Configuration of component
     */
    @Input() config: any;
    @Output() selectedUser = new EventEmitter<any>();
    /**
     * Handler Class for Component
     */
    Handler: cComponentHandler;
    /**
     * Decoded JWT Token
     */
    tokenDecoded: any;
    /**
     * Array of Organisations
     */
    organisations: iOrganisation[] = [];
    /**
     * Currently selected organisation
     */
    organisation: iOrganisation;
    /**
     * Initialise search text
     */
    searchname = "";
    /**
     * Initialise array to store list of results
     */
    teamresults: iSection[] = [];
    /**
     * Initialise boolean to show when the API is being checked for results
     */
    searching = false;

    /**
     * User Search Component Constructor
     */
    constructor(
        /**
         * User Group API Service
         */
        private apiService: APIService,
        /**
         * User Group API Service
         */
        private brokerService: BrokerService
    ) {
        const token = localStorage.getItem("@@STATE");
        if (token) {
            const jsonToken = JSON.parse(token);
            const myToken = jsonToken.stateauth.token;
            this.tokenDecoded = jwtDecode(myToken);
            if (jsonToken.statereference && jsonToken.statereference.organisations)
                this.organisations = jsonToken.statereference.organisations;
        }
    }

    /**
     * User Search Component Initialiser
     */
    ngOnInit() {
        if (this.config) this.Handler = new cComponentHandler(this.config);
        this.setDefaultOrg();
    }

    /**
     * Sets the default organisation for searching
     */
    setDefaultOrg() {
        if (this.organisations) {
            const myorg = this.organisations.find((x) => x.name === this.tokenDecoded.organisation);
            if (myorg) {
                this.organisation = myorg;
            } else {
                this.organisation = this.organisations[0];
            }
        }
    }

    /**
     * Function that runs once the search input box has been changed
     */
    onSearchChangeTeamList(searchValue: string) {
        if (this.organisation.authmethod !== "Demo") {
            if (searchValue.length > 4) {
                this.searching = true;
                this.apiService.searchOrgUserProfiles(searchValue, this.organisation.name).subscribe((response: iSearchResults[]) => {
                    this.searching = false;
                    this.teamresults = response[0].results.map((user) => {
                        user.organisation = this.organisation.name;
                        return user;
                    });
                });
            } else {
                this.teamresults = [];
            }
        }
    }

    /**
     * Function that runs once the search button has been clicked
     */
    searchButtonClicked() {
        const searchValue = this.searchname;
        this.teamresults = [];
        this.searching = true;
        this.apiService.searchOrgUserProfiles(searchValue, this.organisation.authmethod).subscribe((response: iSearchResults[]) => {
            this.searching = false;
            if (response && response.length > 0 && response[0].results) {
                this.teamresults = response[0].results;
            } else {
                this.teamresults = [];
            }
        });
    }

    /**
     * Function that runs once a user has been selected, outputs value to parent
     */
    selectUser(user: iFullUser) {
        this.selectedUser.emit(user);
        if (this.Handler && this.Handler.actions.length > 0) {
            this.Handler.actions.forEach((x) => {
                this.brokerService.sendMessage({
                    id: x.id,
                    action: x.action,
                    payload: user,
                });
            });
        }
    }
}
