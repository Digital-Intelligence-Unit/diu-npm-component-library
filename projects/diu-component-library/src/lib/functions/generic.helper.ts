import { style, state, animate, trigger, transition } from "@angular/animations";
import { iUserProfile } from "../types/user.interface";
import { jwtDecode } from "jwt-decode";

export const generateID = () => {
    return new Date().toISOString().split("-").join().split(":").join().split(".").join().replace("T", "").replace("Z", "");
};

export const getUser = (): iUserProfile => {
    const state = localStorage.getItem("@@STATE");
    if (state) {
        return jwtDecode(JSON.parse(state).stateauth.token);
    } else {
        return null;
    }
}

export const collapseAnimations = [
    trigger("expandCollapse", [
        state(
            "open",
            style({
                height: "*",
            })
        ),
        state(
            "close",
            style({
                height: "0px",
                "min-height": "0px",
                padding: "0px",
            })
        ),
        transition("open <=> close", animate(500)),
    ]),
];
