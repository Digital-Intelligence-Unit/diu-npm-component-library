import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Inject, Input, OnInit, Output, ViewEncapsulation } from "@angular/core";
import { UntypedFormControl, UntypedFormGroup } from "@angular/forms";
import { iFieldConfig } from "../../../_models/field.interface";
import { ImageUploaderOptions } from "ngx-image-uploader-next";
import { ImageGalleryDialogComponent } from "../../image-gallery/image-gallery.component";
import { MatDialog } from "@angular/material/dialog";
import { iImages } from "../../../_models/images.interface";

/**
 * File Upload Component Class
 */
@Component({
    selector: "file-upload",
    templateUrl: "./file-upload.component.html",
    styleUrls: ["./file-upload.scss"],
    encapsulation: ViewEncapsulation.None,
})
export class FileUploadComponent implements OnInit, AfterViewInit {
    /**
     * Input of selected Image
     */
    @Input() selectedImage: iImages;
    /**
     * Initialise FieldConfig
     */
    field: iFieldConfig;

    /**
     * Initialise FormGroup
     */
    group: UntypedFormGroup = new UntypedFormGroup({});

    /**
     * Form Input Name
     */
    formName = "default";

    /**
     * Settings for the Image Uploader Library
     */
    options: ImageUploaderOptions = {
        thumbnailHeight: 150,
        thumbnailWidth: 150,
        uploadUrl: "https://images.nhs-bi-platform.co.uk/imageuploader/upload",
        allowedImageTypes: ["image/png", "image/jpeg"],
        maxImageSize: 3,
    };

    /**
     * Constructor Function
     */
    constructor(public dialog: MatDialog, private changeDetectorRef: ChangeDetectorRef, @Inject("environment") environment) {
        if (environment && environment.websiteURL)
            this.options.uploadUrl = `https://images.${environment.websiteURL as string}/imageuploader/upload`;
        this.group.setControl(this.formName, new UntypedFormControl(null, null));
    }

    /**
     * File Upload Component Initialiser
     */
    ngOnInit() {
        if (this.group && this.field) {
            this.formName = this.field.name;
            this.group.setControl(this.formName, new UntypedFormControl(null, null));
            this.group.controls[this.formName].valueChanges.subscribe((data) => {
                this.selectedImage = JSON.parse(data);
            });
        }
    }

    /**
     * File Upload Component function called after Component has been created
     */
    ngAfterViewInit() {
        this.changeDetectorRef.detectChanges();
    }

    /**
     * Function to update the selected image
     */
    updateSelectedImage(data: iImages) {
        this.selectedImage = data;
        const updateData = {};
        updateData[this.field.name] = JSON.stringify(this.selectedImage);
        this.group.patchValue(updateData);
    }

    /**
     * Function to open the image gallery and update the selected image on close of the modal
     */
    openDialog() {
        const dialogRef = this.dialog.open(ImageGalleryDialogComponent);
        dialogRef.afterClosed().subscribe((result: iImages) => {
            this.updateSelectedImage(result);
        });
    }
}
