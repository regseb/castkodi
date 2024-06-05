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
// Désactiver cette règle car il y a un faux positif quand on affecte une valeur
// à la variable globale WebSocket.
// https://github.com/eslint-community/eslint-plugin-n/issues/274
// eslint-disable-next-line n/no-unsupported-features/node-builtins
globalThis.WebSocket = WebSocket;
globalThis.XPathResult = XPathResult;
