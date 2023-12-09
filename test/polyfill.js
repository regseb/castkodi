/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import { WebSocket } from "mock-socket";
import { browser } from "./polyfill/browser.js";
import { CloseEvent } from "./polyfill/closeevent.js";
import { DOMParser, XPathResult } from "./polyfill/dom.js";
import { stealthFetch } from "./polyfill/fetch.js";

globalThis.browser = browser;
globalThis.CloseEvent = CloseEvent;
globalThis.DOMParser = DOMParser;
globalThis.fetch = stealthFetch;
globalThis.WebSocket = WebSocket;
globalThis.XPathResult = XPathResult;
