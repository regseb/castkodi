import { URL }       from "url";
import fetch         from "node-fetch";
import { browser }   from "./mock/browser.js";
import { DOMParser } from "./mock/domparser.js";

global.URL       = URL;
global.fetch     = fetch;
global.browser   = browser;
global.DOMParser = DOMParser;
