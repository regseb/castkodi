/**
 * @license MIT
 * @see https://github.com/un-ts/eslint-plugin-import-x#rules
 * @see https://github.com/eslint-community/eslint-plugin-n#-rules
 * @see https://github.com/sindresorhus/eslint-plugin-unicorn#rules
 * @author Sébastien Règne
 */

import n from "eslint-plugin-n";

/**
 * @import { Linter } from "eslint"
 */

/**
 * @type {Linter.Config}
 */
export default {
    plugins: { n },

    rules: {
        // Plugin eslint-plugin-import-x.
        // Module systems.
        "importX/no-nodejs-modules": "off",

        // Plugin eslint-plugin-n.
        // Possible Errors.
        "n/handle-callback-err": "error",
        "n/hashbang": "error",
        "n/no-callback-literal": "error",
        "n/no-exports-assign": "error",
        "n/no-extraneous-import": "error",
        "n/no-extraneous-require": "error",
        "n/no-missing-import": "error",
        "n/no-missing-require": "error",
        "n/no-new-require": "error",
        "n/no-path-concat": "error",
        "n/no-process-exit": "error",
        "n/no-unpublished-bin": "error",
        "n/no-unpublished-import": "error",
        // Ne pas vérifier les require(), car ils ne sont pas utilisés (en
        // faveur des imports).
        "n/no-unpublished-require": "off",
        "n/no-unsupported-features/es-builtins": "error",
        "n/no-unsupported-features/es-syntax": "error",
        "n/no-unsupported-features/node-builtins": [
            "error",
            { allowExperimental: true },
        ],
        "n/process-exit-as-throw": "error",

        // Best Practices.
        "n/no-deprecated-api": "error",

        // Stylistic Issues.
        "n/callback-return": "error",
        "n/exports-style": "error",
        "n/file-extension-in-import": "error",
        "n/global-require": "off",
        "n/no-mixed-requires": "error",
        "n/no-process-env": "off",
        "n/no-restricted-import": "off",
        "n/no-restricted-require": "off",
        "n/no-sync": "error",
        "n/no-top-level-await": "off",
        "n/prefer-global/buffer": ["error", "never"],
        "n/prefer-global/console": "error",
        "n/prefer-global/crypto": "error",
        "n/prefer-global/process": ["error", "never"],
        "n/prefer-global/text-decoder": "error",
        "n/prefer-global/text-encoder": "error",
        "n/prefer-global/timers": "error",
        "n/prefer-global/url": "error",
        "n/prefer-global/url-search-params": "error",
        "n/prefer-import/assert-strict": "error",
        "n/prefer-node-protocol": "error",
        "n/prefer-promises/dns": "error",
        "n/prefer-promises/fs": "error",

        // Plugin eslint-plugin-unicorn.
        // Désactiver les règles suivantes, car elles s'appliquent seulement au
        // DOM et sont donc inutiles dans les scripts Node.js.
        "unicorn/prefer-dom-node-append": "off",
        "unicorn/prefer-dom-node-dataset": "off",
        "unicorn/prefer-dom-node-remove": "off",
        "unicorn/prefer-dom-node-text-content": "off",
    },
};
