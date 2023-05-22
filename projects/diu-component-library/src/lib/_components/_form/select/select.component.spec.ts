/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { SelectComponent } from "./select.component";
import { MaterialModule } from "../../../_modules/material.module";

import { UntypedFormControl, UntypedFormGroup, ReactiveFormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

describe("SelectComponent", () => {
    let component: SelectComponent;
    let fixture: ComponentFixture<SelectComponent>;
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [ReactiveFormsModule, MaterialModule, BrowserAnimationsModule],
            declarations: [SelectComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SelectComponent);
        component = fixture.componentInstance;
        component.field = {
            type: "dropdown",
            helperText: "Test helperText",
            name: "selectName",
            label: "Test Label",
            options: [
                {
                    optionKey: "option_1",
                    optionValue: "Option 1",
                    ordernumber: 1,
                },
                {
                    optionKey: "",
                    optionValue: "Please Select",
                    ordernumber: 0,
                },
            ],
            validators: [
                {
                    name: "required",
                    validatortype: "",
                    message: "dropdown field is required",
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

    it("should show invalid message when value not set when required", () => {
        // Act
        fixture.detectChanges();
        // Arrange
        component.group.controls["selectName"].patchValue(null);
        // Assert
        expect(component.group.status).toBe("INVALID");
    });

    it("should display the list of options passed to the component in order", () => {
        // Act
        let optvals: any = [
            {
                optionKey: "option_1",
                optionValue: "Option 1",
                ordernumber: 1,
            },
            {
                optionKey: "",
                optionValue: "Please Select",
                ordernumber: 0,
            },
        ];
        fixture.detectChanges();

        // Arrange
        optvals = component.sortItems(optvals);
        const firstitem = component.field.options[0];
        const seconditem = component.field.options[1];

        // Assert
        expect(JSON.stringify(component.field.options)).toBe(JSON.stringify(optvals));
        expect(firstitem.ordernumber <= seconditem.ordernumber).toBeTruthy();
    });
});
