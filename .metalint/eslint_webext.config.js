/**
 * @license MIT
 * @see https://eslint.org/docs/latest/rules/
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
};
