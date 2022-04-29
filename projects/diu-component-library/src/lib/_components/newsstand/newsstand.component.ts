import { Component, Input } from "@angular/core";
import { iNewsStand } from "../../_models/newsitem.interface";

@Component({
    selector: "app-news-stand",
    templateUrl: "./newsstand.component.html",
    styleUrls: ["./newsstand.component.scss"],
})
export class NewsStandComponent {
    @Input() config: any;
    @Input() selectedCCG: string;
    selected: string;
    @Input() thisNewsStand: iNewsStand;

    constructor() {}

    updateBG(color: string) {
        return "bg-" + color;
    }
}
