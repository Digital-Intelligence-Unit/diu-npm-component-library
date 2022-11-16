import { CommonModule } from "@angular/common";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { RouterModule } from "@angular/router";
import { MaterialModule } from "../../_modules/material.module";
import { SystemAlertDialogComponent } from "./dialogs/systemalertdialog.component";

import { DiuAngularHeaderComponent } from "./diu-angular-header.component";

describe("DiuAngularHeaderComponent", () => {
    let component: DiuAngularHeaderComponent;
    let fixture: ComponentFixture<DiuAngularHeaderComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [DiuAngularHeaderComponent, SystemAlertDialogComponent],
            imports: [
                MaterialModule,
                RouterModule.forRoot([{ path: "", component: DiuAngularHeaderComponent }]),
                CommonModule,
            ],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DiuAngularHeaderComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
