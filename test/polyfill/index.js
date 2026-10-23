/**
 * @license MIT
 * @author Sébastien Règne
 */

import { browser } from "./browser.js";
import { USER_AGENT } from "./useragent.js";

globalThis.browser = browser;
// Ne pas modifier directement la variable navigator, car sa modification n'est
// pas possible : "Cannot set property userAgent of #<Navigator> which has only
// a getter".
Object.defineProperty(Object.getPrototypeOf(navigator), "userAgent", {
    get: () => USER_AGENT,
    enumerable: true,
    configurable: true,
});

await import("../../src/polyfill/browser.js");
await import("../../src/polyfill/domparser.js");
await import("../../src/polyfill/useragentdata.js");
