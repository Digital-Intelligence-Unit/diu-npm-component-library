import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Location } from "@angular/common";
import { speedDialFabAnimations } from "./animations";
import jwt_decode from "jwt-decode";
import { MatDialog } from "@angular/material/dialog";
import { VerifyDialogComponent } from "./dialogs/dialogverify";
import { ValidateDialogComponent } from "./dialogs/dialogvalidate";
import { APIService } from "../../_services/api.service";

@Component({
    selector: "lib-diu-angular-speed-dial",
    templateUrl: "./diu-angular-speed-dial.component.html",
    styleUrls: ["./diu-angular-speed-dial.component.scss"],
    animations: speedDialFabAnimations,
})
export class
DiuAngularSpeedDialComponent implements OnInit {
    @Output() newMFAToken = new EventEmitter<string>();
    @Output() errorMessage = new EventEmitter<string>();
    @Input() token: string;
    tokenDecoded: any;
    fabButtons = [
        {
            icon: "refresh",
            tooltip: "Refresh Content",
        },
        {
            icon: "reply",
            tooltip: "Go Back",
        },
        {
            icon: "security",
            tooltip: "Admin Access",
        },
    ];
    buttons = [];
    fabTogglerState = "inactive";

    constructor(private curLocation: Location, public dialog: MatDialog, private apiService: APIService) {}

    ngOnInit() {
        if (this.token) {
            this.tokenDecoded = jwt_decode(this.token);
            if (this.tokenDecoded.mfa) {
                this.newMFAToken.emit(this.token);
            }
        }
    }

    clickEvents(button: string) {
        switch (button) {
            case "refresh":
                location.reload();
                break;
            case "reply":
                this.curLocation.back();
                break;
            case "security":
                this.obtainMFA();
                break;
        }
        this.hideItems();
    }

    showItems() {
        this.fabTogglerState = "active";
        this.buttons = this.fabButtons;
    }

    hideItems() {
        this.fabTogglerState = "inactive";
        this.buttons = [];
    }

    onToggleFab() {
        this.buttons.length ? this.hideItems() : this.showItems();
    }

    obtainMFA() {
        if (!this.tokenDecoded) {
            return "User has not logged in.";
        }
        if (this.tokenDecoded.mfa) {
            this.newMFAToken.emit(this.token);
        } else {
            this.apiService.checkMFA().subscribe((res: any) => {
                if (res.error) {
                    this.errorMessage.emit("Unable to contact Authentication Service");
                } else {
                    if (res.msg.toString() === "true") {
                        const dialogRef = this.dialog.open(ValidateDialogComponent, {
                            width: "350px",
                            data: this.tokenDecoded,
                        });
                        dialogRef.afterClosed().subscribe((response: any) => {
                            if (response && response.length > 0) {
                                this.tokenDecoded = jwt_decode(response);
                                this.newMFAToken.emit(response);
                            }
                        });
                    } else {
                        this.apiService.registerMFA().subscribe((reg: any) => {
                            if (reg.tempSecret) {
                                const dialogRef = this.dialog.open(VerifyDialogComponent, {
                                    width: "350px",
                                    data: reg,
                                });
                                dialogRef.afterClosed().subscribe((response: any) => {
                                    if (response && response.length > 0) {
                                        this.tokenDecoded = jwt_decode(response);
                                        this.newMFAToken.emit(response);
                                    }
                                });
                            } else {
                                this.errorMessage.emit("Unable to generate Verification token.");
                            }
                        });
                    }
                }
            });
        }
    }
}
