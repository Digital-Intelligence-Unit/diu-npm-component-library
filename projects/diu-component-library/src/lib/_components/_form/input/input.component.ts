import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
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
  group: FormGroup;
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
    let arrValidation = [];
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
    const domElem = <HTMLInputElement>document.getElementById(this.dataHandler.name);
    if (domElem && domElem.value) {
      currValue = domElem.value;
    }
    this.group.setControl(this.dataHandler.name, new FormControl(currValue, arrValidation));
  }

  /**
   * Function adds custom validation to different input types, this validation is always required for the field
   */
  addCustomValidation(strInputType: string) {
    //set pattern using regex or a function to ensure the data matches a specific formula based on an input type
    let strPattern;
    switch (strInputType) {
      case "email":
        strPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        break;
      case "postcode":
        strPattern =
          /^(([gG][iI][rR] {0,}0[aA]{2})|(([aA][sS][cC][nN]|[sS][tT][hH][lL]|[tT][dD][cC][uU]|[bB][bB][nN][dD]|[bB][iI][qQ][qQ]|[fF][iI][qQ][qQ]|[pP][cC][rR][nN]|[sS][iI][qQ][qQ]|[iT][kK][cC][aA]) {0,}1[zZ]{2})|((([a-pr-uwyzA-PR-UWYZ][a-hk-yxA-HK-XY]?[0-9][0-9]?)|(([a-pr-uwyzA-PR-UWYZ][0-9][a-hjkstuwA-HJKSTUW])|([a-pr-uwyzA-PR-UWYZ][a-hk-yA-HK-Y][0-9][abehmnprv-yABEHMNPRV-Y]))) {0,1}[0-9][abd-hjlnp-uw-zABD-HJLNP-UW-Z]{2}))$/;
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
  NHSnumberValidation(control: FormControl) {
    // get NHS number from input
    let nhsNumber = control.value;
    if (nhsNumber) {
      nhsNumber = nhsNumber.replace(/\s/g, "");
    }
    //fail validation if the number is not 10 characters, has non numerical characters or no value
    if (nhsNumber === undefined || nhsNumber === null || isNaN(Number(nhsNumber)) || nhsNumber.toString().length !== 10) {
      return { nhsNumber: true };
    }
    //turn number into string to split into an array
    if (Number.isInteger(nhsNumber)) {
      nhsNumber = nhsNumber.toString();
    }
    //turn NHS number into an array
    var nhsNumberAsArray = nhsNumber.split("");
    //get the remainder by adding each multiplied value together and dividing by 11.
    var remainder = nhsNumberAsArray.slice(0, 9).map(multiplyByPosition).reduce(addTogether, 0) % 11;
    var checkDigit = 11 - remainder;
    if (checkDigit === 11) {
      checkDigit = 0;
    }
    //check that the last digit matches the remainder
    var providedCheckDigit = nhsNumberAsArray[9];
    //if the last digit matches the checkDigit number then return null (anything returned means validation failed)
    if (checkDigit === Number(providedCheckDigit)) {
      return null;
    }
    //return a fail if the function hasn't passed
    return { nhsNumber: true };
  }
}

/**
 * Multiply each number by the reverse of their position in the array (1st number by 10, second number by 9 and so on)
 */
function multiplyByPosition(digit, index) {
  return digit * (11 - (index + 1));
}
/**
 * Add 2 values together
 */
function addTogether(previousValue, currentValue) {
  return previousValue + currentValue;
}
