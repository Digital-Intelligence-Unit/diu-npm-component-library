
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";

import { APIService } from "../services/api.service";
import { APIV2Service } from "../services/apiV2.service";
import { PopulationManagementService } from "../services/populationmanagement.service";
import { PopulationService } from "../services/population.service";
import { RTSService } from "../services/rts.service";

@NgModule({
    imports: [
        CommonModule,
        HttpClientModule
    ],
    providers: [
        APIService,
        APIV2Service,
        PopulationManagementService,
        PopulationService,
        RTSService
    ],
})
export class DiuSharedServicesModule {}
