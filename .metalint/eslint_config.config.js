/**
 * @license MIT
 * @see https://github.com/un-ts/eslint-plugin-import-x#rules
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
        // Suggestions.
        "max-lines": "off",

        // Plugin eslint-plugin-import-x.
        // Style guide.
        "importX/no-anonymous-default-export": "off",

        // Plugin eslint-plugin-unicorn.
        "unicorn/filename-case": "off",
        "unicorn/no-top-level-side-effects": "off",
    },
};
