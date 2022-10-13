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
import { speedDialFabAnimations } from "../../diu-angular-speed-dial/animations";
import { iWardDetails, iPointOfInterest } from "../lookups";

@Component({
    selector: "app-wardmap",
    templateUrl: "./wardmap.component.html",
    styleUrls: ["./wardmap.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: speedDialFabAnimations,
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
    svgtooltip: any;
    allwardDetails: iWardDetails[] = [];
    trigger: boolean;
    loading = true;

    fabButtons = [
        {
            icon: "refresh",
            tooltip: "Clear Extras",
            datatype: "refresh",
        },
        {
            icon: "location_city",
            tooltip: "Toggle Cities & Towns",
            datatype: "place",
        },
        {
            icon: "local_hospital",
            tooltip: "Toggle Hospitals",
            datatype: "hospital",
        },
        {
            icon: "local_pharmacy",
            tooltip: "Toggle Pharmacies",
            datatype: "local_pharmacy",
        },
        {
            icon: "more_time",
            tooltip: "Toggle Out Of Hours Practice",
            datatype: "OOH_Practice",
        },
        {
            icon: "transfer_within_a_station",
            tooltip: "Toggle Walk in Centre",
            datatype: "WIC_Practice",
        },
        {
            icon: "healing",
            tooltip: "Toggle Urgent Emergency Care",
            datatype: "Urgent_Emergency_Care",
        },
    ];
    buttons = [];
    fabTogglerState = "inactive";
    pointsofinterest: iPointOfInterest[];
    POITypes = [];
    gpPractices: any = {};
    gpPracticeTypes = {
        0: "Other",
        1: "WIC_Practice",
        2: "OOH_Practice",
        3: "WIC_OOH_Practice",
        4: "GP_Practice",
        8: "Public_Health_Service",
        9: "Community_Health_Service",
        10: "Hospital_Service",
        11: "Optometry_Service",
        12: "Urgent_Emergency_Care",
        13: "Hospice",
        14: "Care_Home_Nursing_Home",
        15: "Border_Force",
        16: "Young_Offender_Institution",
        17: "Secure_Training_Centre",
        18: "Secure_Childrens_Home",
        19: "Immigration_Removal_Centre",
        20: "Court",
        21: "Police_Custody",
        22: "Sexual_Assault_Referral_Centre_(SARC)",
        24: "Other_Justice_Estate",
        25: "Prison",
    };
    breadcrumbs: any[];

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
        this.apiService.getWardDistricts().subscribe((res: any[]) => {
            if (res.length > 0) {
                this.ICSboundaries = res[0];
                this.drawGraph();
                this.trigger = true;
                this.loading = false;
            }
        });
        this.apiService.getGPPracticesPopMini().subscribe((data: any[]) => {
            this.gpPractices = data;
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
                // this.drawGraph();
                this.loading = false;
            }
        }
    }

    drawGraph() {
        this.active = d3.select(null);
        const geoms = JSON.parse(JSON.stringify(this.ICSboundaries));
        const wardstokeep = this.crossfilterData["WDimension"].values.filter((x) => x.value > 10).map((key) => key.key);
        const wardstokeepVals = this.crossfilterData["WDimension"].values.filter((x) => x.value > 10).map((key) => key.value);
        this.mapDomain = d3.scaleBand().range([0, 1]).domain(wardstokeepVals);
        geoms.features = geoms.features.filter((x) => wardstokeep.includes(x.properties.code));
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
            this.addBoundaries(null);
        }
        let text = "none";
        if (this.boundaryShown) {
            text = "block";
        }
        d3.selectAll("path").filter(".boundary").style("display", text);
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
        const wrdcode = d3.select(d)["_groups"][0][0].properties.code;
        const selected = d3
            .selectAll("path")
            .filter(".feature")
            .filter((x: any) => {
                return x.properties.code === wrdcode;
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
        this.breadcrumbs = [];
        const boundaries = d3.selectAll("path").filter(".feature");
        if (boundaries["_groups"][0].length > 0) {
            boundaries.remove();
            // return;
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

    addBoundaries(parent) {
        const geoms = this.getChildBoundaries(parent);
        const selector: string = parent ? "feature" : "topLevel";
        const boundaries = d3.selectAll("path").filter("." + selector);
        if (boundaries["_groups"][0].length > 0) {
            boundaries.remove();
            // return;
        }
        const all = this.g.selectAll("path." + selector).data(geoms);
        all.enter()
            .append("path")
            .attr("d", this.path)
            .attr("class", selector)
            .attr("data-name", (d) => {
                return d.properties.district;
            })
            .attr("title", (d) => {
                return d.properties.district;
            })
            .attr("fill", (d) => {
                const rgb = this.hexToRgb(this.calculateStroke(d.properties.district));
                return "rgba(" + rgb.r.toString() + "," + rgb.g.toString() + "," + rgb.b.toString() + ",0.2)";
            })
            .style("stroke", (d) => {
                return this.calculateStroke(d.properties.district);
            })
            .on("click", (_self) => this.boundaryClicked(_self));
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
    }

    getChildBoundaries(parent) {
        const children = this.ICSboundaries.features.filter((feature) => {
            return feature.properties.parent_code === parent;
        });
        return children;
    }

    getParentBoundaries(currentAreaCode) {
        const current = this.ICSboundaries.features.filter((feature) => {
            return feature.properties.code === currentAreaCode;
        });
        if (current.length) {
            this.breadcrumbs.push(current[0]);
            const parentAreaCode = current[0].properties.parent_code;
            this.getParentBoundaries(parentAreaCode);
        }
        return;
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

    boundaryClicked(clickedDistrict) {
        const code = clickedDistrict.properties.code;
        const children = this.getChildBoundaries(code);
        this.resetBreadCrumbs(code);
        if (children.length) {
            this.addBoundaries(clickedDistrict.properties.code);
            this.clicked(clickedDistrict);
        } else {
            this.clicked(clickedDistrict);
        }
    }

    resetBreadCrumbs(code) {
        this.breadcrumbs = [];
        this.getParentBoundaries(code);
        this.breadcrumbs.reverse();
    }

    breadcrumbClick(clickedDistrict) {
        this.reset();
        if (clickedDistrict) {
            this.resetBreadCrumbs(clickedDistrict.properties.code);
            this.addBoundaries(clickedDistrict.properties.code);
            this.clicked(clickedDistrict);
        }
    }

    calculateStroke(name) {
        // const organisation = this.districts.filter((org) => org.district === name);
        // if (organisation.length > 0) {
        //     return organisation[0].color;
        // }
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

    updatePOI(type: string) {
        if (this.pointsofinterest === undefined) {
            this.apiService.getPointsOfInterest().subscribe((res: iPointOfInterest[]) => {
                this.pointsofinterest = res;
                this.addGPPracticesToPointsOfInterest();
                this.updatePOI(type);
            });
            return;
        }
        let removeflag = false;
        if (this.POITypes.includes(type)) {
            removeflag = true;
            this.POITypes.splice(this.POITypes.indexOf(type), 1);
        } else {
            this.POITypes.push(type);
        }
        if (removeflag) {
            switch (type) {
                case "place":
                    this.g
                        .selectAll("text")
                        .filter((x: any) => {
                            return x.type === "place";
                        })
                        .remove();
                    break;
                default:
                    this.g
                        .selectAll("image." + type)
                        .filter((x: any) => {
                            return x.type === type;
                        })
                        .remove();
                    break;
            }
            return;
        }
        const data = this.pointsofinterest.filter((x) => x.type === type);
        let widthHeight = "15px";
        if (data.length > 0) {
            switch (type) {
                case "place":
                    this.g
                        .selectAll("text")
                        .data(data)
                        .enter()
                        .append("text")
                        .attr("x", (d) => {
                            return this.projection([d.longitude, d.latitude])[0];
                        })
                        .attr("y", (d) => {
                            return this.projection([d["longitude"], d["latitude"]])[1];
                        })
                        .attr("data-type", (d) => {
                            return d.type;
                        })
                        .attr("text-anchor", "middle")
                        .attr("dominant-baseline", "middle")
                        .attr("fill", () => {
                            return "rgb(173, 0, 156)";
                        })
                        .style("font-size", "12px")
                        .style("font-weight", "bold")
                        .text((d) => {
                            return d.name.toString().toUpperCase();
                        })
                        .exit();
                    break;
                default:
                    switch (type) {
                        case "local_pharmacy":
                            widthHeight = "10px";
                            break;
                    }
                    this.g
                        .selectAll("image." + type)
                        .data(data)
                        .enter()
                        .append("image")
                        .attr("class", (d) => {
                            return d.type;
                        })
                        .attr("x", (d) => {
                            return this.projection([d.longitude, d.latitude])[0] - 4;
                        })
                        .attr("y", (d) => {
                            return this.projection([d["longitude"], d["latitude"]])[1] - 4;
                        })
                        .attr("data-type", (d) => {
                            return d.type;
                        })
                        .attr("text-anchor", "middle")
                        .attr("dominant-baseline", "middle")
                        .attr("href", "../../../assets/images/" + type + ".png")
                        .attr("width", widthHeight)
                        .attr("height", widthHeight)
                        // .attr("filter", "url(#solid)")
                        .exit();
                    break;
            }
        }
    }

    displayPOItooltip(tooltip: iPointOfInterest) {
        let output = "<h4>" + tooltip.name + "</h4>";
        if (tooltip.postcode) {
            output += "<p>" + tooltip.postcode + "</p>";
        }
        if (tooltip.link) {
            output += "<a href='" + tooltip.link + "' target='_blank'>Click for more info</a>";
        }
        return output;
    }

    removeAllPOIs() {
        this.g.selectAll("circle").remove();
        this.removePlaces();
        this.POITypes = [];
    }

    removePlaces() {
        this.g.selectAll("text").remove();
        this.g.selectAll("image").remove();
    }

    clickEvents(button: string) {
        switch (button) {
            case "refresh":
                this.removeAllPOIs();
                break;
            default:
                this.updatePOI(button);
                break;
        }
        this.hideItems();
    }

    showItems() {
        this.fabTogglerState = "active";
        this.buttons = this.fabButtons;
    }

    hideItems() {
        this.fabTogglerState = "inactive";
        this.buttons = [];
    }

    onToggleFab() {
        this.buttons.length ? this.hideItems() : this.showItems();
    }

    addGPPracticesToPointsOfInterest() {
        if (this.gpPractices.length > 0) {
            this.gpPractices.forEach((gpPractice) => {
                const prescribedSetting = gpPractice.prescribing_setting;
                delete gpPractice.prescribing_setting;
                gpPractice.type = this.gpPracticeTypes[prescribedSetting];
                this.pointsofinterest.push(gpPractice);
            });
        }
    }
}
