import "../polyfill.js";

globalThis.fetch = function () {
    throw new Error("do not use real fetch for unit tests");
};
