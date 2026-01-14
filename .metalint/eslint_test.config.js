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

    rules: {
        // Suggestions.
        complexity: "off",
        "func-names": "off",
        "max-classes-per-file": "off",
        "max-lines": "off",
        "max-lines-per-function": "off",
        "max-statements": "off",

        // Plugin eslint-plugin-import.
        "import/no-unassigned-import": [
            "error",
            { allow: ["**/polyfill/**", "**/setup.js"] },
        ],

        // Plugin eslint-plugin-no-unsanitized.
        "noUnsanitized/method": "off",

        // Plugin eslint-plugin-unicorn.
        // Ne pas obliger à sortir les fonctions des tests.
        "unicorn/consistent-function-scoping": "off",
        // Autoriser la valeur null pour pouvoir tester cette valeur dans les
        // tests.
        "unicorn/no-null": "off",
    },
};
