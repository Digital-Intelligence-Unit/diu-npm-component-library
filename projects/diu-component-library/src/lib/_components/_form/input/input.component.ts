import { Component, OnInit } from "@angular/core";
import { UntypedFormControl, UntypedFormGroup, Validators } from "@angular/forms";
import { iFieldConfig, iValidator } from "../../../_models/field.interface";
import { inputComponentHandler } from "./input.component.handler";

/**
 * Input Component Class for Form Inputs
 */
@Component({
    selector: "app-input",
    templateUrl: "input.component.html",
})
export class InputComponent implements OnInit {
    /**
     * Initialise FieldConfig
     */
    field: iFieldConfig;
    /**
     * Initialise FormGroup
     */
    group: UntypedFormGroup;
    /**
     * Initialise dataHandler
     */
    dataHandler: inputComponentHandler;

    /**
     * Constructor Function
     */
    constructor() {}

    /**
     * Initialisation Function
     */
    ngOnInit() {
        /**
         * If the field exists and has validators call the set validation function
         */
        this.dataHandler = new inputComponentHandler(this.field, this.group);
        if (this.dataHandler && this.dataHandler.validators && this.dataHandler.validators.length > 0) {
            this.setValidation(this.dataHandler.validators);
        }
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

        // If the field type requires custom validation add this to the array
        const customValidation = this.addCustomValidation(this.dataHandler.inputType);
        if (customValidation) arrValidation.push(customValidation);

        // Set the current fieldvalue based on what data has been passed if the form is re-rendered
        let currValue = null;
        const domElem = document.getElementById(this.dataHandler.name) as HTMLInputElement;
        if (domElem && domElem.value) {
            currValue = domElem.value;
        }
        this.group.setControl(this.dataHandler.name, new UntypedFormControl(currValue, arrValidation));
    }

    /**
     * Function adds custom validation to different input types, this validation is always required for the field
     */
    addCustomValidation(strInputType: string) {
        // set pattern using regex or a function to ensure the data matches a specific formula based on an input type
        let strPattern;
        switch (strInputType) {
            case "email":
                strPattern = /\S+@\S+\.\S+/;
                break;
            case "postcode":
                strPattern = /^([A-Z][A-HJ-Y]?\d[A-Z\d]? ?\d[A-Z]{2}|GIR ?0A{2})$/;
                break;
            case "password":
                strPattern = /^(?=.*[0-9]{1,})(?=.*[a-z])(?=.*[A-Z]{1,})(?=.*[!@£$%^&*()]{1,})([a-zA-Z0-9!@£$%^&*()]{8,})$/;
                break;
            case "phone":
                strPattern = /^\s*(([+]\s?\d[-\s]?\d|0)?\s?\d([-\s]?\d){9}|[(]\s?\d([-\s]?\d)+\s*[)]([-\s]?\d)+)\s*$/;
                break;
            case "nationalInsurance":
                strPattern = /^\s*[a-zA-Z]{2}(?:\s*\d\s*){6}[a-zA-Z]?\s*$/;
                break;
            case "nhsNumber":
                return this.NHSnumberValidation;
                break;
        }
        if (strPattern) {
            return Validators.pattern(strPattern);
        }
        return null;
    }

    /**
     * Override input type so that the HTML outputs a valid input type, for validation
     */
    getFieldType(type) {
        let inputType = type;
        switch (type) {
            case "postcode":
            case "nationalInsurance":
            case "phone":
            case "nhsNumber":
                inputType = "input";
                break;
        }
        return inputType;
    }

    /**
     * Function to validate NHS numbers
     */
    NHSnumberValidation(control: UntypedFormControl) {
        // get NHS number from input
        let nhsNumber = control.value;
        if (nhsNumber) {
            nhsNumber = nhsNumber.replace(/\s/g, "");
        }
        // fail validation if the number is not 10 characters, has non numerical characters or no value
        if (nhsNumber === undefined || nhsNumber === null || isNaN(Number(nhsNumber)) || nhsNumber.toString().length !== 10) {
            return { nhsNumber: true };
        }
        // turn number into string to split into an array
        if (Number.isInteger(nhsNumber)) {
            nhsNumber = nhsNumber.toString();
        }
        // turn NHS number into an array
        const nhsNumberAsArray = nhsNumber.split("");
        // get the remainder by adding each multiplied value together and dividing by 11.
        const remainder = nhsNumberAsArray.slice(0, 9).map(multiplyByPosition).reduce(addTogether, 0) % 11;
        let checkDigit = 11 - remainder;
        if (checkDigit === 11) {
            checkDigit = 0;
        }
        // check that the last digit matches the remainder
        const providedCheckDigit = nhsNumberAsArray[9];
        // if the last digit matches the checkDigit number then return null (anything returned means validation failed)
        if (checkDigit === Number(providedCheckDigit)) {
            return null;
        }
        // return a fail if the function hasn't passed
        return { nhsNumber: true };
    }
}

/**
 * Multiply each number by the reverse of their position in the array (1st number by 10, second number by 9 and so on)
 */
const multiplyByPosition = (digit: number, index: number) => {
    return digit * (11 - (index + 1));
};
/**
 * Add 2 values together
 */
const addTogether = (previousValue: number, currentValue: number) => {
    return previousValue + currentValue;
};
