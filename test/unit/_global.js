import "../polyfill.js";
import { browser }   from "./mock/browser.js";
import { fetch }     from "./mock/fetch.js";
import { WebSocket } from "./mock/websocket.js";

globalThis.browser   = browser;
globalThis.fetch     = fetch;
globalThis.WebSocket = WebSocket;
