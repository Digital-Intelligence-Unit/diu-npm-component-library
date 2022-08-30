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

export interface iWardDetails {
    code: string;
    name: string;
    text: string;
    link?: string;
    image: string;
    icp: string;
}
