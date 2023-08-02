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