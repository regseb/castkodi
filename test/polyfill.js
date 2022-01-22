import { JSDOM } from "jsdom";
import { Response } from "node-fetch";
import { browser } from "./polyfill/browser.js";
import { CloseEvent } from "./polyfill/closeevent.js";
import { fetch } from "./polyfill/fetch.js";

globalThis.DOMParser = new JSDOM().window.DOMParser;
globalThis.Response = Response;

globalThis.browser = browser;
globalThis.CloseEvent = CloseEvent;
globalThis.fetch = fetch;
