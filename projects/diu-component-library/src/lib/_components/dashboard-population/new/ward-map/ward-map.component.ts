import {
    Component,
    Input,
    ElementRef,
    ViewChild,
    Output,
    EventEmitter,
    ViewEncapsulation,
    AfterViewInit,
} from "@angular/core";
import { WardChart } from "../shared/ward.chart";
import { FAB_BUTTONS, ICSBoundaries } from "../shared/helper";
import { APIService } from "../../../../_services/api.service";
import { speedDialFabAnimations } from "../../speed-dial.animation";

@Component({
    selector: "app-wardmap",
    templateUrl: "./ward-map.component.html",
    encapsulation: ViewEncapsulation.None,
    animations: [speedDialFabAnimations]
})
export class WardMapComponent implements AfterViewInit {

    @Input() data: any;
    @Output() areaSelected = new EventEmitter();
    @ViewChild("mapElement", { static: true }) mapElement: ElementRef;

    wardChart: WardChart;
    icsBoundaries: ICSBoundaries;
    fabButtons = [];

    constructor(
        private apiService: APIService
    ) {}

    ngAfterViewInit() {
        this.apiService.getWardDistricts().subscribe((res: any[]) => {
            // Draw intial map
            this.icsBoundaries = new ICSBoundaries(res);
            this.wardChart = new WardChart(this.apiService);
            this.wardChart.create(this.mapElement, this.icsBoundaries);

            // Listen for selection
            this.wardChart.selectedGeo.subscribe((value) => {
                this.areaSelected.emit(value);
            });
        });
    }

    fabButtonsToggle() {
        this.fabButtons = this.fabButtons.length > 0 ? [] : FAB_BUTTONS;
    }

    fabButtonsClick(btn) {
        if(btn.datatype === "refresh") {
            this.wardChart.clearPoi();
        } else {
            this.wardChart.togglePoi(btn);
        }
    }
}