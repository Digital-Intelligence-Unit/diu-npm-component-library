import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ComponentsSharedModule } from "../components-shared.module";

import { DashboardPopulationComponent } from "./dashboard-population.component";
import { WardMapComponent } from "./ward-map/ward-map.component";
import { DiuSharedServicesModule } from "../../modules/services.module";

@NgModule({
    imports: [
        CommonModule,
        DiuSharedServicesModule,
        ComponentsSharedModule
    ],
    declarations: [
        DashboardPopulationComponent,
        WardMapComponent
    ],
    exports: [
        DashboardPopulationComponent
    ]
})
export class DiuDashboardPopulationComponentModule {}
