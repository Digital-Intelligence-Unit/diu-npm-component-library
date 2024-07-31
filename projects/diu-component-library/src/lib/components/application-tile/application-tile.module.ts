
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatLegacyDialogModule } from "@angular/material/legacy-dialog";
import { MatLegacyButtonModule } from "@angular/material/legacy-button";
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';

import { DiuSharedServicesModule } from "../../modules/services.module";

import { ApplicationTileComponent } from "./application-tile.component";
import { ApplicationInfoDialogComponent } from "./dialog-information/dialoginformation";

@NgModule({
    imports: [
        CommonModule,
        MatLegacyButtonModule,
        MatLegacyDialogModule,
        MatTooltipModule,
        MatIconModule,
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
