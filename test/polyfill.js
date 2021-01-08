/* eslint-disable no-extend-native */

import AbortController       from "abort-controller";
import { EventTarget }       from "event-target-shim";
import { JSDOM }             from "jsdom";
import { Headers, Response } from "node-fetch";
import { browser }           from "./polyfill/browser.js";
import { CloseEvent }        from "./polyfill/closeevent.js";
import { Event }             from "./polyfill/event.js";
import { fetch }             from "./polyfill/fetch.js";
import { replaceAll }        from "./polyfill/replaceall.js";

globalThis.AbortController = AbortController;
globalThis.EventTarget     = EventTarget;
globalThis.DOMParser       = new JSDOM().window.DOMParser;
globalThis.Headers         = Headers;
globalThis.Response        = Response;

globalThis.browser    = browser;
globalThis.CloseEvent = CloseEvent;
globalThis.Event      = Event;
globalThis.fetch      = fetch;

String.prototype.replaceAll = replaceAll;
