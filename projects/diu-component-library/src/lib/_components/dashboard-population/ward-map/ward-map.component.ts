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
import { ICSBoundaries } from "../shared/helper";
import { APIService } from "../../../_services/api.service";

@Component({
    selector: "app-wardmap",
    templateUrl: "./ward-map.component.html",
    encapsulation: ViewEncapsulation.None,
})
export class WardMapComponent implements AfterViewInit {

    @Input() data: any;
    @Output() areaSelected = new EventEmitter();
    @ViewChild("mapElement", { static: true }) mapElement: ElementRef;

    icsBoundaries: ICSBoundaries
    wardChart: WardChart;

    constructor(
        private apiService: APIService
    ) {}

    ngAfterViewInit() {
        this.apiService.getWardDistricts().subscribe((res: any[]) => {
            // Draw intial map
            this.icsBoundaries = new ICSBoundaries(res);
            this.wardChart = new WardChart();
            this.wardChart.create(this.mapElement, this.icsBoundaries);

            // Listen for selection
            this.wardChart.selectedGeo.subscribe((value) => {
                this.areaSelected.emit(value);
            });
        });
    }
}