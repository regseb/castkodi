/**
 * @license MIT
 * @author Sébastien Règne
 */

import globals from "globals";

/**
 * @import { Linter } from "eslint"
 */

/**
 * @type {Linter.Config}
 */
export default {
    languageOptions: {
        globals: {
            ...globals.browser,
            ...globals.webextensions,
        },
    },

    rules: {
        // Suggestions.
        // Ne pas utiliser le drapeau "v", car Add-ons Linter ne le supporte
        // pas. https://github.com/mozilla/addons-linter/issues/5462
        "require-unicode-regexp": ["error", { requireFlag: "u" }],
    },
};
