import { Component, Inject, Input, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { cComponentHandler } from "../../../types/componentHandler";
import { iEventActions } from "../../../types/eventactions";
import { iFullUser } from "../../../types/user.interface";
import { BrokerService } from "../legacy-broker.service";

/**
 * User Search Modal Component Class
 */
@Component({
    selector: "dialog-usersearch",
    templateUrl: "dialogusersearch.html",
})
export class UserSearchDialogComponent implements OnInit {
    @Input() config: any;
    Handler: cComponentHandler;
    usersearchConfig: any;

    /**
     * User Search Modal Constructor
     */
    constructor(
        /**
         * Mat Dialog Library to handle component actions
         */
        public dialogRef: MatDialogRef<UserSearchDialogComponent>,
        /**
         * Mat Data Injector for passing Data to Modal
         */
        @Inject(MAT_DIALOG_DATA) public data: any,
        private brokerService: BrokerService
    ) {}

    ngOnInit() {
        if (this.config) this.Handler = new cComponentHandler(this.config);
        else if (this.data) this.Handler = new cComponentHandler(this.data);

        if (this.Handler && this.Handler.actions.length > 0) {
            this.usersearchConfig = {
                actions: this.Handler.actions,
            };

            this.brokerService.currentMessage.subscribe((event: iEventActions) => {
                const matches = this.Handler.actions.filter((x) => x.action === event.action);
                if (matches.length > 0) {
                    this.selectUser(event.payload);
                }
            });
        }
    }

    /**
     * Function to handle the click function for selecting a User and passing it back to the parent component
     */
    selectUser(person: iFullUser) {
        this.dialogRef.close(person);
    }

    /**
     * Function to handle the click function for closing the Close button
     */
    onNoClick(): void {
        this.dialogRef.close();
    }
}
