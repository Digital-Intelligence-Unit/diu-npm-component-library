import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    OnChanges,
    OnInit,
    Output,
    ViewEncapsulation,
} from "@angular/core";
import { UntypedFormGroup, UntypedFormBuilder, Validators, UntypedFormControl, UntypedFormArray } from "@angular/forms";
import { iFieldConfig } from "../../_models/field.interface";
import { APIService } from "../../_services/api.service";

/**
 * Dynamic Form Component Class
 */
@Component({
    exportAs: "dynamicForm",
    // tslint:disable-next-line:component-selector
    selector: "dynamic-form",
    templateUrl: "./dynamic-form.component.html",
    styleUrls: ["./dynamic-form.component.scss"],
    encapsulation: ViewEncapsulation.None,
})
export class DynamicFormComponent implements OnInit, OnChanges, AfterViewInit {
    /**
     * Event passed to parent when form is submitted
     */
    @Output() submitted: EventEmitter<any> = new EventEmitter<any>();
    /**
     * Input for the data for the Form, including the configuration
     */
    @Input() formData?: any;
    /**
     * Input for the unique ID of the Form
     */
    @Input() formDataID?: any;
    /**
     * Input for whether a validation message be output
     */
    @Input() displayValidation: boolean;
    /**
     * Input for the values stored in the form
     */
    @Input() formAnswers: any;
    /**
     * Initialise Form fields for Configuration
     */
    fields: iFieldConfig[] = [];
    /**
     * The last known set of answers, used to determine if the form values need updating
     */
    changedAnswers: any;
    /**
     * Initialise Form Group
     */
    form: UntypedFormGroup;

    /**
     * Dynamic Form Component Constructor
     */
    constructor(private fb: UntypedFormBuilder, private changeDetectorRef: ChangeDetectorRef, private apiService: APIService) {}

    /**
     * Angular Life-cycle hook that is executed when the dynamic form component is initialized
     */
    ngOnInit() {
        // create form control
        this.form = this.createControl();
        // if there's no preloaded data and a form ID provided
        if (!this.formData && this.formDataID) {
            //  use the form ID to get form config from db
            this.apiService.getPayloadById(this.formDataID).subscribe((data: any) => {
                //  if the data has been returned
                if (data) {
                    //  form data is stored under the key config
                    this.formData = JSON.parse(data.config);
                    this.setFormData();
                }
            });
            return;
        }
        //  if formData has already been provided
        if (this.formData) {
            this.setFormData();
        }
    }

    /**
     * Angular Life-cycle hook that is executed each time the input for the Component has been changed
     */
    ngOnChanges() {
        // If the form answers have been updated
        if (this.changedAnswers !== this.formAnswers) {
            // Set the changed answers to the newly passed answers
            this.changedAnswers = this.formAnswers;
            // create config to pass form answers to dynamic form
            const config = this.formAnswers;
            Object.keys(config).forEach((key) => {
                // If the form answers are in an array (checkboxes, for example)
                if (typeof config[key] === "object") {
                    const arrFormControls: UntypedFormArray = this.form.get(key) as UntypedFormArray;
                    config[key].forEach((elem) => {
                        arrFormControls.push(new UntypedFormControl(elem));
                    });
                    config[key] = arrFormControls;
                } else {
                    // get the current form input
                    const objCurrentGroup = this.form.get(key);
                    // if the form input isn't in the form, remove the value from the config override
                    if (!objCurrentGroup) {
                        delete config[key];
                    }
                }
            });
            this.form.setValue(config);
            this.form.updateValueAndValidity();
            this.changeDetectorRef.detectChanges();
        }
    }

    /**
     * Angular Life-cycle hook that is executed after the component has been initialised
     */
    ngAfterViewInit() {
        this.changeDetectorRef.detectChanges();
    }

    /**
     * Sets the form data fields as passed through to the application
     */
    setFormData() {
        if (this.formData.questions) {
            this.fields = this.formData.questions;
        }
    }

    /**
     * Function to emit data to the parent component when submitted
     */
    onSubmit(event: Event) {
        event.preventDefault();
        event.stopPropagation();
        //  if the form is valid pass the data to the parent else mark each field as touched to trigger validation
        if (this.form.valid) {
            this.submitted.emit(this.form.value);
        } else {
            this.validateAllFormFields(this.form);
        }
    }

    /**
     * Creates form controls for each field
     */
    createControl() {
        // create form group using the formbuilder object
        const group = this.fb.group({});
        //  loop through each field to set the control required
        this.fields.forEach((field) => {
            // different field types require different controls
            switch (field.type) {
                case "button":
                    return;
                case "checkbox":
                    group.addControl(field.name, this.fb.array(field.value || [], this.bindValidations(field.validators || [])));
                    break;
                default:
                    group.addControl(field.name, this.fb.control(field.value, this.bindValidations(field.validators || [])));
                    break;
            }
        });
        return group;
    }

    /**
     * Adds validation to each field
     */
    bindValidations(validations: any) {
        if (validations.length > 0) {
            const validList = [];
            validations.forEach((valid) => {
                validList.push(valid.validator);
            });
            return Validators.compose(validList);
        }
        return null;
    }

    /**
     * Marks each field as Touched to Trigger Validation functions
     */
    validateAllFormFields(formGroup: UntypedFormGroup) {
        Object.keys(formGroup.controls).forEach((field) => {
            const control = formGroup.get(field);
            control.markAsTouched({ onlySelf: true });
        });
    }
}
