import { FocusMonitor } from "@angular/cdk/a11y";
import { COMMA, ENTER } from "@angular/cdk/keycodes";
import { BooleanInput, coerceBooleanProperty } from "@angular/cdk/coercion";
import { ControlValueAccessor, UntypedFormControl, NgControl } from "@angular/forms";
import { Component, ElementRef, Inject, Input, OnDestroy, Optional, Self, Output, EventEmitter } from "@angular/core";
import { MAT_FORM_FIELD, MatFormField, MatFormFieldControl } from "@angular/material/form-field";
import { Subject } from "rxjs";

@Component({
    selector: "input-chiplist",
    templateUrl: "input-chiplist.component.html",
    providers: [{ provide: MatFormFieldControl, useExisting: InputChipListComponent }],
    host: {
        "[class.example-floating]": "shouldLabelFloat",
        "[id]": "id",
    },
})
export class InputChipListComponent implements ControlValueAccessor, MatFormFieldControl<Array<string>>, OnDestroy {
    static nextId = 0;
    controlType = "input-chiplist";
    id = `input-chiplist-${InputChipListComponent.nextId++}`;

    focused = false;
    touched = false;
    formControl: UntypedFormControl = new UntypedFormControl([]);
    separatorKeysCodes = [ENTER, COMMA];
    stateChanges = new Subject<void>();

    onChange = () => {};
    onTouched = () => {};

    get empty() {
        return !this.formControl.value.length;
    }

    get shouldLabelFloat() {
        return this.focused || !this.empty;
    }

    @Input()
    get placeholder(): string {
        return this.strPlaceholder;
    }
    set placeholder(value: string) {
        this.strPlaceholder = value;
        this.stateChanges.next();
    }
    private strPlaceholder: string;

    @Input()
    get required(): boolean {
        return this.boolRequired;
    }
    set required(value: boolean) {
        this.boolRequired = coerceBooleanProperty(value);
        this.stateChanges.next();
    }
    private boolRequired = false;

    @Input()
    get disabled(): boolean {
        return this.boolDisabled;
    }
    set disabled(value: boolean) {
        this.boolDisabled = coerceBooleanProperty(value);
        this.boolDisabled ? this.formControl.disable() : this.formControl.enable();
        this.stateChanges.next();
    }
    private boolDisabled = false;

    @Input()
    get value(): Array<string> | null {
        return this.formControl.valid ? this.formControl.value : null;
    }
    set value(values: Array<string> | null) {
        this.formControl.setValue(values);
        this.stateChanges.next();
    }

    get errorState(): boolean {
        return this.formControl.invalid && this.touched;
    }

    @Output() selected = new EventEmitter();

    constructor(
        private aFocusMonitor: FocusMonitor,
        private elemRef: ElementRef<HTMLElement>,
        @Optional() @Inject(MAT_FORM_FIELD) public _formField: MatFormField,
        @Optional() @Self() public ngControl: NgControl
    ) {
        if (this.ngControl != null) {
            this.ngControl.valueAccessor = this;
        }
    }

    ngOnDestroy() {
        this.stateChanges.complete();
        this.aFocusMonitor.stopMonitoring(this.elemRef);
    }

    setDescribedByIds(ids: string[]) {
        if (this.elemRef && this.elemRef.nativeElement) {
            const controlElement = this.elemRef?.nativeElement.querySelector(".mat-form-field-type-input-chiplist");
            controlElement.setAttribute("aria-describedby", ids.join(" "));
        }
    }

    onContainerClick() {}

    writeValue(values: Array<string> | null): void {
        this.value = values;
    }

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }

    addItem(event) {
        // Get mdt and value
        const items = this.formControl.value;
        const item = (event.value || "").trim();

        // Add to array
        if (item) {
            items.push(item);
            this.formControl.setValue(items);
            this.selected.emit(items);
        }

        // Clear the input value
        event.input.value = "";
    }

    removeItem(mdt) {
        // Get mdt and find index
        const items = this.formControl.value;
        const index = items.indexOf(mdt);

        // Remove from array
        if (index >= 0) {
            items.splice(index, 1);
            this.formControl.setValue(items);
            this.selected.emit(items);
        }
    }

    static ngAcceptInputTypeboolDisabled: BooleanInput;
    static ngAcceptInputTypeboolRequired: BooleanInput;
}
