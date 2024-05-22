import { iEventActions } from "./eventactions";
import { iDisplayList } from "./installations.interface";

/**
 * This function is used to get child component configeration from the API
 *
 * @param newchildren
 * @param injectedService
 * @returns
 */
export const fetchChildren = async (newchildren: any[], injectedService) => {
    const childDetails = [];
    await newchildren.forEach(async (child: any) => {
        await injectedService.getPayloadById(child.id).subscribe((thisChild: any) => {
            if (thisChild) {
                if (thisChild.config) thisChild.config = modifyConfig(thisChild.config);
                thisChild.order = child.order;
                childDetails.push(thisChild);
                childDetails.sort((a, b) => {
                    return parseInt(a.order.toString()) - parseInt(b.order.toString());
                });
            }
        });
    });
    return childDetails;
};

/**
 * This function parses stringified data from the DB
 *
 * @param config - A JSON.stringified() payload containing configeration for the component coming from the DB
 * @returns
 */
export const modifyConfig = (config: any) => {
    try {
        return JSON.parse(config);
    } catch {
        return config;
    }
};

/**
 * This class is the highest level class for handling components, this class gets the configeration and child components
 */
export class cComponentHandler {
    /**
     * config is the data required for the component to run
     */
    config: any;

    /**
     * Data for the components to be output as children inside of the current component
     */
    children: any[] = [];

    /**
     * Data for the components events
     */
    actions: iEventActions[] = [];

    constructor(configSring: string) {
        this.config = modifyConfig(configSring);
        if (this.config && this.config.children) {
            this.config.children = modifyConfig(this.config.children);
        }
        if (this.config && this.config.actions) {
            this.config.actions = modifyConfig(this.config.actions);
        }
    }
}

/**
 * This interface is used for profile-installs list data
 */
export interface iDisplayListConfig {
    title: string;
    getAllEndpoint: string;
    getByUsernameEndpoint: string;
    removeEndpoint: string;
    registerEndpoint: string;
    displayConfigData: iDisplayList[];
}

/**
 * This class is used to handle the data for profile-installs
 */
export class cDisplayListsHandler extends cComponentHandler {
    /**
     * displayLists is an array of data being collected to be output in the component HTML
     */
    displayLists: iDisplayListConfig[] = [];

    /**
     * Class constructor function
     *
     * @param configstring JSON.stringify data for the component, passed to the parent to be parsed
     */
    constructor(configstring: string) {
        super(configstring);
        if (this.config && this.config.displayLists) {
            this.displayLists = modifyConfig(this.config.displayLists);
        }
    }
}

/**
 * This class is used to handle the data required for the form-with-table component
 */
export class cFormWithTableHander extends cComponentHandler {
    formData: any;
    formDataID: string;
    tableDataID: string;
    displayValidation: boolean;

    constructor(configSring: string) {
        super(configSring);
        this.formData = this.config.formData || null;
        this.formDataID = this.config.formDataID || null;
        this.tableDataID = this.config.tableDataID || null;
        this.displayValidation = this.config.displayValidation || true;
    }
}

/**
 * Interface for handling tab data
 */
export interface iTabDetails {
    /**
     * Label is a string that will be output to represent what the data within the tab will be
     */
    label: string;

    /**
     * this is an array of data containing configeration for components to be output within the content area of the tab
     */
    components: any[];
}

/**
 * Interface for handling the complete tab component
 */
export interface iTabConfig {
    /**
     * The type of tabs to be output
     */
    type: string;

    /**
     * This is an array containing the information for each of the tabs to be output
     */
    tabs: iTabDetails[];

    /**
     * This determines if the tab labels will be output at the top orthe left of the content
     */
    leftTabGroup: boolean;
}

/**
 * This class is responsible for ensuring the data from the tabs component is set correctly
 */
export class cTabHandler extends cComponentHandler {
    /**
     * tabs is an array containing tab labels and child components to be output in the tab
     */
    tabs: iTabDetails[];

    /**
     * This determines if the tab labels will be output at the top orthe left of the content
     */
    leftTabGroup: boolean;

    constructor(configSring: string) {
        super(configSring);
        this.tabs = this.config.tabs || [];
        this.leftTabGroup = this.config.leftTabGroup || false;
    }
}

/**
 * Class repsonsible for determining rows and columns
 */
export class cLayoutHandler extends cComponentHandler {
    /**
     * colsize is a number between 0-100 which will determine how wide a column should be (CSS flexbox)
     */
    colsize: string;

    constructor(configSring: string) {
        super(configSring);
        this.colsize = this.config.colsize || "100";
    }
}

/**
 * Interface for individual carousel items
 */
export interface iCarouselItem {
    /**
     * video contains a URL for a video to be output
     */
    video: string;

    /**
     * class to be output for overlay effect on content
     */
    class: string;

    /**
     * This is output in a paragraph tag within the carousel
     */
    innerhtml: string;
}

/**
 * This class is responsible for ensuring the data from the carousel component is set correctly
 */
export class cCarouselHandler extends cComponentHandler {
    /**
     * an array of data for each item in the carousel
     */
    carouselItems: iCarouselItem[] = [];

    constructor(configSring: string) {
        super(configSring);
        if (this.config.carouselitems) this.carouselItems = this.config.carouselitems;
    }
}

export class cStoreHandler extends cComponentHandler {
    getAllStoreEndpoint: string;
    getInstallsByUsernameEndpoint: string;
    getInstallsByTeamcodeEndpoint: string;

    constructor(configSring: string) {
        super(configSring);
        if (this.config.getAllStoreEndpoint) this.getAllStoreEndpoint = this.config.getAllStoreEndpoint;
        if (this.config.getInstallsByUsernameEndpoint) this.getInstallsByUsernameEndpoint = this.config.getInstallsByUsernameEndpoint;
        if (this.config.getInstallsByTeamcodeEndpoint) this.getInstallsByTeamcodeEndpoint = this.config.getInstallsByTeamcodeEndpoint;
    }
}
