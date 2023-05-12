import { Component, OnInit } from "@angular/core";
import { UntypedFormGroup, UntypedFormControl, Validators } from "@angular/forms";
import { iFieldConfig, iOptions, iValidator } from "../../../_models/field.interface";
import { selectComponentHandler } from "./select.component.handler";

/**
 * Select Component Class
 */
@Component({
    selector: "app-select",
    templateUrl: "select.component.html",
})
export class SelectComponent implements OnInit {
    /**
     * Initialise Angular FieldConfig
     */
    field: iFieldConfig;
    /**
     * Initialise Form Group
     */
    group: UntypedFormGroup;
    /**
     * Initialise dataHandler
     */
    dataHandler: selectComponentHandler;

    /**
     * Select Component Constructor
     */
    constructor() {}

    /**
     * Select Component Initialiser function
     */
    ngOnInit() {
        // sort the options based on their sort order
        this.dataHandler = new selectComponentHandler(this.field, this.group);
        if (this.dataHandler.options) {
            this.dataHandler.options = this.sortItems(this.dataHandler.options);
        }
        if (this.dataHandler && this.dataHandler.validators && this.dataHandler.validators.length > 0) {
            this.setValidation(this.dataHandler.validators);
        }
    }

    /**
     * Function to sort values in Select list
     */
    sortItems(input: iOptions[]) {
        if (!input) return input;
        if (input && input.length <= 1) return input;
        return input.sort((a, b) => (a.ordernumber > b.ordernumber ? 1 : -1));
    }

    /**
     * Function to set Validation in Select list
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

        // set the current fieldvalue based on what data has been passed if the form is re-rendered
        let currValue = null;
        let selectedValue = "";
        const attributeSelector =
            `[ng-reflect-name="` +
            (this.dataHandler.name as string) +
            `"]
        span.mat-select-value-text span.ng-star-inserted`;
        const domElem = document.querySelector(attributeSelector);
        if (domElem && domElem.innerHTML) {
            selectedValue = domElem.innerHTML;
        }
        this.dataHandler.options.forEach((option) => {
            if (selectedValue === option.optionValue) {
                currValue = option.optionKey;
            }
        });
        this.group.setControl(this.dataHandler.name, new UntypedFormControl(currValue, arrValidation));
    }
}
