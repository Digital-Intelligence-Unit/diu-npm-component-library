import { Component, OnInit } from "@angular/core";
import { iInpatientCounts, iOutpatientCounts, iAECounts, iEPCCounts, iECSCounts } from "../../_models/hospitalstats.interface";
import jwt_decode from "jwt-decode";
import { iNewsStand } from "../../_models/newsitem.interface";
import { APIService } from "../../_services/api.service";

@Component({
    selector: "app-dashboard-hospital-stats",
    templateUrl: "./dashboard-hospital-stats.component.html",
})
export class AcuteHospitalStatsComponent implements OnInit {

    _user;
    get user() {
        // Get user
        if(!this._user) {
            let token = localStorage.getItem("@@STATE");
            if(token) {
                token = (JSON.parse(token)).stateauth.token;
                this._user = jwt_decode(token);
            }
        }

        // Return user
        return this._user;
    }

    selectedCCG: string;
    newstandItems: iNewsStand[];
    BTHToken: string;
    communityNews: number;

    authorised = false;
    display = false;

    constructor(private apiService: APIService) {
        // Check if user authorised
        const capabilities = this.user.capabilities.map((item) => Object.keys(item)[0]);
        if(capabilities.includes("Hall Monitor")) {
            this.authorised = true;
        }
    }

    ngOnInit() {
        this.newstandItems = [
            {
                name: "Inpatients",
                chip: "...",
                total: "-",
                totaltext: "Total",
                breakdown: [],
                news: [
                    {
                        name: "Inpatients",
                        logo: "fas fa-procedures",
                        color: "danger",
                        total: "-",
                    },
                    {
                        name: "Daycases",
                        logo: "fas fa-user-clock",
                        color: "orange",
                        total: "-",
                    },
                    {
                        name: "Admitted Today",
                        logo: "fas fa-arrow-circle-right",
                        color: "info",
                        total: "-",
                    },
                    {
                        name: "Discharged Today",
                        logo: "fas fa-arrow-circle-left",
                        color: "purple",
                        total: "-",
                    },
                ],
            },
            {
                name: "Outpatients",
                chip: "...",
                total: "-",
                totaltext: "Total (Clinics today)",
                news: [
                    {
                        name: "New",
                        logo: "fas fa-check",
                        color: "info",
                        total: "-",
                    },
                    {
                        name: "Follow Up",
                        logo: "fas fa-check-circle",
                        color: "success",
                        total: "-",
                    },
                    {
                        name: "DNA",
                        logo: "fas fa-minus-circle",
                        color: "megna",
                        total: "-",
                    },
                    {
                        name: "Cancelled",
                        logo: "fas fa-times",
                        color: "grey",
                        total: "-",
                    },
                ],
            },
            {
                name: "Emergency",
                chip: "...",
                total: "-",
                totaltext: "Total",
                breakdown: [],
                news: [
                    {
                        name: "Ambulance",
                        logo: "fas fa-ambulance",
                        color: "orange",
                        total: "-",
                    },
                    {
                        name: "Non Ambulance",
                        logo: "fas fa-walking",
                        color: "purple",
                        total: "-",
                    },
                    {
                        name: "Attended Today",
                        logo: "fas fa-hospital-symbol",
                        color: "danger",
                        total: "-",
                    },
                    {
                        name: "Admitted Today",
                        logo: "fas fa-hospital-alt",
                        color: "info",
                        total: "-",
                    },
                ],
            },
            {
                name: "Community",
                chip: "...",
                total: "-",
                totaltext: "Total",
                news: [
                    {
                        name: "ECS Awaiting",
                        logo: "fas fa-share",
                        color: "warning",
                        total: "-",
                    },
                    {
                        name: "ECS Active",
                        logo: "fas fa-users",
                        color: "success",
                        total: "-",
                    },
                    {
                        name: "EPC Active",
                        logo: "fas fa-folder-open",
                        color: "info",
                        total: "-",
                    },
                    {
                        name: "Non EPC Active",
                        logo: "fas fa-folder",
                        color: "purple",
                        total: "-",
                    },
                ],
            },
        ];
    }

    updateBG(color: string) {
        return "bg-" + color;
    }

    loadNewsStand() {
        this.apiService.authenticate().subscribe((res: any) => {
            if (res.success) {
                if (res.msg && res.msg.token) {
                    this.BTHToken = res.msg.token;
                    this.populateStand(this.BTHToken);
                } else {
                    this.newstandItems = [];
                }
            }
        });
        // setTimeout(() => {
        //     this.loadNewsStand();
        // }, 60 * 5 * 1000);
    }

    populateStand(token: string) {
        this.apiService.inpatientCounts(token).subscribe((res: { success: boolean; msg: any }) => {
            if (res.success && res.msg.length > 0) {
                const parsed: iInpatientCounts[] = JSON.parse(res.msg);
                const inpatientNewsIndex = this.newstandItems.findIndex((n) => n.name === "Inpatients");
                if (inpatientNewsIndex > -1) {
                    const newItem = {
                        name: "Inpatients",
                        chip: "Live",
                        total: parsed[0].totalCount.toString(),
                        totaltext: "Total",
                        breakdown: [
                            {
                                text: "EPC",
                                total: parsed[0].epcIpTotal.toString(),
                                color: "blue",
                            },
                            {
                                text: "ECS",
                                total: parsed[0].ecsIpTotal.toString(),
                                color: "yellow",
                            },
                        ],
                        news: [
                            {
                                name: "Inpatients",
                                logo: "fas fa-procedures",
                                color: "danger",
                                total: parsed[0].ipCount.toString(),
                                subtotal: " Awt. " + parsed[0].otherCount.toString(),
                            },
                            {
                                name: "Daycases",
                                logo: "fas fa-user-clock",
                                color: "orange",
                                total: parsed[0].dcCount.toString(),
                            },
                            {
                                name: "Admitted Today",
                                logo: "fas fa-arrow-circle-right",
                                color: "info",
                                total: parsed[0].admitToday.toString(),
                            },
                            {
                                name: "Discharged Today",
                                logo: "fas fa-arrow-circle-left",
                                color: "purple",
                                total: parsed[0].dischToday.toString(),
                            },
                        ],
                    };
                    this.newstandItems.splice(inpatientNewsIndex, 1, newItem);
                }
            }
        });
        this.apiService.outpatientCounts(token).subscribe((res: { success: boolean; msg: any }) => {
            if (res.success && res.msg.length > 0) {
                const parsed: iOutpatientCounts[] = JSON.parse(res.msg);
                const outpatientNewsIndex = this.newstandItems.findIndex((n) => n.name === "Outpatients");
                if (outpatientNewsIndex > 0) {
                    const newItem = {
                        name: "Outpatients",
                        chip: "Live",
                        total: (parsed[0].newCount + parsed[0].fupCount).toString(),
                        totaltext: "Total (Clinics today)",
                        news: [
                            {
                                name: "New",
                                logo: "fas fa-check",
                                color: "info",
                                total: parsed[0].newCount.toString(),
                            },
                            {
                                name: "Follow Up",
                                logo: "fas fa-check-circle",
                                color: "success",
                                total: parsed[0].fupCount.toString(),
                            },
                            {
                                name: "DNA",
                                logo: "fas fa-minus-circle",
                                color: "megna",
                                total: parsed[0].dnacount.toString(),
                            },
                            {
                                name: "Cancelled",
                                logo: "fas fa-times",
                                color: "grey",
                                total: parsed[0].cancelled.toString(),
                            },
                        ],
                    };
                    this.newstandItems.splice(outpatientNewsIndex, 1, newItem);
                }
            }
        });
        this.apiService.aeCounts(token).subscribe((res: { success: boolean; msg: any }) => {
            if (res.success && res.msg.length > 0) {
                const parsed: iAECounts[] = JSON.parse(res.msg);
                const emergencyNewsIndex = this.newstandItems.findIndex((n) => n.name === "Emergency");
                if (emergencyNewsIndex > -1) {
                    const newItem = {
                        name: "Emergency",
                        chip: "Live",
                        total: (parsed[0].ambTot + parsed[0].noneAmbTot).toString(),
                        totaltext: "Total",
                        breakdown: [
                            {
                                text: "EPC",
                                total: parsed[0].epcAeTotal.toString(),
                                color: "blue",
                            },
                            {
                                text: "ECS",
                                total: parsed[0].ecsAeTotal.toString(),
                                color: "yellow",
                            },
                        ],
                        news: [
                            {
                                name: "Ambulance",
                                logo: "fas fa-ambulance",
                                color: "orange",
                                total: parsed[0].ambTot.toString(),
                            },
                            {
                                name: "Non Ambulance",
                                logo: "fas fa-walking",
                                color: "purple",
                                total: parsed[0].noneAmbTot.toString(),
                            },
                            {
                                name: "Attended Today",
                                logo: "fas fa-hospital-symbol",
                                color: "danger",
                                total: parsed[0].aetoday.toString(),
                            },
                            {
                                name: "Admitted Today",
                                logo: "fas fa-hospital-alt",
                                color: "info",
                                total: parsed[0].admittedTot.toString(),
                            },
                        ],
                    };
                    this.newstandItems.splice(emergencyNewsIndex, 1, newItem);
                }
            }
        });
        let communityNews = this.newstandItems.find((n) => n.name === "Community");
        this.communityNews = 0;
        this.apiService.ecsCounts(token).subscribe((res: { success: boolean; msg: any }) => {
            if (res.success && res.msg.length > 0) {
                const parsed: iECSCounts[] = JSON.parse(res.msg);
                if (!communityNews) {
                    communityNews = {
                        name: "Community",
                        chip: "Live",
                        total: "-",
                        totaltext: "Total",
                        news: [
                            {
                                name: "ECS Awaiting",
                                logo: "fas fa-share",
                                color: "warning",
                                total: "-",
                            },
                            {
                                name: "ECS Active",
                                logo: "fas fa-users",
                                color: "danger",
                                total: "-",
                            },
                            {
                                name: "EPC Active",
                                logo: "fas fa-folder-open",
                                color: "info",
                                total: "-",
                            },
                            {
                                name: "Non EPC Active",
                                logo: "fas fa-folder",
                                color: "purple",
                                total: "-",
                            },
                        ],
                    };
                    this.newstandItems.push(communityNews);
                }
                const EPCActive = communityNews.news.find((n) => n.name === "ECS Awaiting");
                EPCActive.total = parsed[0].awaitTotals.toString();
                const NonEPCActive = communityNews.news.find((n) => n.name === "ECS Active");
                NonEPCActive.total = parsed[0].curTotals.toString();
                communityNews.chip = "EPC / ECS";
                this.communityNews = this.communityNews + parseInt(EPCActive.total) + parseInt(NonEPCActive.total);
                communityNews.total = this.communityNews.toString();
            }
        });
        this.apiService.epcCounts(token).subscribe((res: { success: boolean; msg: any }) => {
            if (res.success && res.msg.length > 0) {
                const parsed: iEPCCounts[] = JSON.parse(res.msg);
                if (!communityNews) {
                    communityNews = {
                        name: "Community",
                        chip: "Live",
                        total: "-",
                        totaltext: "Total",
                        news: [
                            {
                                name: "ECS Awaiting",
                                logo: "fas fa-share",
                                color: "warning",
                                total: "-",
                            },
                            {
                                name: "ECS Active",
                                logo: "fas fa-users",
                                color: "danger",
                                total: "-",
                            },
                            {
                                name: "EPC Active",
                                logo: "fas fa-folder-open",
                                color: "info",
                                total: "-",
                            },
                            {
                                name: "Non EPC Active",
                                logo: "fas fa-folder",
                                color: "purple",
                                total: "-",
                            },
                        ],
                    };
                    this.newstandItems.push(communityNews);
                }
                const EPCActive = communityNews.news.find((n) => n.name === "EPC Active");
                EPCActive.total = parsed[0].countNeighbourhoodActiveEPC.toString();
                const NonEPCActive = communityNews.news.find((n) => n.name === "Non EPC Active");
                NonEPCActive.total = parsed[0].activeNonEPC.toString();
                communityNews.chip = "EPC / ECS";
                this.communityNews = this.communityNews + parseInt(EPCActive.total) + parseInt(NonEPCActive.total);
                communityNews.total = this.communityNews.toString();
            }
        });
    }
}
