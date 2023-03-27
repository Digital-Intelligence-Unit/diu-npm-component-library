import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Location } from "@angular/common";
import { speedDialFabAnimations } from "./animations";
import jwt_decode from "jwt-decode";
import { MatDialog } from "@angular/material/dialog";
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
        }
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
}
