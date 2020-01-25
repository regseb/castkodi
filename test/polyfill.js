import { URL }       from "url";
import { browser }   from "./polyfill/browser.js";
import { DOMParser } from "./polyfill/domparser.js";
import { fetch }     from "./polyfill/fetch.js";

globalThis.URL       = URL;
globalThis.fetch     = fetch;
globalThis.browser   = browser;
globalThis.DOMParser = DOMParser;
