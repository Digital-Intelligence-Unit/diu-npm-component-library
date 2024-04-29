import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { APIService } from "../../services/api.service";
import { iApplication } from "../../types/installations.interface";
import { ApplicationInfoDialogComponent } from "./dialog-information/dialoginformation";
import { iUserProfile } from "../../types/user.interface";
import { getUser } from "../../functions/generic.helper";

@Component({
    selector: "app-application-tile",
    templateUrl: "./application-tile.component.html",
})
export class ApplicationTileComponent implements OnInit {
    user: iUserProfile;
    @Input() app: iApplication;
    @Input() status: string;
    @Output() changed = new EventEmitter<any>();

    constructor(public dialog: MatDialog, private apiService: APIService) {}

    ngOnInit() {
        // Set user
        this.user = getUser();
    }

    open() {
        if (this.app.url) {
            if (this.status === "installed") {
                window.open(this.app.url, "_self");
            } else {
                this.openInformationModal();
            }
        }
    }

    openInformationModal() {
        // Open information dialog
        const dialogApp = this.dialog.open(ApplicationInfoDialogComponent, {
            width: "40%",
            data: this.app,
        });

        // Listen for close
        dialogApp.afterClosed().subscribe((decision: any) => {
            if (decision && decision.choice === "install") {
                // Get user id
                const userId = `${this.user.username}#${this.user.organisation}`;

                // Install app
                this.apiService
                    .createCapabiltiesLink({
                        capability_name: this.app.capability,
                        link_id: userId,
                        link_type: "user",
                        valuejson: "allow"
                    })
                    .subscribe(
                        () => {
                            this.status = "installed";
                            this.changed.emit({ action: "installed", app: this.app });
                        },
                        (error) => {
                            if(error.status === 403) {
                                // Send request
                                this.apiService.sendPermissionsRequest({
                                    type: "user",
                                    type_id: userId,
                                    user: {
                                        id: `${this.user.username}#${this.user.organisation}`,
                                        email: this.user.email
                                    },
                                    capabilities: [{
                                        id: this.app.capability,
                                        valuejson: "allow"
                                    }],
                                    roles: [],
                                    date: new Date().toISOString()
                                }).subscribe((data: any) => {
                                    if(data.success) {
                                        // Notify user
                                        window["notify"]({
                                            message: "An installation request for this app has been sent!",
                                            status: "success"
                                        });
                                    }
                                });
                            } else {
                                window["notify"]({ message: "Failed to install app", status: "error" });
                            }
                        }
                    );
            }
        });
    }

    openUserGuide() {
        window.open(this.app.userguideURL, "_blank");
    }

    uninstall() {
        this.apiService.deleteCapabilitiesLink({
            capability_name: this.app.capability,
            link_id: `${this.user.username}#${this.user.organisation}`,
            link_type: "user"
        }).subscribe(
            () => {
                this.status = "uninstalled";
                this.changed.emit({ action: "uninstalled", app: this.app });
            },
            () => {
                window["notify"]({
                    message: "Could not uninstall app, this is likely because it's authorised by one of your teams/roles",
                    status: "error",
                });
            }
        );
    }
}
