
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { DiuSharedServicesModule } from "../../modules/services.module";
import { ComponentsSharedModule } from "../components-shared.module";

import { ApplicationTileComponent } from "./application-tile.component";
import { ApplicationInfoDialogComponent } from "./dialog-information/dialoginformation";

@NgModule({
    imports: [
        CommonModule,
        ComponentsSharedModule,
        DiuSharedServicesModule
    ],
    declarations: [
        ApplicationTileComponent,
        ApplicationInfoDialogComponent
    ],
    exports: [
        ApplicationTileComponent,
        ApplicationInfoDialogComponent
    ]
})
export class DiuApplicationTileComponentModule {}
