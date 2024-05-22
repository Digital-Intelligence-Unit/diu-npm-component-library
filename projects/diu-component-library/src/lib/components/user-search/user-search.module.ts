
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { ComponentsSharedModule } from "../components-shared.module";
import { UserSearchComponent } from "./user-search.component";
import { UserSearchDialogComponent } from "./dialog-user-search/dialogusersearch";

@NgModule({
    imports: [
        CommonModule,
        ComponentsSharedModule
    ],
    declarations: [
        UserSearchComponent,
        UserSearchDialogComponent
    ],
    exports: [
        UserSearchDialogComponent
    ]
})
export class DiuUserSearchComponentModule {}
