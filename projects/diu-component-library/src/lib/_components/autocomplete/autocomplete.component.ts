import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { UntypedFormControl, UntypedFormGroup } from "@angular/forms";
import { iFieldConfig } from "../../_models/field.interface";

/**
 * Autocomplete Component Class
 */
@Component({
    selector: "app-autocomplete",
    templateUrl: "./autocomplete.component.html",
})
export class AutocompleteComponent implements OnInit {
    /**
     * Initialise FieldConfig
     */
    field?: iFieldConfig;

    /**
     * Initialise FormGroup
     */
    group?: UntypedFormGroup;

    /**
     * formControl variable for if this component is a form element
     */
    formControl = new UntypedFormControl(null, null);

    /**
     * List of Items
     */
    @Input() allItems: any[] = [];

    /**
     * Output event when a item is selected
     */
    @Output() itemSelected = new EventEmitter<any>();

    /**
     * Constructor function
     */
    constructor() {}

    /**
     * function to be ran when the component is initialised
     */
    ngOnInit() {
        // If the component is being included as a from input set the controls
        if (this.group) {
            this.group.setControl(this.field.name, new UntypedFormControl(null, null));
            this.formControl = this.group.controls[this.field.name] as UntypedFormControl;
        }
    }

    /**
     * function to be ran when a new item is selected from the dropdown
     */
    changeSelection(item: any) {
        this.itemSelected.emit(item);
    }

    /**
     * function to return form control if set
     */
    getFormControl() {
        if (this.formControl) {
            return this.formControl;
        }
        return;
    }
}
