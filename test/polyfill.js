import { URL }         from "url";
import AbortController from "abort-controller";
import { JSDOM }       from "jsdom";
import { browser }     from "./polyfill/browser.js";
import { fetch }       from "./polyfill/fetch.js";

globalThis.URL             = URL;
globalThis.AbortController = AbortController;
globalThis.DOMParser       = new JSDOM().window.DOMParser;
globalThis.browser         = browser;
globalThis.fetch           = fetch;
