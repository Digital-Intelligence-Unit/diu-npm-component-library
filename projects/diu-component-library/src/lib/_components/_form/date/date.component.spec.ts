/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { DateComponent } from "./date.component";
import { UntypedFormControl, UntypedFormGroup, ReactiveFormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MaterialModule } from "../../../_modules/material.module";

describe("DateComponent", () => {
    let component: DateComponent;
    let fixture: ComponentFixture<DateComponent>;
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [ReactiveFormsModule, MaterialModule, BrowserAnimationsModule],
            declarations: [DateComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DateComponent);
        component = fixture.componentInstance;
        component.field = {
            type: "date",
            helperText: "Test helperText",
            name: "dateName",
            label: "Test Label",
            options: [],
            validators: [
                {
                    name: "required",
                    validatortype: "",
                    message: "date field is required",
                },
            ],
        };
        component.group = new UntypedFormGroup({
            selectName: new UntypedFormControl(null, []),
        });
        component.ngOnInit();
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    // const TestCases = [
    //   { name: "DateValidTest", inputType: "date", testvalue: new Date(2020, 1, 1), status: "VALID" },
    //   { name: "DateInvalidTest", inputType: "date", testvalue: "randomString", status: "INVALID" },
    //   { name: "TimeValidTest", inputType: "time", testvalue: new Date(2020, 1, 1).getTime(), status: "VALID" },
    //   { name: "TimeInvalidTest", inputType: "time", testvalue: "randomString", status: "INVALID" },
    //   { name: "DateTimeValidTest", inputType: "time", testvalue: new Date(2020, 1, 1), status: "VALID" },
    //   { name: "DateTimeInvalidTest", inputType: "time", testvalue: "randomString", status: "INVALID" },
    // ];

    // TestCases.forEach((test) => {
    //   it(test.name + "should create", () => {
    //     expect(component).toBeTruthy();
    //   });

    //   it(test.name + "should show invalid message when value not set when required", () => {
    //     // Act
    //     fixture.detectChanges();
    //     // Arrange
    //     component.group.controls["dateName"].patchValue(null);
    //     // Assert
    //     expect(component.group.status).toBe("INVALID");
    //   });

    //   it(test.name + "should be valid when value has been set", () => {
    //     // Act
    //     fixture.detectChanges();
    //     // Arrange
    //     component.group.controls["dateName"].patchValue(test.testvalue);
    //     // Assert
    //     expect(component.group.status).toBe(test.status);
    //   });
    // });
});
