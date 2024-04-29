import { Component, Inject, Input, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { iApplication } from "../../../types/installations.interface";

@Component({
    selector: "dialog-information",
    templateUrl: "dialoginformation.html",
})
export class ApplicationInfoDialogComponent implements OnInit {
    @Input() config: any;
    loadedData: iApplication;

    constructor(
        public dialogRef: MatDialogRef<ApplicationInfoDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: iApplication,
    ) {
        if (data) { this.loadedData = data; }
    }

    ngOnInit() {
        if (!this.loadedData && this.config) this.loadedData = JSON.parse(this.config);
    }

    close(choice = "cancel"): void {
        this.dialogRef.close({ choice });
    }
}
