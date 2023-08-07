import * as d3 from "d3";
import * as d3zoom from "d3-zoom";
import { ICSBoundaries, calculateAreaFill, calculateStroke, hexToRgb, d3Tooltip } from "./helper";

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
}

export class WardChart {

    active;
    domain;
    projection;
    zoom;
    path;

    icsBoundaries: ICSBoundaries;
    icsSelectedBreadcrumbs = [];

    map: D3Element;
    mapLayers = [];
    mapElement;
    activeMapLayer;

    constructor() {}

    create(htmlElement, boundaries) {
        // Store useful vars
        this.mapElement = htmlElement.nativeElement;
        this.icsBoundaries = boundaries;
        this.active = d3.select(null);

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
        this.path = d3.geoPath().projection(this.projection);
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
        const boundaries = d3.selectAll("path").filter("." + selector);
        if (boundaries["_groups"][0].length > 0) {
            boundaries.remove();
            // return;
        }

        // Add data
        const all = this.map.getChild("g").instance
            .selectAll("path." + selector)
            .data(geoms);

        // Add path
        const path = new D3Element(all.enter().append("path"));

        // Add place labels
        path.addChild("tooltip", d3Tooltip(
            d3.select(this.mapElement), path.instance,
            (d) => {
                return `<div class='tw-px-df'>${d.properties.area as string}</div>`
            }
        ));

        // Add boundaries
        path.instance
            .attr("d", this.path)
            .attr("class", selector)
            .attr("data-name", (d) => {
                return d.properties.district;
            })
            .attr("title", (d) => {
                return d.properties.district;
            })
            .attr("fill", (d) => {
                const rgb = hexToRgb(calculateStroke(d, this.icsSelectedBreadcrumbs.value));
                return "rgba(" + rgb.r.toString() + "," + rgb.g.toString() + "," + rgb.b.toString() + ",0.2)";
            })
            .style("stroke", (d) => {
                return calculateStroke(d, this.icsSelectedBreadcrumbs.value);
            })
            .on("click", (selectedDistrict) => {
                const code = selectedDistrict.properties.code;
                const children = this.icsBoundaries.getChildBoundaries(code);
                this.icsSelectedBreadcrumbs.reset(code);
                if (children.length) {
                    this.updateBoundaries(selectedDistrict.properties.code);
                    this._clickHandler(selectedDistrict);
                } else {
                    this._clickHandler(selectedDistrict);
                }
            });

        // Enable disable tooltips?
        if(this.activeMapLayer) {
            this.activeMapLayer.children["tooltip"].instance.disable();
        }
        this.activeMapLayer = path;

        //
        this.zoom = d3zoom.zoom().on("zoom", () => {
            this.zoomMap();
        });
    }

    selectedWardcode;
    _clickHandler(clickedArea) {
        const wrdcode = d3.select(clickedArea)["_groups"][0][0].properties.code;
        const selected = d3
            .selectAll("path")
            .filter(".feature")
            .filter((x: any) => {
                return x.properties.code === wrdcode;
            });

        if (this.active) {
            this.active.attr("fill", (clickedArea) => {
                return calculateAreaFill(clickedArea, this.icsSelectedBreadcrumbs.value);
            });
            if (wrdcode === this.selectedWardcode) {
                return this.resetMap();
            }
        }

        this.active = selected;
        this.selectedWardcode = wrdcode;
        this.active.attr("fill", calculateStroke(clickedArea, this.icsSelectedBreadcrumbs.value));

        const bounds = this.path.bounds(clickedArea);
        const dx = bounds[1][0] - bounds[0][0];
        const dy = bounds[1][1] - bounds[0][1];
        const x = ((bounds[0][0] as number) + (bounds[1][0] as number)) / 2;
        const y = ((bounds[0][1] as number) + (bounds[1][1] as number)) / 2;
        const scale = Math.max(
            1,
            Math.min(8, 0.85 / Math.max(
                dx / this.mapElement.nativeElement.offsetWidth, dy / this.mapElement.nativeElement.offsetHeight
            ))
        );

        this.map.instance.transition().duration(750).call(
            this.zoom.transform,
            d3.zoomIdentity.translate(
                this.mapElement.nativeElement.offsetWidth / 2 - scale * x,
                this.mapElement.nativeElement.offsetHeight / 2 - scale * y
            ).scale(scale)
        );

        // this.emitted = true;
        const children = this.icsBoundaries.getChildBoundaries(clickedArea.properties.code)
        // if (children.length) {
        //     this.selectedArea.emit(wrdcode);
        // } else {
        //     this.selectedWard.emit(wrdcode);
        // }
    }

    resetMap() {
        // Reset variables
        if (this.active) {
            this.active = null;
            this.selectedWardcode = null;
            // this.emitted = true;
            // this.selectedWard.emit(null);
        }

        this.icsSelectedBreadcrumbs = [];
        const boundaries = d3.selectAll("path").filter(".feature");
        if (boundaries["_groups"][0].length > 0) {
            boundaries.remove();
            // return;
        }

        this.map.instance.transition().duration(750).call(this.map.instance.transform, d3.zoomIdentity);
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