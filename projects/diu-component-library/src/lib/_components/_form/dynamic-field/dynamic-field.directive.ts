import { ComponentFactoryResolver, Directive, Input, OnInit, ViewContainerRef } from "@angular/core";
import { UntypedFormGroup } from "@angular/forms";
import { iFieldConfig } from "../../../_models/field.interface";
import { componentMapper } from "../../_mapping/componentMapping";

/**
 * Dynamic Field Directive Class
 */
@Directive({
    // tslint:disable-next-line:directive-selector
    selector: "[dynamicField]",
})
export class DynamicFieldDirective implements OnInit {
    /**
     * Initialise Angular FieldConfig
     */
    @Input() field: iFieldConfig;
    /**
     * Initialise Form Group
     */
    @Input() group: UntypedFormGroup;
    /**
     * Represents a component created by a ComponentFactory
     */
    componentRef: any;

    /**
     * Dynamic Field Directive Constructor
     */
    constructor(private resolver: ComponentFactoryResolver, private container: ViewContainerRef) {}

    /**
     * Angular Life-cycle hook that is executed when the dynamic form component is initialized
     */
    ngOnInit() {
        // create field component
        this.createComponent();
        // add field config from passed data
        this.componentRef.instance.field = this.field;
        // add group config from passed data
        this.componentRef.instance.group = this.group;
    }

    /**
     * Creates the component
     */
    createComponent() {
        // set a variable and potentially override it based on field config of type/ inputType
        let component = this.field.type;
        if (component === "html") {
            component = this.field.inputType;
        }
        // uses the compnent variable to input the class of the component that will be created
        const factory = this.resolver.resolveComponentFactory(componentMapper[component]);
        // create the component by passing the factory.
        this.componentRef = this.container.createComponent(factory);
    }
}
