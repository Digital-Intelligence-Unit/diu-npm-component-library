/**
 * Messages and Notifications sent on the System
 */
export interface iNotifications {
    /**
     * Unique ID
     */
    id: string;
    /**
     * Username
     */
    username?: string;
    /**
     * Unique Code for Team
     */
    teamcode?: string;
    /**
     * Method of transmission
     */
    method: string;
    /**
     * Type of Notification
     */
    type: string;
    /**
     * DateTime Notification sent
     */
    sentdate: Date;
    /**
     * DateTime Notification read
     */
    acknowledgeddate?: Date;
    /**
     * Username of Sender
     */
    sender: string;
    /**
     * Header text of Message
     */
    header: string;
    /**
     * Body test of Message
     */
    message: string;
    /**
     * Url included in Message (if applicable)
     */
    link?: string;
    /**
     * Level of importance of Message
     */
    importance: string;
    /**
     * Flag if notification has been deleted
     */
    archive: boolean;
}

/**
 * Tasks for Users or Teams
 */
export interface iTasks {
    /**
     * Unique ID
     */
    id: string;
    /**
     * Username
     */
    username?: string;
    /**
     * Unique Code for Team
     */
    teamcode?: string;
    /**
     * Flag if the task is completed
     */
    iscompleted: boolean;
    /**
     * Username of person to complete the task
     */
    completedby?: string;
    /**
     * DateTime that the task has been completed
     */
    enddate?: Date;
    /**
     * DateTime Task sent
     */
    sentdate: Date;
    /**
     * DateTime Task read
     */
    acknowledgeddate?: Date;
    /**
     * Creator of Task
     */
    sender: string;
    /**
     * Header text of Task
     */
    header: string;
    /**
     * Body test of Task
     */
    message: string;
    /**
     * Url included in Task (if applicable)
     */
    link?: string;
    /**
     * Level of importance of task
     */
    importance: string;
    /**
     * Flag if task has been deleted
     */
    archive: boolean;
    /**
     * Information on if Task includes an Invitation
     */
    invite?: string;
    /**
     * If the Task involves an application, the Unique ID for that Application
     */
    app_id?: string;
}

/**
 * A system-wide Alert message
 */
export interface iSystemAlerts {
    /**
     * Unique ID
     */
    id: string;
    /**
     * Name of Alert
     */
    name: string;
    /**
     * Message test of Alert
     */
    message: string;
    /**
     * Start DateTime of Alert
     */
    startdate: Date;
    /**
     * End DateTime of Alert
     */
    enddate: Date;
    /**
     * Status of Alert
     */
    status: string;
    /**
     * Icon used when displaying Alert
     */
    icon: string;
    /**
     * Creator of the Alert
     */
    author?: string;
    /**
     * Flag if alert has been deleted
     */
    archive: boolean;
}

export interface iEvents {
    start: Date;
    end: Date;
    title: string;
    color_primary: string;
    color_secondary: string;
    resizable_before?: boolean;
    resizable_after?: boolean;
    link?: string;
    importance: string;
    archive: boolean;
}

export interface iTeamEvent extends iEvents {
    teamcode: string;
    author: string;
}
