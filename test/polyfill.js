/**
 * @module
 */

import { JSDOM } from "jsdom";
import { WebSocket } from "mock-socket";
import { browser } from "./polyfill/browser.js";
import { CloseEvent } from "./polyfill/closeevent.js";
import { fetch } from "./polyfill/fetch.js";

globalThis.DOMParser = new JSDOM().window.DOMParser;
globalThis.XPathResult = new JSDOM().window.XPathResult;

globalThis.browser = browser;
globalThis.CloseEvent = CloseEvent;
globalThis.fetch = fetch;
globalThis.WebSocket = WebSocket;
