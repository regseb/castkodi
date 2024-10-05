/**
 * @license MIT
 * @author Sébastien Règne
 */

import { WebSocket } from "mock-socket";
import { browser } from "./polyfill/browser.js";
import { CloseEvent } from "./polyfill/closeevent.js";
import { DOMParser, XPathResult } from "./polyfill/dom.js";
import { stealthFetch } from "./polyfill/fetch.js";
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
// Désactiver cette règle, car il y a un faux positif quand on affecte une
// valeur à la variable globale WebSocket.
// https://github.com/eslint-community/eslint-plugin-n/issues/274
// eslint-disable-next-line n/no-unsupported-features/node-builtins
globalThis.WebSocket = WebSocket;
globalThis.XPathResult = XPathResult;
