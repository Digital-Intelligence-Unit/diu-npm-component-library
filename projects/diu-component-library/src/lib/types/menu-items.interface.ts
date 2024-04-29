/**
 * Menu Badge Interface
 */
export interface iBadgeItem {
    /**
     * Badge Type
     */
    type: string;
    /**
     * Badge value
     */
    value: string;
}

/**
 * Menu separator Interface
 */
export interface iSaperator {
    /**
     * Separator name
     */
    name: string;
    /**
     * Separator type
     */
    type?: string;
}

/**
 * Menu Children Interface
 */
export interface iChildrenItems {
    /**
     * Menu Child State
     */
    state: string;
    /**
     * Menu Child name
     */
    name: string;
    /**
     * Menu Child type
     */
    type?: string;
    /**
     * Menu Child Icon
     */
    icon?: string;
}

/**
 * Menu Interface
 */
export interface iMenu {
    /**
     * Menu State
     */
    state: string;
    /**
     * Menu name
     */
    name: string;
    /**
     * Menu type
     */
    type: string;
    /**
     * Menu icon
     */
    icon: string;
    /**
     * Menu Badges
     */
    badge?: iBadgeItem[];
    /**
     * Menu separators
     */
    saperator?: iSaperator[];
    /**
     * Menu children
     */
    children?: iChildrenItems[];
    /**
     * If the Menu item can only be seen by Administrators
     */
    isAdmin?: boolean;
    /**
     * If the Menu item can only be seen by users with a specific role
     */
    role?: string;
}
