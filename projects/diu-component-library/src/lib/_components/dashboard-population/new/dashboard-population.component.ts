import { Component, ViewChild, Inject, AfterViewInit } from "@angular/core";
import { APIService } from "../../../_services/api.service";
import { AgeChart } from "./shared/age.chart";
import { DeprivationChart } from "./shared/deprivation.chart";

@Component({
    selector: "app-population-map-new",
    templateUrl: "./dashboard-population.component.html",
})
export class PopulationMapNewComponent implements AfterViewInit {

    @ViewChild("cfChartElementMale") cfChartElementMale;
    @ViewChild("cfChartElementFemale") cfChartElementFemale;
    @ViewChild("cfChartElementDeprivation") cfChartElementDeprivation;
    maleChart; femaleChart; deprivationChart;

    data; filters = {};
    crossfilterUrl: string;

    constructor(
        @Inject("environment") environment,
        private apiService: APIService
    ) {
        // Set url based on environment
        this.crossfilterUrl = `https://popmini.${environment.websiteURL as string}/dataset/getCrossfilter`;
    }

    ngAfterViewInit() {
        // Create charts (To-do: Tidy up)
        this.maleChart = new AgeChart("Male");
        this.maleChart.create(this.cfChartElementMale);

        this.femaleChart = new AgeChart("Female");
        this.femaleChart.create(this.cfChartElementFemale);

        this.deprivationChart = new DeprivationChart();
        this.deprivationChart.create(this.cfChartElementDeprivation);

        // Get data
        this.getData();
    }

    getData() {
        this.apiService.genericGetAPICall(`${this.crossfilterUrl}?filter=${JSON.stringify(this.filters)}`).subscribe((data: any) => {
            // Set data
            this.data = data;

            // Update charts
            this.maleChart.update(data);
            this.femaleChart.update(data);
            this.deprivationChart.update(data);
        });
    }

    filterDataTimeout;
    filterData(filter) {
        clearTimeout(this.filterDataTimeout);
        this.filterDataTimeout = setTimeout(() => {
            // Apply filters
            if(filter) {
                this.filters = { [filter.id]: filter.value };
            } else {
                this.filters = {};
            }

            // Get new data
            this.getData();

            // Show ward details
            this.setAreaDetails(filter?.id === "WDimension" ? filter : null);
        }, 800);
    }

    _allAreaDetails; areaDetails;
    async setAreaDetails(area) {
        if(area) {
            // Get all area details
            this._allAreaDetails = this._allAreaDetails || await this.apiService.getWardDetails().toPromise();

            // Set selected details
            const selectedAreaDetails = this._allAreaDetails.find((x) => x.code === area.value);
            this.areaDetails = Object.assign(
                {}, {
                    code: area.value,
                    name: "Unknown",
                    text: "Unknown",
                    image: "innerurban.jpg",
                    icp: "Fylde Coast",
                    parent: area.details.parent
                },
                selectedAreaDetails || {}
            );
        } else {
            this.areaDetails = null;
        }
    }
}

import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { HttpClientModule } from "@angular/common/http";
import { MaterialModule } from "../../../_modules/material.module";
import { WardMapComponent } from "./ward-map/ward-map.component";

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        HttpClientModule,
        MaterialModule
    ],
    declarations: [
        PopulationMapNewComponent,
        WardMapComponent
    ],
    exports: [
        PopulationMapNewComponent,
        WardMapComponent
    ]
})
export class PopulationMapNewComponentModule {}
