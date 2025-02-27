
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatDialogModule } from "@angular/material/dialog";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { MatListModule } from "@angular/material/list";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatCardModule } from "@angular/material/card";
import { MatSelectModule } from "@angular/material/select";
import { MatFormFieldModule } from "@angular/material/form-field";
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
        MatButtonModule,
        MatDialogModule,
        MatListModule,
        MatProgressSpinnerModule,
        MatSelectModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule
    ],
    exports: [
        FormsModule, 
        ReactiveFormsModule,
        
        DiuSharedServicesModule,
        MatIconModule,
        MatTooltipModule,
        MatButtonModule,
        MatDialogModule,
        MatListModule,
        MatProgressSpinnerModule,
        MatSelectModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule
    ]
})
export class ComponentsSharedModule {}
