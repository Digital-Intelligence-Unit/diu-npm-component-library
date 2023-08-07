import {
    Component,
    OnInit,
    Input,
    OnChanges,
    ElementRef,
    ViewChild,
    Output,
    EventEmitter,
    Inject,
    ViewEncapsulation,
    HostListener,
    SimpleChanges,
    AfterViewInit,
} from "@angular/core";
import * as d3 from "d3";
import * as d3zoom from "d3-zoom";
import { WardChart } from "../shared/ward.chart";
import { hexToRgb, calculateAreaFill, calculateStroke, ICSBoundaries, d3Tooltip } from "../shared/helper";
import { APIService } from "../../../_services/api.service";

@Component({
    selector: "app-wardmap",
    templateUrl: "./ward-map.component.html",
    encapsulation: ViewEncapsulation.None,
})
export class WardMapComponent implements AfterViewInit, OnChanges {

    @Input() data: any;
    @ViewChild("mapElement", { static: true }) mapElement: ElementRef;

    icsBoundaries: ICSBoundaries
    icsBoundaryShown; // ?
    selectionBreadcrumbs;

    selectedWardcode;

    map: {
        active?: any,
        domain?: any,
        projection?: any,
        zoom?: any,
        path?: any,
        svg?: any,
        g?: any
    } = {};

    constructor(
        private apiService: APIService
    ) {}

    ngAfterViewInit() {
        this.apiService.getWardDistricts().subscribe((res: any[]) => {
            if (res.length > 0) {
                // Draw intial map
                this.icsBoundaries = new ICSBoundaries(res[0]);
                new WardChart().create(this.mapElement, this.icsBoundaries);


                // this.ICSboundaries = res[0];
                // this.drawGraph();
                // this.trigger = true;
                // this.loading = false;
            }
        });
    }

    ngOnChanges(changes: SimpleChanges): void {

    }
}