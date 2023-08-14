import * as d3 from "d3";

// -------- TYPES  --------
export interface iColorCodes {
    key: string;
    color: string;
}

export const DeprivationColorCodes: iColorCodes[] = [
    { key: "0", color: "#000000" },
    { key: "1", color: "#40004b" },
    { key: "2", color: "#762a83" },
    { key: "3", color: "#9970ab" },
    { key: "4", color: "#c2a5cf" },
    { key: "5", color: "#e7d4e8" },
    { key: "6", color: "#d9f0d3" },
    { key: "7", color: "#a6dba0" },
    { key: "8", color: "#5aae61" },
    { key: "9", color: "#1b7837" },
    { key: "10", color: "#00441b" },
];

export const PlaceColorCodes = {
    E10000006: {
        name: "South Cumbria",
        colour: "#21a699",
    },
    E06000008: {
        name: "Blackburn with Darwen",
        colour: "#362c77",
    },
    E06000009: {
        name: "Blackpool",
        colour: "#830065",
    },
    E10000017: {
        name: "Lancashire",
        colour: "#dd0a34",
    }
}

export const FAB_BUTTONS =  [
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

export const GPPracticeTypes = {
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
}

export interface iWardDetails {
    code: string;
    name: string;
    text: string;
    link?: string;
    image: string;
    icp: string;
}

export interface iPointOfInterest {
    type: string;
    name: string;
    link: string;
    postcode?: string;
    wardcode?: string;
    regionpath?: any;
    latitude: number;
    longitude: number;
}

// -------- USEFUL FUNCTIONS  --------
export const hexToRgb = (hex) => {
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

export const calculateAreaFill = (area?, breadcrumbs?) => {
    if (area) {
        const rgb = hexToRgb(calculateStroke(area, breadcrumbs));
        return "rgba(" + rgb.r.toString() + "," + rgb.g.toString() + "," + rgb.b.toString() + ",0.2)";
    }
    return "rgb(255,255,255,0)";
}

export const calculateStroke = (feature?, breadcrumbs?) => {
    let colour = "#000";

    if (feature) {
        if (PlaceColorCodes[feature.properties.code]) {
            return PlaceColorCodes[feature.properties.code].colour;
        }
    }

    if (breadcrumbs) {
        breadcrumbs.forEach((feature) => {
            if (PlaceColorCodes[feature.properties.code]) {
                colour = PlaceColorCodes[feature.properties.code].colour;
            }
        });
    }

    return colour;
}

export const d3Tooltip = (chartElement, tooltipParent, tooltipContentCallback) => {
    // Get tooltip container
    let tooltipContainer = chartElement.select(".tooltip");
    if(tooltipContainer.empty()) {
        tooltipContainer = chartElement
            .append("div")
            .attr("class", "tooltip mat-tooltip mat-tooltip-show")
            .style("color", "white")
            .style("border-radius", "4px");
    }

    // Store instance
    const instance: any = {
        disabled: false,
        remove: () => {
            tooltipContainer.style("visibility", "hidden");
            tooltipParent.on("mouseover", null);
            tooltipParent.on("mouseleave", null);
        }
    };

    // Add disable/enable
    instance.disable = () => {
        instance.disabled = true;
        tooltipContainer.style("visibility", "hidden");
    };
    instance.enable = () => {
        instance.disabled = false;
    };

    // Add events
    tooltipParent.on("mouseover", function (d) {
        if(instance.disabled === false) {
            // Show tooltip
            tooltipContainer.style("visibility", "visible")

            tooltipContainer
                .html(tooltipContentCallback(d))
                .style("left", (d3.select(this).node().getBBox().x as number).toString() + "px")
                .style("top", (d3.select(this).node().getBBox().y as number).toString() + "px")
        }
    });

    tooltipParent.on("mouseleave", (d) => {
        // Hide tooltip
        tooltipContainer.style("visibility", "hidden");
    });

    return instance;
}

export const d3ExternalTooltip = (tooltipParent, tooltipContentCallback) => {
    // Store instance
    const instance: any = {
        disabled: false,
        remove: () => {
            tooltipParent.on("mouseover", null);
            tooltipParent.on("mouseleave", null);
        }
    };

    // Add disable/enable
    instance.disable = () => {
        instance.disabled = true;
    };
    instance.enable = () => {
        instance.disabled = false;
    };

    // Add events
    tooltipParent.on("mouseover", (d) => {
        console.log("mouseover");
        if(instance.disabled === false) {
            tooltipContentCallback(d);
        }
    });

    tooltipParent.on("mouseleave", (d) => {
        if(instance.disabled === false) {
            tooltipContentCallback(null);
        }
    });

    return instance;
}

// -------- USEFUL CLASSES  --------
export class ICSBoundaries {
    _data;

    constructor(data) {
        this._data = data;
    }

    get() {
        return this._data;
    }

    getParentBoundaries(currentAreaCode, icsSelectedBreadcrumbs) {
        const current = this._data.features.filter((feature) => {
            return feature.properties.code === currentAreaCode;
        });

        if (current.length) {
            icsSelectedBreadcrumbs.push(current[0]);
            const parentAreaCode = current[0].properties.parent_code;
            this.getParentBoundaries(parentAreaCode, icsSelectedBreadcrumbs);
        }

        return;
    }

    getChildBoundaries(parent) {
        return this._data.features.filter((feature) => {
            return feature.properties.parent_code === parent;
        });
    }
}