import { URL }       from "url";
import fetch         from "node-fetch";
import { browser }   from "./polyfill/browser.js";
import { btoa }      from "./polyfill/btoa.js";
import { DOMParser } from "./polyfill/domparser.js";

globalThis.URL       = URL;
globalThis.fetch     = fetch;
globalThis.browser   = browser;
globalThis.btoa      = btoa;
globalThis.DOMParser = DOMParser;
