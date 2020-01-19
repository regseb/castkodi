import { URL }       from "url";
import { browser }   from "./polyfill/browser.js";
import { btoa }      from "./polyfill/btoa.js";
import { DOMParser } from "./polyfill/domparser.js";
import { fetch }     from "./polyfill/fetch.js";

globalThis.URL       = URL;
globalThis.fetch     = fetch;
globalThis.browser   = browser;
globalThis.btoa      = btoa;
globalThis.DOMParser = DOMParser;
