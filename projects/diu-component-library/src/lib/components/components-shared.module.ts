
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatDialogModule } from "@angular/material/dialog";
import { MatLegacyInputModule } from "@angular/material/legacy-input";
import { MatLegacyButtonModule } from "@angular/material/legacy-button";
import { MatLegacyListModule } from "@angular/material/legacy-list";
import { MatLegacyProgressSpinnerModule } from "@angular/material/legacy-progress-spinner";
import { MatLegacyCardModule } from "@angular/material/legacy-card";
import { MatLegacySelectModule } from "@angular/material/legacy-select";
import { MatLegacyFormFieldModule } from "@angular/material/legacy-form-field";
import { DiuSharedServicesModule } from "../modules/services.module";

@NgModule({
    imports: [
        CommonModule,
        HttpClientModule,
        FormsModule, 
        ReactiveFormsModule,

        DiuSharedServicesModule,
        MatIconModule,
        MatTooltipModule,
        MatLegacyButtonModule,
        MatDialogModule,
        MatLegacyListModule,
        MatLegacyProgressSpinnerModule,
        MatLegacySelectModule,
        MatLegacyCardModule,
        MatLegacyFormFieldModule,
        MatLegacyInputModule
    ],
    exports: [
        FormsModule, 
        ReactiveFormsModule,
        
        DiuSharedServicesModule,
        MatIconModule,
        MatTooltipModule,
        MatLegacyButtonModule,
        MatDialogModule,
        MatLegacyListModule,
        MatLegacyProgressSpinnerModule,
        MatLegacySelectModule,
        MatLegacyCardModule,
        MatLegacyFormFieldModule,
        MatLegacyInputModule
    ]
})
export class ComponentsSharedModule {}
