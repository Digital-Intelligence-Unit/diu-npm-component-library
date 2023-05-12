import { NgModule } from "@angular/core";
import { MaterialModule } from "./material.module";
import { RouterModule } from "@angular/router";
import { DiuAngularHeaderComponent } from "../_components/diu-angular-header/diu-angular-header.component";
import { SystemAlertDialogComponent } from "../_components/diu-angular-header/dialogs/systemalertdialog.component";
import { CommonModule } from "@angular/common";

@NgModule({
    declarations: [DiuAngularHeaderComponent, SystemAlertDialogComponent],
    imports: [MaterialModule, RouterModule, CommonModule],
    exports: [DiuAngularHeaderComponent, SystemAlertDialogComponent]
})
export class DiuHeaderModule {}
