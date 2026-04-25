/**
 * @license MIT
 * @see https://github.com/import-js/eslint-plugin-import#rules
 * @see https://github.com/sindresorhus/eslint-plugin-unicorn#rules
 * @author Sébastien Règne
 */

/**
 * @import { Linter } from "eslint"
 */

/**
 * @type {Linter.Config}
 */
export default {
    rules: {
        // Plugin eslint-plugin-import.
        // Style guide.
        "import/no-anonymous-default-export": "off",

        // Plugin eslint-plugin-unicorn.
        "unicorn/filename-case": "off",
    },
};
