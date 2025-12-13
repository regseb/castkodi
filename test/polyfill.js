/**
 * @license MIT
 * @author Sébastien Règne
 */

import { WebSocket } from "mock-socket";
import { browser } from "./polyfill/browser.js";
import { DOMParser, XPathResult } from "./polyfill/dom.js";
import { USER_AGENT } from "./polyfill/useragent.js";

globalThis.browser = browser;
globalThis.DOMParser = DOMParser;
// Ne pas modifier directement la variable navigator, car sa modification n'est
// pas possible : "Cannot set property userAgent of #<Navigator> which has only
// a getter".
Object.defineProperty(
    Object.getPrototypeOf(globalThis.navigator),
    "userAgent",
    {
        get: () => USER_AGENT,
        enumerable: true,
        configurable: true,
    },
);
globalThis.WebSocket = WebSocket;
globalThis.XPathResult = XPathResult;
