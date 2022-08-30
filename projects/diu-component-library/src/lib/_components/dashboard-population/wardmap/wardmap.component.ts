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
} from "@angular/core";
import * as d3 from "d3";
import * as d3zoom from "d3-zoom";
import { APIService } from "../../../_services/api.service";
import { iWardDetails } from "../lookups";

@Component({
    selector: "app-wardmap",
    templateUrl: "./wardmap.component.html",
    styleUrls: ["./wardmap.component.scss"],
    encapsulation: ViewEncapsulation.None,
})
export class WardmapComponent implements OnInit, OnChanges {
    @ViewChild("mapGraph", { static: false }) mapGraph: ElementRef;
    @Input() crossfilterData: any;
    @Input() inputTrigger: boolean;
    @Input() wardDetails: iWardDetails[];
    @Output() selectedWard = new EventEmitter<string>();
    emitted = false;
    mapDomain: any;
    check: any;
    zoom: any;
    svg: any;
    g: any;
    active: any;
    width = 960;
    height = 500;
    wards: any;
    selectedwrdcode: string = null;
    zoomedOut = true;
    path: any;
    rolodex_stopped = true;
    wardlist = [];
    filteredWardList: any;
    boundaryShown = true;
    ICSboundaries: any;
    projection: any;
    organisations: { icp: string; color: string }[] = [
        { icp: "Fylde Coast", color: "#ff8200" },
        { icp: "West Lancashire", color: "#5c315f" },
        { icp: "Central Lancashire", color: "#eb1b75" },
        { icp: "Pennine Lancashire", color: "#00577d" },
        { icp: "Bay Health & Care Partners", color: "#69c14a" },
    ];
    svgtooltip: any;
    allwardDetails: iWardDetails[] = [];
    trigger: boolean;
    loading = true;

    url = `https://api.nhs-bi-platform.co.uk/`;
    @HostListener("window:resize", ["$event"])
    onResize() {
        setTimeout(() => {
            this.width = document.getElementById("wardMapMain").getBoundingClientRect().width;
            this.drawGraph();
        }, 0);
    }
    constructor(private apiService: APIService, @Inject("environment") environment) {
        if (environment) this.url = `https://api.${environment.websiteURL as string}/` || `https://api.nhs-bi-platform.co.uk/`;
    }

    ngOnInit() {
        this.check = this.crossfilterData;
        this.width = document.getElementById("wardMapMain").getBoundingClientRect().width;
        this.allwardDetails = this.wardDetails;
        this.apiService.genericGetAPICall(this.url + "wards").subscribe((res: any[]) => {
            if (res.length > 0) {
                this.wards = res[0];
                this.wardlist = this.wards.features.map((key) => key.properties.wd15cd);
                if (this.filteredWardList === undefined) {
                    this.filteredWardList = this.filterList();
                }
                this.drawGraph();
                this.trigger = true;
                this.loading = false;
            }
        });
        this.apiService.genericGetAPICall(this.url + "orgboundaries/topo-json").subscribe((res: any[]) => {
            if (res.length > 0) {
                this.ICSboundaries = res[0];
                if (this.g) this.addBoundaries();
            }
        });
    }

    ngOnChanges() {
        if (this.trigger !== undefined && this.trigger !== this.inputTrigger) {
            this.reset();
            this.trigger = this.inputTrigger;
        } else if (this.emitted) {
            this.emitted = false;
        } else if (this.wards && this.check !== this.crossfilterData) {
            this.check = this.crossfilterData;
            if (this.crossfilterData) {
                this.drawGraph();
                this.loading = false;
            }
        }
    }

    drawGraph() {
        this.active = d3.select(null);
        const geoms = JSON.parse(JSON.stringify(this.wards));
        const wardstokeep = this.crossfilterData["WDimension"].values.filter((x) => x.value > 10).map((key) => key.key);
        const wardstokeepVals = this.crossfilterData["WDimension"].values.filter((x) => x.value > 10).map((key) => key.value);
        this.mapDomain = d3.scaleBand().range([0, 1]).domain(wardstokeepVals);
        geoms.features = geoms.features.filter((x) => wardstokeep.includes(x.properties.wd15cd));
        this.projection = d3.geoMercator().fitExtent(
            [
                [20, 20],
                [this.width, this.height],
            ],
            geoms
        );
        this.zoom = d3zoom.zoom().on("zoom", () => {
            this.zoomed();
        });
        this.path = d3.geoPath().projection(this.projection);
        if (!d3.select("#mapGraph").empty()) {
            d3.select("#mapGraph").select("svg").remove();
        }
        this.svg = d3
            .select("#mapGraph")
            .append("svg")
            .attr("width", this.width)
            .attr("height", this.height)
            .attr("class", "electoralmap-svg")
            .on("click", this.stopped, true);
        this.svg
            .append("rect")
            .attr("width", this.width)
            .attr("height", this.height)
            .on("click", () => this.reset());
        this.g = this.svg.append("g");
        if (this.ICSboundaries) {
            this.addBoundaries();
        }
        let text = "none";
        if (this.boundaryShown) {
            text = "block";
        }
        d3.selectAll("path").filter(".boundary").style("display", text);
        this.g
            .selectAll("path .feature")
            .data(geoms.features)
            .enter()
            .append("path")
            .attr("d", this.path)
            .attr("class", "feature")
            .attr("data-name", (d) => {
                return d.properties.wd15cd;
            })
            .attr("fill", (d) => {
                const value = this.crossfilterData["WDimension"].values.filter((x) => x.key === d.properties.wd15cd)[0].value;
                return this.calculateFill(d.properties.wd15cd, value);
            })
            .style("stroke", (d) => {
                return "rgb(0,0,0,0.5)";
            })
            .on("click", (_self) => this.clicked(_self));
        this.svg.call(this.zoom);
        if (this.svgtooltip) {
            d3.select(".svgtooltip").remove();
        }
        this.svgtooltip = d3
            .select("mat-sidenav-content")
            .append("div")
            .attr("class", "svgtooltip")
            .style("opacity", 0)
            .on("click", () => this.closesvgtooltip());
    }

    calculateFill(wrdcode, value) {
        const warddets = this.allwardDetails.filter((x) => x.code === wrdcode);
        if (warddets.length > 0) {
            const rgb = this.hexToRgb(this.calculateStroke(warddets[0].icp));
            return (
                "rgba(" +
                rgb.r.toString() +
                "," +
                rgb.g.toString() +
                "," +
                rgb.b.toString() +
                ", " +
                (1 - this.mapDomain(value)).toString() +
                ")"
            );
        }
        if (this.filteredWardList.includes(wrdcode)) {
            return "rgb(255,255,255,0.6)";
        }
        return "rgb(255,255,255,0)";
    }

    clicked(d) {
        const wrdcode = d3.select(d)["_groups"][0][0].properties.wd15cd;
        const selected = d3
            .selectAll("path")
            .filter(".feature")
            .filter((x: any) => {
                return x.properties.wd15cd === wrdcode;
            });
        if (this.active) {
            this.active.attr("fill", (d) => {
                const value = this.crossfilterData["WDimension"].values.filter((x) => x.key === wrdcode)[0].value;
                return this.calculateFill(wrdcode, value);
            });
            if (wrdcode === this.selectedwrdcode) {
                return this.reset();
            }
        }
        this.active = selected;
        this.selectedwrdcode = wrdcode;
        this.active.attr("fill", "tomato");
        const bounds = this.path.bounds(d);
        const dx = bounds[1][0] - bounds[0][0];
        const dy = bounds[1][1] - bounds[0][1];
        const x = ((bounds[0][0] as number) + (bounds[1][0] as number)) / 2;
        const y = ((bounds[0][1] as number) + (bounds[1][1] as number)) / 2;
        const scale = Math.max(1, Math.min(8, 0.85 / Math.max(dx / this.width, dy / this.height)));
        const translate = [this.width / 2 - scale * x, this.height / 2 - scale * y];

        this.svg.transition().duration(750).call(this.zoom.transform, d3.zoomIdentity.translate(translate[0], translate[1]).scale(scale));
        this.emitted = true;
        this.selectedWard.emit(wrdcode);
    }

    reset() {
        if (this.active) {
            this.active.attr("fill", (d) => {
                const value = this.crossfilterData["WDimension"].values.filter((x) => x.key === this.selectedwrdcode)[0].value;
                return this.calculateFill(this.selectedwrdcode, value);
            });
            this.active = null;
            this.selectedwrdcode = null;
            this.emitted = true;
            this.selectedWard.emit(null);
        }
        this.svg.transition().duration(750).call(this.zoom.transform, d3.zoomIdentity);
    }

    zoomed() {
        this.g.attr("transform", d3.event.transform);
    }

    stopped() {
        if (d3.event.defaultPrevented) {
            d3.event.stopPropagation();
        }
    }

    rolodex() {
        this.rolodex_stopped = !this.rolodex_stopped;
        if (this.filteredWardList === undefined) {
            this.filteredWardList = this.filterList();
        }
        if (!this.rolodex_stopped) {
            this.playrandom();
        }
    }

    filterList() {
        if (this.crossfilterData) {
            return this.crossfilterData["WDimension"].values.filter((x) => x.value > 10).map((key) => key.key);
        }
        return this.wardlist;
    }

    playrandom() {
        if (this.rolodex_stopped) {
            return;
        }
        let wrdcode = null;
        wrdcode = this.filteredWardList[Math.floor(Math.random() * this.filteredWardList.length - 1)];
        while (wrdcode === this.selectedwrdcode) {
            wrdcode = this.filteredWardList[Math.floor(Math.random() * this.filteredWardList.length - 1)];
        }
        const newselected = d3
            .selectAll("path")
            .filter(".feature")
            .filter((x: any) => {
                return x.properties.wd15cd === wrdcode;
            });
        newselected.dispatch("click");
        setTimeout(() => {
            this.playrandom();
        }, 60 * 1000);
    }

    addBoundaries() {
        const boundaries = d3.selectAll("path").filter(".boundary");
        if (boundaries["_groups"][0].length > 0) {
            boundaries.style("display", "block");
            return;
        }
        const geoms = this.ICSboundaries;
        const all = this.g.selectAll("path.boundary").data(geoms.features);

        all.enter()
            .append("path")
            .attr("d", this.path)
            .attr("class", "boundary")
            .attr("data-name", (d) => {
                return d.properties.ICP;
            })
            .attr("title", (d) => {
                return d.properties.ICP;
            })
            .attr("fill", (d) => {
                const rgb = this.hexToRgb(this.calculateStroke(d.properties.ICP));
                return "rgba(" + rgb.r.toString() + "," + rgb.g.toString() + "," + rgb.b.toString() + ",0.2)";
            })
            .style("stroke", (d) => {
                return this.calculateStroke(d.properties.ICP);
            });
    }

    boundaries() {
        this.boundaryShown = !this.boundaryShown;
        if (this.boundaryShown) {
            if (this.ICSboundaries) {
                d3.selectAll("path").filter(".boundary").style("display", "block");
            }
        } else {
            d3.selectAll("path").filter(".boundary").style("display", "none");
        }
    }

    calculateStroke(name) {
        const organisation = this.organisations.filter((org) => org.icp === name);
        if (organisation.length > 0) {
            return organisation[0].color;
        }
        return "#000";
    }

    hexToRgb(hex) {
        const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        hex = hex.replace(shorthandRegex, (m, r: string, g: string, b: string) => {
            return r + r + g + g + b + b;
        });

        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        const r = parseInt(result[1], 16);
        const g = parseInt(result[2], 16);
        const b = parseInt(result[3], 16);
        return result ? { r, g, b } : null;
    }

    closesvgtooltip() {
        this.svgtooltip.transition().duration(200).style("opacity", 0).style("z-index", -1);
    }
}
