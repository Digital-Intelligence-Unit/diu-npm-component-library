import { Component, OnInit } from "@angular/core";
import { UntypedFormControl, UntypedFormGroup } from "@angular/forms";
import { iFieldConfig } from "../../../_models/field.interface";

/**
 * Password Generator Component Class for Form Inputs
 */
@Component({
    selector: "password-generator",
    templateUrl: "./generate-password.component.html",
    styles: [],
})
export class PasswordGeneratorComponent implements OnInit {
    /**
     * Initialise FieldConfig
     */
    field: iFieldConfig;

    /**
     * Initialise FormGroup
     */
    group: UntypedFormGroup = new UntypedFormGroup({});

    /**
     * Form Input Name
     */
    formName = "default";

    /**
     * If the number checkbox in the HTML is clicked this is set to true
     */
    useNumbers: boolean;

    /**
     * If the special characters checbox in the HTML is clicked this is set to true
     */
    useSpecialCharacters: boolean;

    /**
     * Determines how long the loop selecting characters for the password should run,
     * this number has a form input that can alter the setting
     */
    passwordLength = 8;

    /**
     * Empty string to be populated when generating a new password
     */
    newPassword = "";

    /**
     * Constructor Function
     */
    constructor() {
        this.group.setControl(this.formName, new UntypedFormControl(null, null));
    }

    /**
     * This function is called on init and adds FormControl to the component and
     * a listener to update the password if data is passed to form after init
     */
    ngOnInit() {
        if (this.group && this.field) {
            this.formName = this.field.name;
            this.group.setControl(this.formName, new UntypedFormControl(null, null));
            this.group.controls[this.formName].valueChanges.subscribe((data) => {
                this.newPassword = data;
            });
        }
    }

    /**
     * Generate password function, this function loops through a series of characters to return a random string
     */
    generatePassword() {
        // the character set is initially just letters
        let charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

        // if the HTML input is checked for using numbers then the character set will include numbers 0-9
        if (this.useNumbers) {
            charset += "0123456789";
        }

        // if the HTML input is checked for using special characters then the character set will include the characters below
        if (this.useSpecialCharacters) {
            charset += " !#$%&'()*+,-./:;<=>?@[]^_`{|}~";
        }

        // set an empty string to build up in the loop
        let password = "";

        // loop through the character set selecting a character at random and building up the password string
        for (let i = 0, n = charset.length; i < this.passwordLength; i++) {
            password += charset.charAt(Math.floor(Math.random() * n));
        }

        // update the input value with the new password
        this.group.controls[this.field.name].patchValue(password);
        // set the new password as a class variables
        this.newPassword = password;
    }

    /**
     * this function is triggered by an event when the numbers checkbox is clicked in the HTML
     */
    updateNumbers(event) {
        this.useNumbers = event.checked;
    }

    /**
     * this function is triggered by an event when the special characters checkbox is clicked in the HTML
     */
    updateSpecialCharacters(event) {
        this.useSpecialCharacters = event.checked;
    }

    /**
     * this function is triggered by an event when the password length input changes
     */
    updatePasswordLength(data) {
        this.passwordLength = data;
    }
}
