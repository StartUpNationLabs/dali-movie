import {atom} from "recoil";

export const todoListState = atom({
    key: 'showTimeline',
    default: true,
});