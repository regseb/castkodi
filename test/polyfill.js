import { URL }       from "url";
import { JSDOM }     from "jsdom";
import { browser }   from "./polyfill/browser.js";
import { fetch }     from "./polyfill/fetch.js";

globalThis.URL       = URL;
globalThis.fetch     = fetch;
globalThis.browser   = browser;
globalThis.DOMParser = new JSDOM().window.DOMParser;
