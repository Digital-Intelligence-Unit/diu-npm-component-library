import { Component, Input, OnChanges, OnInit } from "@angular/core";
import { UntypedFormGroup } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { iFieldConfig } from "../../../_models/field.interface";
import { iFullUser } from "../../../_models/user.interface";
import { UserSearchDialogComponent } from "../../user-search/dialogusersearch";

@Component({
    selector: "responsible-person",
    templateUrl: "./responsible-person.component.html",
    styles: [],
})
export class ResponsiblePersonComponent implements OnInit, OnChanges {
    @Input() field: iFieldConfig;
    @Input() group: UntypedFormGroup;

    responsiblepeople: string[] = [];

    constructor(public dialog: MatDialog) {}

    ngOnInit() {}

    ngOnChanges() {}

    removePerson(person: string) {
        this.responsiblepeople.splice(this.responsiblepeople.indexOf(person), 1);
    }

    findPeople() {
        const dialogRef = this.dialog.open(UserSearchDialogComponent, {
            width: "600px",
            data: null,
        });

        dialogRef.afterClosed().subscribe((result: iFullUser) => {
            if (result) {
                this.responsiblepeople.push(result.username);
            }
        });
    }
}
