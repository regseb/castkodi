/* eslint-disable no-extend-native */

import { JSDOM } from "jsdom";
import { Headers, Response } from "node-fetch";
import { browser } from "./polyfill/browser.js";
import { CloseEvent } from "./polyfill/closeevent.js";
import { fetch } from "./polyfill/fetch.js";

globalThis.DOMParser = new JSDOM().window.DOMParser;
globalThis.Headers = Headers;
globalThis.Response = Response;

globalThis.browser = browser;
globalThis.CloseEvent = CloseEvent;
globalThis.fetch = fetch;
