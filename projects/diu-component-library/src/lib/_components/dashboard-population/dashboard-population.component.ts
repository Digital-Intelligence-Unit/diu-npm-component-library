import { Component, ViewChild, Inject, AfterViewInit } from "@angular/core";
import { APIService } from "../../_services/api.service";
import { AgeChart } from "./shared/age.chart";

@Component({
    selector: "app-population",
    templateUrl: "./dashboard-population.component.html",
    animations: [],
})
export class DashboardPopulationComponent implements AfterViewInit {

    @ViewChild("cfChartElementMale") cfChartElementMale;
    @ViewChild("cfChartElementFemale") cfChartElementFemale;
    maleChart; femaleChart;

    data; filters;
    crossfilterUrl;

    constructor(
        @Inject("environment") environment,
        private apiService: APIService
    ) {
        // Set url based on environment
        this.crossfilterUrl = `https://popmini.${environment.websiteURL as string}/dataset/getCrossfilter`;
    }

    ngAfterViewInit() {
        // Create charts
        this.maleChart = new AgeChart("Male");
        this.maleChart.create(this.cfChartElementMale);

        this.femaleChart = new AgeChart("Female");
        this.femaleChart.create(this.cfChartElementFemale);

        // Get data
        this.getData();
    }

    getData() {
        this.apiService.genericGetAPICall(this.crossfilterUrl).subscribe((data: any) => {
            // Set data
            this.data = data;

            // Update charts
            this.maleChart.update(data);
            this.femaleChart.update(data);
        });
    }
}
