import { Component, OnInit } from "@angular/core";
import { UntypedFormControl, UntypedFormGroup, Validators } from "@angular/forms";
import { iFieldConfig, iValidator } from "../../../_models/field.interface";

/**
 * Date Component Class for Form Inputs exclusively for Dates & Times
 */
@Component({
    selector: "app-date",
    templateUrl: "date.component.html"
})
export class DateComponent implements OnInit {
    /**
     * Initialise FieldConfig
     */
    field: iFieldConfig;
    /**
     * Initialise FormGroup
     */
    group: UntypedFormGroup;

    /**
     * Constructor Function
     */
    constructor() {}

    /**
     * Initialisation Function
     */
    ngOnInit() {
        // create array for all validation types to be uploaded too if required
        let arrValidation = [];
        // if the field exists and has validators add the validators to the array
        if (this.field && this.field.validators && this.field.validators.length > 0) {
            arrValidation = this.setValidation(this.field.validators);
        }
        // set the form control with validation in place
        this.group.setControl(this.field.name, new UntypedFormControl(null, arrValidation));
    }

    /**
     * Function to set validation on the form inputs
     */
    setValidation(validators: iValidator[]) {
        // 1. Initialise an empty array
        const arrValidation = [];
        // 2. Loop through the validators and add to the array
        validators.forEach((validator: iValidator) => {
            switch (validator.name) {
                case "pattern":
                    arrValidation.push(Validators.pattern(validator.validatorpattern)); // might change this later on
                    break;
                case "required":
                    arrValidation.push(Validators.required);
                    break;
            }
        });
        return arrValidation;
    }
}
