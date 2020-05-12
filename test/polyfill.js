import AbortController from "abort-controller";
import eventTargetShim from "event-target-shim";
import jsdom           from "jsdom";
import nodeFetch       from "node-fetch";
import { browser }     from "./polyfill/browser.js";
import { Event }       from "./polyfill/event.js";
import { CloseEvent }  from "./polyfill/closeevent.js";
import { fetch }       from "./polyfill/fetch.js";

globalThis.AbortController = AbortController;
globalThis.EventTarget     = eventTargetShim.EventTarget;
globalThis.DOMParser       = new jsdom.JSDOM().window.DOMParser;
globalThis.Headers         = nodeFetch.Headers;
globalThis.Response        = nodeFetch.Response;

globalThis.browser    = browser;
globalThis.Event      = Event;
globalThis.CloseEvent = CloseEvent;
globalThis.fetch      = fetch;
