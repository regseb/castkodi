/**
 * @license MIT
 * @author Sébastien Règne
 */

import { WebSocket } from "mock-socket";
import { URLPattern } from "urlpattern-polyfill";
import { browser } from "./polyfill/browser.js";
import { CloseEvent } from "./polyfill/closeevent.js";
import { DOMParser, XPathResult } from "./polyfill/dom.js";
import { stealthFetch } from "./polyfill/fetch.js";
import { escape } from "./polyfill/regexp.js";
import { USER_AGENT } from "./polyfill/useragent.js";

globalThis.browser = browser;
globalThis.CloseEvent = CloseEvent;
globalThis.DOMParser = DOMParser;
globalThis.fetch = stealthFetch;
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
globalThis.RegExp.escape = escape;
// Utiliser une prothèse pour URLPattern, car la classe est disponible à partir
// de Node.js v23. https://nodejs.org/api/url.html#class-urlpattern
globalThis.URLPattern = URLPattern;
globalThis.WebSocket = WebSocket;
globalThis.XPathResult = XPathResult;
