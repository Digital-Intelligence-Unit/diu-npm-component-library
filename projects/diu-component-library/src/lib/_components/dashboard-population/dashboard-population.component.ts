import { Component, OnInit, HostListener, ViewChild, ElementRef, Inject } from "@angular/core";
import * as d3 from "d3";
import * as dc from "dc";
declare const window: any;
import jwt_decode from "jwt-decode";
import { DeprivationColorCodes, iWardDetails } from "./lookups";
import { collapseAnimations } from "../../_functions/helper_functions";
import { APIService } from "../../_services/api.service";

@Component({
    selector: "app-population",
    templateUrl: "./dashboard-population.component.html",
    animations: [collapseAnimations],
})
export class DashboardPopulationComponent implements OnInit {
    config: any;
    /* #region Global Variables */
    ndx: any;
    LDimension: any;
    LDimGroup: any;
    AgeDimensionM: any;
    AgeDimGroupM: any;
    AgeDimensionF: any;
    AgeDimGroupF: any;
    DDimension: any;
    DDimGroup: any;
    WDimension: any;
    WDimGroup: any;
    AreaLookupDimension: any;
    AreaLookupDimGroup: any;
    myDC: any;
    all: any;
    filteredData: any;
    lastQueryFilter: any;
    queryFilter: any = {};
    totalsize: number;
    token: any;
    phiAccess = false;
    tokenDecoded: any;
    selectedWard: string;
    selectedWardDetails: iWardDetails;
    allWardDetails: iWardDetails[] = [];
    openCloseWardAnim = "close";
    visible = false;
    width: any;
    @ViewChild("deprivationChartParent", { static: false }) deprivationChartParent: ElementRef;
    deprivationChart: any;
    compCharts = {};
    toolTip: any;
    mapReset = true;
    cfUrl = "https://popmini.nhs-bi-platform.co.uk/dataset/getCrossfilter";
    /* #endregion */

    @HostListener("window:resize", ["$event"])
    onResize() {
        setTimeout(() => {
            this.createCharts();
        }, 0);
    }

    constructor(private apiService: APIService, @Inject("environment") environment) {
        if (environment && environment.websiteURL) {
            this.cfUrl = `https://popmini.${environment.websiteURL as string}/dataset/getCrossfilter`;
            this.cfUrl = `http://localhost:8080/dataset/getCrossfilter`;
        }
        const token = localStorage.getItem("@@STATE");
        if (token) {
            const jsonToken = JSON.parse(token);
            this.token = jsonToken.stateauth.token;
            this.tokenDecoded = jwt_decode(this.token);
        }
    }

    ngOnInit() {
        this.apiService.getWardDetails().subscribe((res: iWardDetails[]) => {
            this.allWardDetails = res;
            this.buildCF();
            this.mouseLeave();
            setTimeout(() => {
                window.dispatchEvent(new Event("resize"));
            }, 500);
        });
    }

    onCollapse() {
        this.openCloseWardAnim = this.selectedWard === null ? "close" : "open";
        if (this.openCloseWardAnim === "open") {
            setTimeout(() => (this.visible = true), 600);
        } else {
            this.visible = false;
        }
    }

    /* #region  App Access Functions */
    getCcgName(code) {
        switch (code) {
            case "00M":
                return "Fylde & Wyre CCG";
                break;
            case "00R":
                return "Blackpool CCG";
                break;
            default:
                return "Out of area";
        }
    }
    /* #endregion */

    changedWard(filter) {
        this.AreaLookupDimension.filter(null);
        this.selectedWard = filter;
        if (!filter) {
            this.WDimension.filter(null);
            this.resetToWholePop();
            this.selectedWardDetails = null;
        } else {
            const warddets = this.allWardDetails.filter((x) => x.code === this.selectedWard);
            if (warddets.length > 0) {
                this.selectedWardDetails = warddets[0];
            } else {
                this.selectedWardDetails = {
                    code: this.selectedWard,
                    name: "Unknown",
                    text: "Unknown",
                    image: "innerurban.jpg",
                    icp: "Fylde Coast",
                };
            }
            this.WDimension.filter([filter]);
        }
        this.refresh(this.queryFilter);
        this.onCollapse();
    }

    changedArea(filter) {
        this.WDimension.filter(null);
        this.selectedWard = filter;
        if (!filter) {
            this.AreaLookupDimension.filter(null);
            this.resetToWholePop();
            this.selectedWardDetails = null;
        } else {
            this.AreaLookupDimension.filter([filter]);
        }
        this.refresh(this.queryFilter);
        this.onCollapse();
    }

    removeFilter(chart: string) {
        delete this.queryFilter[chart];
        this.refresh(this.queryFilter);
    }

    checkFilters() {
        const length = Object.keys(this.queryFilter).length;
        if ((length === 1 && this.queryFilter["AreaLookupDimension"]) || (length === 1 && this.queryFilter["WDimension"])) {
            return true;
        } else if (length > 0) {
            return false;
        }
        return true;
    }

    buildCF() {
        this.myDC = dc;
        this.apiService.genericGetAPICall(this.cfUrl).subscribe((res: any) => {
            if (res && res.all) {
                this.filteredData = res;
                this.totalsize = this.filteredData["all"].values;
                this.buildCFServer();
                this.toolTip = d3.select("mat-sidenav-content").append("div").attr("class", "tooltip").style("opacity", 0);
                setTimeout(() => {
                    this.createCharts();
                }, 300);
            } else {
                console.log("Unable to load mini crossfilter");
            }
        });
    }

    /* #region Cross Filter Server Functions */
    buildCFServer() {
        this.ndx = {
            size: () => {
                return this.totalsize;
            },
        };
        this.all = {
            value: (f) => {
                return this.filteredData["all"].values;
            },
        };
        this.WDimension = {
            filter: (f) => {
                if (f && f.length > 0) {
                    this.queryFilter["WDimension"] = f;
                } else {
                    delete this.queryFilter["WDimension"];
                }
            },
            filterAll: () => {},
        };
        this.WDimGroup = {
            all: () => {
                return this.filteredData["WDimension"].values;
            },
            order: () => {},
            top: () => {},
        };
        this.AgeDimensionM = {
            filter: (f) => {
                if (f && f.length > 0) {
                    const range = "0 - 5"; // GET FROM f INSTEAD
                    this.queryFilter["AgeDimension"] = range;
                } else {
                    delete this.queryFilter["AgeDimension"];
                }
            },
            filterAll: () => {},
        };
        this.AgeDimGroupM = {
            all: () => {
                return this.extractValues("M", this.filteredData["AgeDimension"].values);
            },
            order: () => {},
            top: () => {
                return this.filteredData["AgeDimension"].top;
            },
        };
        this.AgeDimensionF = {
            filter: (f) => {
                if (f && f.length > 0) {
                    const range = "0 - 5"; // GET FROM f INSTEAD
                    this.queryFilter["AgeDimension"] = range;
                } else {
                    delete this.queryFilter["AgeDimension"];
                }
            },
            filterAll: () => {},
        };
        this.AgeDimGroupF = {
            all: () => {
                return this.extractValues("F", this.filteredData["AgeDimension"].values);
            },
            order: () => {},
            top: () => {
                return this.filteredData["AgeDimension"].top;
            },
        };
        this.DDimension = {
            filter: (f) => {
                if (f && f.length > 0) {
                    this.queryFilter["DDimension"] = f;
                } else {
                    delete this.queryFilter["DDimension"];
                }
            },
            filterAll: () => {},
        };
        this.DDimGroup = {
            all: () => {
                return this.filteredData["DDimension"].values;
            },
            order: () => {},
            top: () => {},
        };
        this.DDimension = {
            filter: (f) => {
                if (f && f.length > 0) {
                    this.queryFilter["DDimension"] = f;
                } else {
                    delete this.queryFilter["DDimension"];
                }
            },
            filterAll: () => {},
        };
        this.DDimGroup = {
            all: () => {
                return this.filteredData["DDimension"].values;
            },
            order: () => {},
            top: () => {},
        };
        this.AreaLookupDimension = {
            filter: (f) => {
                if (f && f.length > 0) {
                    this.queryFilter["AreaLookup"] = f;
                } else {
                    delete this.queryFilter["AreaLookup"];
                }
            },
            filterAll: () => {},
        };
        this.AreaLookupDimGroup = {
            all: () => {
                return this.filteredData["AreaLookup"].values;
            },
            order: () => {},
            top: () => {},
        };
    }

    extractValues(type: string, data: any[]) {
        const response: { key: string; value: number }[] = [];
        const genderData = data.filter((x) => x["key"].includes(type));
        genderData.forEach((elem) => {
            const elemCat = this.getAgeCategory(parseInt(elem["key"].split(":")[1]));
            const item = response.filter((i) => i.key === elemCat);
            if (item.length > 0) {
                item[0].value = item[0].value + (elem["value"] as number);
            } else {
                response.push({ key: elemCat, value: elem["value"] });
            }
        });
        return response.sort((a, b) => {
            return parseInt(a.key.split(":")[0]) - parseInt(b.key.split(":")[0]);
        });
    }

    getAgeCategory(age: number) {
        if (age <= 5) {
            return "0 - 5";
        } else if (age <= 10) {
            return "6 - 10";
        } else if (age <= 15) {
            return "11 - 15";
        } else if (age <= 20) {
            return "16 - 20";
        } else if (age <= 25) {
            return "21 - 25";
        } else if (age <= 30) {
            return "26 - 30";
        } else if (age <= 35) {
            return "31 - 35";
        } else if (age <= 40) {
            return "36 - 40";
        } else if (age <= 45) {
            return "41 - 45";
        } else if (age <= 50) {
            return "46 - 50";
        } else if (age <= 55) {
            return "51 - 55";
        } else if (age <= 60) {
            return "56 - 60";
        } else if (age <= 65) {
            return "61 - 65";
        } else if (age <= 70) {
            return "66 - 70";
        } else if (age <= 75) {
            return "71 - 75";
        } else if (age <= 80) {
            return "76 - 80";
        } else if (age <= 85) {
            return "81 - 85";
        } else if (age <= 90) {
            return "86 - 90";
        } else if (age <= 95) {
            return "91 - 95";
        } else if (age <= 100) {
            return "96 - 100";
        }
        return "100 - 125";
    }

    refresh(queryFilter) {
        if (queryFilter !== this.lastQueryFilter) {
            this.lastQueryFilter = JSON.parse(JSON.stringify(queryFilter));
            this.queryFilter = queryFilter;
            d3.json(this.cfUrl + "?filter=" + JSON.stringify(queryFilter), {
                headers: new Headers({ Authorization: "JWT " + (this.token as string) }),
            }).then((d) => {
                if (this.filteredData !== d) {
                    this.filteredData = d;
                    this.createCharts();
                }
            });
        }
    }

    resetToWholePop() {
        this.queryFilter = {};
        d3.json(this.cfUrl, {
            headers: new Headers({ Authorization: "JWT " + (this.token as string) }),
        }).then((d) => {
            this.filteredData = d;
            this.createCharts();
        });
    }

    sortedArrayList(values: { key: string[]; value: number }[]) {
        const response: { key: string[]; value: number }[] = [];
        if (this.queryFilter["numberSelLtc"]) {
            values.forEach((keyvaluePair) => {
                const keyarray = keyvaluePair.key;
                keyarray.forEach((ltc) => {
                    const check = response.filter((x) => x.key.includes(ltc));
                    if (check.length > 0) {
                        if (keyvaluePair.value > check[0].value) {
                            check[0].value = keyvaluePair.value;
                        }
                    } else {
                        response.push({ key: [ltc], value: keyvaluePair.value });
                    }
                });
            });
        } else {
            values.forEach((keyvaluePair) => {
                const keyarray = keyvaluePair.key;
                if (keyarray.length === 1) {
                    response.push(keyvaluePair);
                }
            });
        }
        return response;
    }
    /* #endregion */

    createCharts() {
        setTimeout(() => {
            this.createDeprivationScale(this.DDimension, this.DDimGroup);
            const arrMaleAges = this.AgeDimGroupM.all();
            const endM = arrMaleAges.reduce((a, b) => {
                return Math.max(a, b.value);
            }, 0);
            const arrFemaleAges = this.AgeDimGroupF.all();
            const endF = arrFemaleAges.reduce((a, b) => {
                return Math.max(a, b.value);
            }, 0);
            this.drawAgeChart(false, this.AgeDimGroupF.all(), "ageChartFemale", endF);
            this.drawAgeChart(true, this.AgeDimGroupM.all(), "ageChartMale", endM);
        }, 300);
    }

    createDeprivationScale(dimension: any, group: any) {
        const chartName = "deprivationChart";
        const firstRun = d3
            .select("#" + chartName)
            .select("svg")
            .empty();
        const theData = group.all();
        const end = theData
            .map((key) => key.value)
            .reduce((acc: string, key: string) => {
                return key + acc;
            });
        let i = 0;
        theData.forEach((elem) => {
            elem.start = i;
            elem.end = i + (elem.value as number);
            i = elem.end;
        });
        this.deprivationChart = d3.select("#" + chartName);
        const margin = { top: 10, right: 40, bottom: 20, left: 10 };
        const width = this.deprivationChartParent.nativeElement.clientWidth - (margin.left + margin.right);
        const height = 30;
        if (firstRun) {
            // this.width = width;
            this.deprivationChart
                .append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .attr("transform", "translate(" + margin.left.toString() + "," + margin.top.toString() + ")");
        } else {
            this.deprivationChart
                .select("svg")
                .attr("width", width)
                .on("mouseout.something", () => this.mouseLeave());
            this.deprivationChart.selectAll(".bar").remove();
        }
        this.deprivationChart = this.deprivationChart.select("svg");

        const linearScale = d3.scaleLinear().domain([0, end]).range([0, width]);
        const xAxis = d3.axisBottom(linearScale);

        const barData = this.deprivationChart.selectAll(".bar").data(theData, (d) => {
            return d;
        });
        barData
            .enter()
            .append("rect")
            .attr("x", (d) => {
                return linearScale(d.start);
            })
            .style("fill", (d) => {
                return this.deprivationColourFromData(d);
            })
            .attr("class", (d) => {
                if (this.queryFilter["DDimension"]) {
                    if (d.key) {
                        if (this.queryFilter["DDimension"].includes(d.key.toString())) {
                            return "bar selected pointed";
                        } else {
                            return "bar notselected pointed";
                        }
                    }
                }
                return "bar pointed";
            })
            .attr("height", (d) => {
                return 30;
            })
            .attr("width", (d) => {
                return linearScale(d.end) - linearScale(d.start);
            });

        d3.selectAll(".bar")
            .style("cursor", "pointer")
            .on("mouseover.something", (d, index, array) => this.mouseEnter(d, index, array, chartName))
            .on("mouseout.something", () => this.mouseLeave());

        if (firstRun) {
            this.deprivationChart
                .append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + height.toString() + ")")
                .call(xAxis);
        } else {
            this.deprivationChart.select(".x").transition().duration(750).call(xAxis);
        }
    }

    deprivationColourFromData(d) {
        return d && d.key ? DeprivationColorCodes.find((x) => x.key === d.key.toString()).color : "#FFFFFF";
    }

    applyAxisScale(chart, scale, axis) {
        chart
            .selectAll(".bar")
            .attr("x", (d) => {
                return scale(d.start);
            })
            .attr("width", (d) => {
                return scale(d.end) - scale(d.start);
            });
        axis.scale(scale);
        chart.select(".x").call(axis);
    }

    drawAgeChart(male: boolean, data: any[], chartName: string, top: number) {
        const margin = {
            top: 15,
            right: 10,
            bottom: 15,
            left: 70,
        };
        const rect = document.getElementById(chartName + "Main").getBoundingClientRect();
        const width = rect.width - margin.left - margin.right;
        const height = data.length * 25;
        if (this.compCharts[chartName]) {
            d3.select("svg." + chartName).remove();
        }
        let shift = margin.left;
        if (male) {
            shift = width;
        }
        this.compCharts[chartName] = d3
            .select("#" + chartName)
            .append("svg")
            .attr("class", chartName)
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom + 10)
            .append("g")
            .attr("transform", "translate(" + shift.toString() + "," + margin.top.toString() + ")")
            .on("mouseout.something", () => this.mouseLeave());

        const x = d3
            .scaleLinear()
            .domain([0, top])
            .range([0, width - 10]);
        const y = d3
            .scaleBand()
            .rangeRound([height, 0])
            .domain(
                data.map((d) => {
                    return d.key;
                })
            );
        const yAxisLeft = d3.axisLeft(y).tickSize(0);
        const yAxisRight = d3.axisRight(y).tickSize(0);
        const duration = 500;
        const bars = this.compCharts[chartName].selectAll(".bar").data(data);
        const new_bars = bars
            .enter()
            .append("rect")
            .attr("opacity", 0)
            .attr("class", (d) => {
                let selKey = "";
                if (this.queryFilter["AgeDimension"]) {
                    if (this.queryFilter["AgeDimension"][0].includes(d.key)) {
                        selKey = " selected";
                    } else {
                        selKey = " notselected";
                    }
                }
                if (!male) {
                    return "bar female" + selKey;
                }
                return "bar male" + selKey;
            })
            .attr("y", (d) => {
                return y(d.key);
            })
            .attr("height", y.bandwidth())
            .attr("x", (d) => {
                if (male) {
                    return -x(d.value);
                }
                return x(0);
            })
            .attr("width", (d) => {
                return x(d.value);
            });
        new_bars
            .merge(bars)
            .transition()
            .duration(duration)
            .attr("opacity", "0.7")
            .attr("y", (d) => {
                return y(d.key);
            })
            .attr("height", y.bandwidth())
            .attr("x", (d) => {
                if (male) {
                    return -x(d.value);
                }
                return x(0);
            })
            .attr("width", (d) => {
                return x(d.value);
            });
        bars.exit().transition().duration(duration).attr("height", y.bandwidth()).attr("y", height).attr("opacity", 0).remove();
        if (!male) {
            const gyLeft = this.compCharts[chartName]
                .append("g")
                .attr("class", "y axis left")
                .attr("display", "block")
                .attr("font-weight", "600")
                .attr("transform", "translate(2,0)");
            gyLeft.call(yAxisLeft);
        } else {
            const gyRight = this.compCharts[chartName]
                .append("g")
                .attr("class", "y axis right")
                .attr("display", "block")
                .attr("font-weight", "600")
                .attr("transform", "translate(0,0)");
            gyRight.call(yAxisRight);
            gyRight.selectAll(".tick").select("text").attr("x", "5");
        }
        new_bars
            .on("mouseover.something", (d, index, array) => this.mouseEnter(d, index, array, chartName))
            .on("mouseout.something", () => this.mouseLeave());
        bars.on("mouseover.something", (d, index, array) => this.mouseEnter(d, index, array, chartName)).on("mouseout.something", () =>
            this.mouseLeave()
        );
        if (!male) {
            const xAxis = d3.axisBottom(x).ticks(5);
            this.compCharts[chartName]
                .append("g")
                .attr("transform", "translate(0, " + height.toString() + ")")
                .call(xAxis);
        } else {
            const x2 = d3
                .scaleLinear()
                .domain([top, 0])
                .range([0, width - 10]);
            const xAxis = d3.axisBottom(x2).ticks(5);
            this.compCharts[chartName]
                .append("g")
                .attr("transform", "translate(-" + (shift - margin.right).toString() + ", " + height.toString() + ")")
                .call(xAxis);
        }
    }

    mouseEnter(datum: any, index: number, array: any, chartName: string) {
        const attributes = array[index]["attributes"];
        let x = parseInt(attributes["x"].nodeValue);
        if (x < 0) {
            x = 0;
        }
        let y = 0;
        if (attributes["y"]) {
            y = parseInt(attributes["y"].nodeValue);
        }
        const rect = document.getElementById(chartName).getBoundingClientRect();
        const drawer = document.getElementsByClassName("mat-drawer-content")[0];
        let text = "Age Range";
        if (chartName === "deprivationChart") {
            text = "Deprivation Value";
        }
        let leftvalue = rect.left + x;
        if (x > 0) {
            leftvalue = x;
        } else {
            leftvalue = rect.left - 150;
        }
        this.toolTip.transition().duration(200).style("opacity", 0.9);
        this.toolTip
            .html(this.htmlTooltip(datum, text))
            .style("left", leftvalue.toString() + "px")
            .style("top", (drawer.scrollTop + rect.top + y - 110).toString() + "px");
    }

    mouseLeave() {
        if (this.toolTip) {
            this.toolTip.style("opacity", 0);
        }
    }

    htmlTooltip(d: any, text: string) {
        let output;
        output = "<div id='toolTip' class='container d3-tip'>";
        output += " <h5>" + text + ": " + (d.key as string) + "</h5><h5>Total: " + (d.value as string) + "</h5>";
        output += "	</div>";
        return output;
    }
}
