/**
 * @license MIT
 * @author Sébastien Règne
 */

import { JSDOM } from "jsdom";

const jsdom = new JSDOM();
jsdom.reconfigure({
    url: "chrome-extension://jbhgmbmkmilpkhlcigfojdjefjacclnk/background.js",
});

export const DOMParser = jsdom.window.DOMParser;
export const XPathResult = jsdom.window.XPathResult;
