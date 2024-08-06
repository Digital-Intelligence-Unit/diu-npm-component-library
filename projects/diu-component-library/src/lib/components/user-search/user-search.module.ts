
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { ComponentsSharedModule } from "../components-shared.module";
import { UserSearchComponent } from "./user-search.component";
import { UserSearchDialogComponent } from "./dialog-user-search/dialogusersearch";
import { BrokerService } from "./legacy-broker.service";

@NgModule({
    imports: [
        CommonModule,
        ComponentsSharedModule
    ],
    declarations: [
        UserSearchComponent,
        UserSearchDialogComponent
    ],
    providers: [
        BrokerService // TO-DO: remove
    ],
    exports: [
        UserSearchDialogComponent,
    ]
})
export class DiuUserSearchComponentModule {}
