/**
 * @license MIT
 * @author Sébastien Règne
 */

import "../polyfill/index.js";

globalThis.fetch = () => {
    throw new Error("do not use real fetch for unit tests");
};
