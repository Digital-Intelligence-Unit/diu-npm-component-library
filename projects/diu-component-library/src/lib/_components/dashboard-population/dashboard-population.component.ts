import { Component, ViewChild, Inject, AfterViewInit, ViewContainerRef } from "@angular/core";
import { PopulationMapNewComponent } from "./new/dashboard-population.component";
import { PopulationMapLegacyComponent } from "./legacy/dashboard-population.component";

@Component({
    selector: "app-population-dashboard",
    templateUrl: "./dashboard-population.component.html",
    animations: [],
})
export class DashboardPopulationComponent implements AfterViewInit {

    version;
    @ViewChild("mapContainer", { read: ViewContainerRef }) mapContainerElement: ViewContainerRef;

    constructor(
        @Inject("environment") private environment
    ) {}

    ngAfterViewInit() {
        // Initially set version depending on environment
        this.setVersion(this.environment.production === true ? "legacy" : "new");
    }

    setVersion(version) {
        // Set version
        this.version = version;

        // Add component
        this.mapContainerElement.clear();
        this.mapContainerElement.createComponent<any>(
            {
                legacy: PopulationMapLegacyComponent,
                new: PopulationMapNewComponent
            }[this.version]
        );
    }
}