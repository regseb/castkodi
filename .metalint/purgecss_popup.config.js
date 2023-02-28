/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

export default {
    content: "/src/popup/*.html",
    safelist: {
        standard: ["Chromium", "Firefox"],
        deep: [/^playlist-items$/u],
    },
};
