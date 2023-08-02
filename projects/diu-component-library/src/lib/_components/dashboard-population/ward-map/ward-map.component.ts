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
import { hexToRgb, calculateAreaFill, calculateStroke } from "../helper";
import { APIService } from "../../../_services/api.service";

@Component({
    selector: "app-wardmap",
    templateUrl: "./ward-map.component.html",
    encapsulation: ViewEncapsulation.None,
})
export class WardMapComponent implements AfterViewInit, OnChanges {

    @Input() data: any;
    @ViewChild("mapElement", { static: true }) mapElement: ElementRef;

    icsBoundaries;
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
                this.icsBoundaries = res[0];
                this.drawMap();


                // this.ICSboundaries = res[0];
                // this.drawGraph();
                // this.trigger = true;
                // this.loading = false;
            }
        });
    }

    ngOnChanges(changes: SimpleChanges): void {

    }

    drawMap() {
        console.log(this.mapElement.nativeElement);
        // Setup active area
        this.map.active = d3.select(null);
        // if (!this.ICSboundaries) {
        //     setTimeout(this.drawGraph, 100);
        //     return;
        // }

        this.map.domain = d3.scaleBand().range([0, 1]).domain(
            this.data["WDimension"].values.filter((x) => x.value > 10).map((key) => key.value)
        );

        console.log(this.icsBoundaries);
        this.map.projection = d3.geoMercator().fitExtent(
            [
                [20, 20],
                [
                    this.mapElement.nativeElement.width,
                    this.mapElement.nativeElement.height
                ],
            ],
            this.icsBoundaries
        );

        this.map.zoom = d3zoom.zoom().on("zoom", () => {
            this._mapZoomed();
        });

        this.map.path = d3.geoPath().projection(this.map.projection);
        if (!d3.select(this.mapElement.nativeElement).empty()) {
            d3.select(this.mapElement.nativeElement).select("svg").remove();
        }

        this.map.svg = d3.select(this.mapElement.nativeElement)
            .append("svg")
            .attr("width", this.mapElement.nativeElement.width)
            .attr("height", this.mapElement.nativeElement.height)
            .style("fill", "white")
            .on("click", () => {
                if (d3.event.defaultPrevented) {
                    d3.event.stopPropagation();
                }
            }, true);

        this.map.svg
            .append("rect")
            .attr("width", this.mapElement.nativeElement.width)
            .attr("height", this.mapElement.nativeElement.height)
            .on("click", () => this._mapReset());

        this.map.g = this.map.svg.append("g");

        this._mapAddBoundaries(null);
        d3.selectAll("path").filter(".boundary").style("display", this.icsBoundaryShown ? "block" : "none");
        this.map.svg.call(this.map.zoom);
    }

    _mapZoomed() {
        this.map.g.attr("transform", d3.event.transform);
    }

    _mapReset() {
        // Reset variables
        if (this.map.active) {
            this.map.active = null;
            this.selectedWardcode = null;
            // this.emitted = true;
            // this.selectedWard.emit(null);
        }

        this.selectionBreadcrumbs = [];
        const boundaries = d3.selectAll("path").filter(".feature");
        if (boundaries["_groups"][0].length > 0) {
            boundaries.remove();
            // return;
        }

        this.map.svg.transition().duration(750).call(this.map.zoom.transform, d3.zoomIdentity);
    }

    _mapAddBoundaries(parent) {
        const geoms = this._getChildBoundaries(parent);
        const selector: string = parent ? "feature" : "topLevel";
        const boundaries = d3.selectAll("path").filter("." + selector);
        if (boundaries["_groups"][0].length > 0) {
            boundaries.remove();
            // return;
        }

        const all = this.map.g.selectAll("path." + selector).data(geoms);
        all.enter()
            .append("path")
            .attr("d", this.map.path)
            .attr("class", selector)
            .attr("data-name", (d) => {
                return d.properties.district;
            })
            .attr("title", (d) => {
                return d.properties.district;
            })
            .attr("fill", (d) => {
                const rgb = hexToRgb(calculateStroke(d, this.selectionBreadcrumbs));
                return "rgba(" + rgb.r.toString() + "," + rgb.g.toString() + "," + rgb.b.toString() + ",0.2)";
            })
            .style("stroke", (d) => {
                return calculateStroke(d, this.selectionBreadcrumbs);
            })
            .on("click", (selectedDistrict) => () => {
                const code = selectedDistrict.properties.code;
                const children = this._getChildBoundaries(code);
                this.breadcrumbsReset(code);
                if (children.length) {
                    this._mapAddBoundaries(selectedDistrict.properties.code);
                    this._mapClicked(selectedDistrict);
                } else {
                    this._mapClicked(selectedDistrict);
                }
            });

        //
        this.map.zoom = d3zoom.zoom().on("zoom", () => {
            this._mapZoomed();
        });
    }

    _mapClicked(clickedArea) {
        const wrdcode = d3.select(clickedArea)["_groups"][0][0].properties.code;
        const selected = d3
            .selectAll("path")
            .filter(".feature")
            .filter((x: any) => {
                return x.properties.code === wrdcode;
            });

        if (this.map.active) {
            this.map.active.attr("fill", (clickedArea) => {
                return calculateAreaFill(clickedArea, this.selectionBreadcrumbs);
            });
            if (wrdcode === this.selectedWardcode) {
                return this._mapReset();
            }
        }

        this.map.active = selected;
        this.selectedWardcode = wrdcode;
        this.map.active.attr("fill", calculateStroke(clickedArea, this.selectionBreadcrumbs));

        const bounds = this.map.path.bounds(clickedArea);
        const dx = bounds[1][0] - bounds[0][0];
        const dy = bounds[1][1] - bounds[0][1];
        const x = ((bounds[0][0] as number) + (bounds[1][0] as number)) / 2;
        const y = ((bounds[0][1] as number) + (bounds[1][1] as number)) / 2;
        const scale = Math.max(
            1,
            Math.min(8, 0.85 / Math.max(
                dx / this.mapElement.nativeElement.width, dy / this.mapElement.nativeElement.height
            ))
        );
        const translate = [this.mapElement.nativeElement.width / 2 - scale * x, this.mapElement.nativeElement.height / 2 - scale * y];

        this.map.svg.transition().duration(750).call(
            this.map.zoom.transform,
            d3.zoomIdentity.translate(translate[0], translate[1]).scale(scale)
        );

        // this.emitted = true;
        const children = this._getChildBoundaries(clickedArea.properties.code);
        // if (children.length) {
        //     this.selectedArea.emit(wrdcode);
        // } else {
        //     this.selectedWard.emit(wrdcode);
        // }
    }

    breadcrumbsReset(code) {
        this.selectionBreadcrumbs = [];
        this._getParentBoundaries(code);
        this.selectionBreadcrumbs.reverse();
    }

    _getParentBoundaries(currentAreaCode) {
        const current = this.icsBoundaries.features.filter((feature) => {
            return feature.properties.code === currentAreaCode;
        });

        if (current.length) {
            this.selectionBreadcrumbs.push(current[0]);
            const parentAreaCode = current[0].properties.parent_code;
            this._getParentBoundaries(parentAreaCode);
        }

        return;
    }

    _getChildBoundaries(parent) {
        return this.icsBoundaries.features.filter((feature) => {
            return feature.properties.parent_code === parent;
        });
    }
}