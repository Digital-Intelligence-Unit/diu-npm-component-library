export interface iModelUser {
    success: boolean;
    token?: string;
}

export interface iCredentials {
    username: string;
    password: string;
    organisation: string;
    authentication: string;
}

export interface iUserProfile {
    id: string;
    name: string;
    username: string;
    email: string;
    organisation: string;
}

export interface iUserDetails {
    id: string;
    username: string;
    photobase64?: string;
    contactnumber?: string;
    preferredcontactmethod?: string[];
    mobiledeviceids?: string[];
    emailpreference?: string;
    impreference?: string;
    im_id?: string;
}

/**
 * Full User Profile Class
 */
export interface iFullUser {
    /**
     * User's Organisation ID
     */
    id?: string;
    /**
     * User's Display Name
     */
    name: string;
    /**
     * User's Username
     */
    username: string;
    /**
     * User's Email contact
     */
    email: string;
    /**
     * User's Organisation
     */
    organisation: string;
    /**
     * User's Profile picture
     */
    photobase64?: string;
    /**
     * User's Contact Number
     */
    contactnumber?: string;
    /**
     * User's list of prefered contact methods
     */
    preferredcontactmethod?: string[];
    /**
     * User's Mobile Device UNID
     */
    mobiledeviceids?: string[];
    /**
     * User's Email preferences for automated system alerts/messages
     */
    emailpreference?: string;
    /**
     * User's Line Manager
     */
    linemanager?: string;
    /**
     * User's professional role
     */
    professional_role?: string;
    /**
     * User's last noted activity on the system
     */
    lastactive?: Date;
}

/**
 * Search Results Type
 */
export interface iSearchResults {
    /**
     * Organisation's Display Name
     */
    name: string;
    /**
     * Search Results of Users
     */
    results: iSection[];
}

/**
 * User List Display Section Type
 */
export interface iSection {
    /**
     * User's Display Name
     */
    name: string;
    /**
     * User's Email contact
     */
    email: string;
    /**
     * User's Username
     */
    username: string;

    /**
     * User's Organisation
     */
    organisation?: string;
}
