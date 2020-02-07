import "../polyfill.js";
import { WebSocket } from "./mock/websocket.js";

globalThis.WebSocket = WebSocket;

globalThis.fetch = function () {
    throw new Error("do not use real fetch for unit tests");
};
