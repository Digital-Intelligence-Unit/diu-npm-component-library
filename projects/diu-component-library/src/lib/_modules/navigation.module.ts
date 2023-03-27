import { HttpClientModule } from "@angular/common/http";
import { RouterModule } from "@angular/router";
import { AccordionDirective } from "../_components/diu-angular-navigation/accordion/accordion.directive";
import { AccordionAnchorDirective } from "../_components/diu-angular-navigation/accordion/accordionanchor.directive";
import { AccordionLinkDirective } from "../_components/diu-angular-navigation/accordion/accordionlink.directive";
import { DiuAngularNavigationComponent } from "../_components/diu-angular-navigation/diu-angular-navigation.component";
import { DiuAngularSpeedDialComponent } from "../_components/diu-angular-speed-dial/diu-angular-speed-dial.component";
import { MaterialModule } from "./material.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { APIService } from "../_services/api.service";

@NgModule({
    declarations: [
        DiuAngularNavigationComponent,
        DiuAngularSpeedDialComponent,
        AccordionAnchorDirective,
        AccordionLinkDirective,
        AccordionDirective,
    ],
    imports: [MaterialModule, RouterModule, HttpClientModule, FormsModule, ReactiveFormsModule, CommonModule],
    exports: [DiuAngularNavigationComponent, DiuAngularSpeedDialComponent],
    providers: [APIService],
})
export class DiuAngularNavigationModule {}
