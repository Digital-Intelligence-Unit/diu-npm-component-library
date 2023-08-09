import * as d3 from "d3";
import * as d3zoom from "d3-zoom";
import { ICSBoundaries, calculateAreaFill, calculateStroke, hexToRgb, d3Tooltip } from "./helper";
import { Subject } from "rxjs";

export class D3Element {

    instance;
    children = {};

    constructor(instance) {
        this.instance = instance;
        return this;
    }

    addChild(name, instance): D3Element {
        this.children[name] = new D3Element(instance);
        return this.children[name];
    }

    getChild(name): D3Element {
        return this.children[name];
    }

    remove() {
        for(const child in this.children) {
            if(this.children[child].instance) {
                this.children[child].instance.remove();
            }
        }
        this.instance.remove();
    }
}

export class WardChart {

    domain;
    projection;
    zoom;
    path: D3Element;
    activePath;

    icsBoundaries: ICSBoundaries;
    icsSelectedBreadcrumbs = [];

    map: D3Element;
    mapLayers = [];
    mapElement;
    activeMapLayer;

    selectedGeo: Subject<{ id: string; value: any }> = new Subject();

    create(htmlElement, boundaries) {
        // Store useful vars
        this.mapElement = htmlElement.nativeElement;
        this.icsBoundaries = boundaries;
        this.activePath = d3.select(null);

        // Create scale range
        this.domain = d3.scaleBand().range([0, 1]).domain([]);

        // Create projection
        this.projection = d3.geoMercator().fitExtent(
            [
                [20, 20],
                [
                    this.mapElement.offsetWidth,
                    this.mapElement.offsetHeight
                ],
            ],
            this.icsBoundaries.get()
        );

        // Create zoom control
        this.zoom = d3zoom.zoom().on("zoom", () => {
            this.zoomMap();
        });

        // Add svg geo path
        this.path = new D3Element(d3.geoPath().projection(this.projection));
        if (!d3.select(this.mapElement).empty()) {
            d3.select(this.mapElement).select("svg").remove();
        }

        // Create svg ward map
        this.map = new D3Element(d3.select(this.mapElement).append("svg"));
        this.map.instance
            .attr("width", this.mapElement.offsetWidth)
            .attr("height", this.mapElement.offsetHeight)
            .style("fill", "white")
            .on("click", () => {
                if (d3.event.defaultPrevented) {
                    d3.event.stopPropagation();
                }
            }, true);

        // Add rectangle
        this.map.addChild("rect", this.map.instance.append("rect")).instance
            .attr("width", this.mapElement.offsetWidth)
            .attr("height", this.mapElement.offsetHeight)
            .on("click", () => this.resetMap()); // Reset on outside click

        // Add g?
        this.map.addChild("g", this.map.instance.append("g")).instance

        // Add areas
        this.updateBoundaries(null);

        // Zoom to bounds
        this.map.instance.call(this.zoom);
    }

    updateData(data) {
        this.domain = d3.scaleBand().range([0, 1]).domain(
            data["WDimension"].values.filter((x) => x.value > 10).map((key) => key.value)
        );
    }

    updateBoundaries(parent) {
        // Get boundary data
        const geoms = this.icsBoundaries.getChildBoundaries(parent);
        const selector: string = parent ? "feature" : "topLevel";

        // Clear existing
        const boundary = this.path.children[selector];
        if (boundary) { boundary.remove(); }

        // Add data
        const all = this.map.getChild("g").instance
            .selectAll("path." + selector)
            .data(geoms);

        // Add path
        const path = this.path.addChild(selector, all.enter().append("path"));

        // Add boundaries
        path.instance
            .attr("d", this.path.instance)
            .attr("class", selector)
            .attr("data-name", (d) => {
                return d.properties.district;
            })
            .attr("title", (d) => {
                return d.properties.district;
            })
            .attr("fill", (d) => {
                const rgb = hexToRgb(calculateStroke(d, this.icsSelectedBreadcrumbs));
                return "rgba(" + rgb.r.toString() + "," + rgb.g.toString() + "," + rgb.b.toString() + ",0.2)";
            })
            .style("stroke", (d) => {
                return calculateStroke(d, this.icsSelectedBreadcrumbs);
            })
            .on("click", (selectedDistrict) => {
                const code = selectedDistrict.properties.code;
                const children = this.icsBoundaries.getChildBoundaries(code);
                // this.icsSelectedBreadcrumbs.reset(code);
                if (children.length) {
                    this.updateBoundaries(selectedDistrict.properties.code);
                    this._clickHandler(selectedDistrict);
                } else {
                    this._clickHandler(selectedDistrict);
                }
            });

        // Add place labels
        path.addChild("tooltip", d3Tooltip(
            d3.select(this.mapElement), path.instance,
            (d) => {
                return `<div class='tw-px-df'>${d.properties.area as string}</div>`
            }
        ));

        // Disable top level labels?
        if(this.path.getChild("topLevel")) {
            if(selector === "feature") {
                this.path.getChild("topLevel").children["tooltip"].instance.disable();
            } else {
                this.path.getChild("topLevel").children["tooltip"].instance.enable();
            }
        }

        //
        this.zoom = d3zoom.zoom().on("zoom", () => {
            this.zoomMap();
        });
    }

    selectedGeoCode;
    _clickHandler(clickedArea) {
        // Get selected area code
        const selectedGeoCode = d3.select(clickedArea)["_groups"][0][0].properties.code;
        const selected = d3
            .selectAll("path")
            .filter(".feature")
            .filter((x: any) => {
                return x.properties.code === selectedGeoCode;
            });

        // Unfill currently selected?
        if (this.activePath) {
            // Reset to original fill
            this.activePath.attr("fill", (clickedArea) => {
                return calculateAreaFill(clickedArea, this.icsSelectedBreadcrumbs);
            });

            // If same area reset
            if (selectedGeoCode === this.selectedGeoCode) {
                return this.resetMap();
            }
        }

        // Fill selected area
        this.activePath = selected;
        this.selectedGeoCode = selectedGeoCode;
        this.activePath.attr("fill", calculateStroke(clickedArea, this.icsSelectedBreadcrumbs));

        // Zoom to selected area
        const bounds = this.path.instance.bounds(clickedArea);
        const dx = bounds[1][0] - bounds[0][0];
        const dy = bounds[1][1] - bounds[0][1];
        const x = ((bounds[0][0] as number) + (bounds[1][0] as number)) / 2;
        const y = ((bounds[0][1] as number) + (bounds[1][1] as number)) / 2;
        const scale = Math.max(
            1,
            Math.min(8, 0.85 / Math.max(
                dx / this.mapElement.offsetWidth, dy / this.mapElement.offsetHeight
            ))
        );
        this.map.instance.transition().duration(750).call(
            this.zoom.transform,
            d3.zoomIdentity.translate(
                this.mapElement.offsetWidth / 2 - scale * x,
                this.mapElement.offsetHeight / 2 - scale * y
            ).scale(scale)
        );

        // Emit selection
        const children = this.icsBoundaries.getChildBoundaries(clickedArea.properties.code);
        if (children.length) {
            this.selectedGeo.next({ id: "AreaLookup", value: selectedGeoCode});
        } else {
            this.selectedGeo.next({ id: "WDimension", value: selectedGeoCode});
        }
    }

    resetMap() {
        // Reset variables
        if (this.activePath) {
            this.activePath = null;
            this.selectedGeoCode = null;
            this.selectedGeo.next(null);
        }

        // Clear breadcrumbs
        this.icsSelectedBreadcrumbs = [];

        // Remove lower level features
        const boundary = this.path.children["feature"];
        if (boundary) { boundary.remove(); }

        // Enable top level tooltips
        this.path.getChild("topLevel").children["tooltip"].instance.enable();

        // Zoom back to bounds
        this.map.instance.transition().duration(750).call(this.zoom.transform, d3.zoomIdentity);
    }

    zoomMap() {
        this.map.getChild("g").instance.attr("transform", d3.event.transform);
    }

    resetBreadCrumbs(code) {
        this.icsSelectedBreadcrumbs = [];
        this.icsBoundaries.getParentBoundaries(code, this.icsSelectedBreadcrumbs);
        this.icsSelectedBreadcrumbs.reverse();
    }
}