import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { iEventActions } from "../_models/eventactions";

@Injectable()
export class BrokerService {
    currentMessage;

    private messageSubject = new BehaviorSubject<iEventActions>({
        id: "default",
        action: "none",
    });

    constructor() {
        this.currentMessage = this.messageSubject.asObservable();
    }

    sendMessage(message: iEventActions) {
        this.messageSubject.next(message);
    }
}
