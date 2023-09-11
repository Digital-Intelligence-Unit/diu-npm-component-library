import { DoBootstrap, NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DiuComponentLibraryComponent } from "./diu-component-library.component";
import { InputComponent } from "./_components/_form/input/input.component";
import { SelectComponent } from "./_components/_form/select/select.component";
import { DateComponent } from "./_components/_form/date/date.component";
import { DynamicFormComponent } from "./_components/dynamic-form/dynamic-form.component";
import { MaterialModule } from "./_modules/material.module";
import { DynamicFieldDirective } from "./_components/_form/dynamic-field/dynamic-field.directive";
import { DisplayTableComponent } from "./_components/display-table/display-table.component";
import { RadiobuttonComponent } from "./_components/_form/radiobutton/radiobutton.component";
import { UserSearchDialogComponent } from "./_components/user-search/dialogusersearch";
import { UserSearchComponent } from "./_components/user-search/user-search.component";
import { HttpClientModule } from "@angular/common/http";
import { FileUploadComponent } from "./_components/_form/file-upload/file-upload.component";
import { ImageGalleryDialogComponent } from "./_components/image-gallery/image-gallery.component";
import { ImageUploaderModule } from "ngx-image-uploader-next";
import { DisplayApplicationsComponent } from "./_components/display-applications/display-applications.component";
import { PasswordGeneratorComponent } from "./_components/_form/generate-password/generate-password.component";
import { AutocompleteComponent } from "./_components/autocomplete/autocomplete.component";
import { CommonModule } from "@angular/common";
import { DynamicComponentDirective } from "./_components/dynamic-component/dynamic-component.directive";
import { MatCardComponent } from "./_components/matcard/matcard.component";
import { FlexLayoutModule } from "@angular/flex-layout";
import { DivRowComponent } from "./_components/_layouts/div-row.component";
import { DivColComponent } from "./_components/_layouts/div-col.component";
import { ProfileFullComponent } from "./_components/profile-full/profile-full.component";
import { CarouselComponent } from "./_components/carousel/carousel.component";
import { TabsComponent } from "./_components/tabs/tabs.component";
import { FormWithTableComponent } from "./_components/form-with-table/form-with-table.component";
import { ProfileInstallsComponent } from "./_components/profile-full/profile-installs.component";
import { ProfileTeamsComponent } from "./_components/profile-full/profile-teams.component";
import { DashboardTwitterComponent } from "./_components/dashboard-twitter/dashboard-twitter.component";
import { SizeDetectorComponent } from "./_components/size-detector/size-detector.component";
import { ResizeService } from "../lib/_services/resize.service";
import { DashboardPopulationComponent } from "./_components/dashboard-population/dashboard-population.component";
import { AcuteHospitalStatsComponent } from "./_components/dashboard-hospital-stats/dashboard-hospital-stats.component";
import { NewsStandComponent } from "./_components/newsstand/newsstand.component";
import { ScreenshotsComponent } from "./_components/screenshots/screenshots.component";
import { GalleryModule } from "ng-gallery";
import { ApplicationInfoDialogComponent } from "./_components/application-tile/dialoginformation";
import { ApplicationTileComponent } from "./_components/application-tile/application.component";
import { BrokerService } from "./_services/broker.service";
import { ResponsiblePersonComponent } from "./_components/_form/responsible-person/responsible-person.component";
import { InputChipListComponent } from "./_components/input-chiplist/input-chiplist.component";

@NgModule({
    declarations: [
        DiuComponentLibraryComponent,
        DynamicFormComponent,
        InputComponent,
        SelectComponent,
        DateComponent,
        RadiobuttonComponent,
        DynamicFieldDirective,
        DynamicComponentDirective,
        DisplayTableComponent,
        FileUploadComponent,
        ImageGalleryDialogComponent,
        PasswordGeneratorComponent,
        DisplayApplicationsComponent,
        UserSearchDialogComponent,
        UserSearchComponent,
        AutocompleteComponent,
        MatCardComponent,
        DivRowComponent,
        DivColComponent,
        ProfileFullComponent,
        CarouselComponent,
        TabsComponent,
        FormWithTableComponent,
        ProfileInstallsComponent,
        ProfileTeamsComponent,
        DashboardTwitterComponent,
        SizeDetectorComponent,
        DashboardPopulationComponent,
        AcuteHospitalStatsComponent,
        NewsStandComponent,
        ScreenshotsComponent,
        ApplicationInfoDialogComponent,
        ApplicationTileComponent,
        ResponsiblePersonComponent,
        InputChipListComponent,
    ],
    imports: [
        FormsModule,
        ReactiveFormsModule,
        MaterialModule,
        ImageUploaderModule,
        HttpClientModule,
        CommonModule,
        FlexLayoutModule,
        GalleryModule,
    ],
    exports: [
        DiuComponentLibraryComponent,
        DynamicFormComponent,
        InputComponent,
        SelectComponent,
        DateComponent,
        RadiobuttonComponent,
        DynamicFieldDirective,
        DynamicComponentDirective,
        DisplayTableComponent,
        FileUploadComponent,
        ImageGalleryDialogComponent,
        PasswordGeneratorComponent,
        DisplayApplicationsComponent,
        AutocompleteComponent,
        MatCardComponent,
        DivRowComponent,
        DivColComponent,
        ProfileFullComponent,
        CarouselComponent,
        TabsComponent,
        FormWithTableComponent,
        ProfileInstallsComponent,
        ProfileTeamsComponent,
        DashboardTwitterComponent,
        SizeDetectorComponent,
        DashboardPopulationComponent,
        AcuteHospitalStatsComponent,
        NewsStandComponent,
        ScreenshotsComponent,
        ApplicationInfoDialogComponent,
        ApplicationTileComponent,
        ResponsiblePersonComponent,
        InputChipListComponent,
    ],
    providers: [ResizeService, BrokerService],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class DiuComponentLibraryModule {}
