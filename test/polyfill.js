import { URL }               from "url";
import AbortController       from "abort-controller";
import { EventTarget }       from "event-target-shim";
import { JSDOM }             from "jsdom";
import { Headers, Response } from "node-fetch";
import { browser }           from "./polyfill/browser.js";
import { Event }             from "./polyfill/event.js";
import { CloseEvent }        from "./polyfill/closeevent.js";
import { fetch }             from "./polyfill/fetch.js";

globalThis.URL = URL;

globalThis.AbortController = AbortController;
globalThis.EventTarget     = EventTarget;
globalThis.DOMParser       = new JSDOM().window.DOMParser;
globalThis.Headers         = Headers;
globalThis.Response        = Response;

globalThis.browser    = browser;
globalThis.Event      = Event;
globalThis.CloseEvent = CloseEvent;
globalThis.fetch      = fetch;
