import { SafeHtml } from "@angular/platform-browser";

export interface iApplication {
    name: string;
    url: string;
    ownerName: string;
    ownerEmail: string;
    icon: string;
    environment: string;
    status: string;
    description: string;
    images?: string[];
    userguideURL?: string;
    capability?: number;
}

/**
 * Installation interface
 */
export interface iInstallation {
    /**
     * Unique ID
     */
    id: string;
    /**
     * Username of person installation is assigned to
     */
    username?: string;
    /**
     * Code of team installation is assigned to
     */
    teamcode?: string;
    /**
     * Application Installed
     */
    app_name: string;
    /**
     * Date installation is requested
     */
    requestdate: Date;
    /**
     * Username of person initiating installation request
     */
    requestor: string;
    /**
     * Username of person approving request
     */
    requestapprover?: string;
    /**
     * Date of approval of installation
     */
    approveddate?: Date;
    /**
     * Date of refusal of installation
     */
    refusedate?: Date;
    /**
     * Username for Line Manager providing approval for installation
     */
    linemanager?: string;
    /**
     * Date of Line Manager approval for installation
     */
    linemanagerapproval?: Date;
}

/**
 * DisplayList interface
 */
export interface iDisplayList {
    /**
     * List items status to be displayed
     */
    status: string;
    /**
     * Application name to be displayed in list
     */
    name: string;
}

export interface iNewsFeed {
    destination: string;
    type: string;
    priority: string;
    html?: SafeHtml;
}
