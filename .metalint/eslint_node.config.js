/**
 * @module
 * @license MIT
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
        "no-restricted-properties": [
            "error",
            {
                object: "assert",
                property: "deepStrictEqual",
                message: "Use assert.deepEqual instead.",
            },
            {
                object: "assert",
                property: "notDeepStrictEqual",
                message: "Use assert.notDeepEqual instead.",
            },
            {
                object: "assert",
                property: "notStrictEqual",
                message: "Use assert.notEqual instead.",
            },
            {
                object: "assert",
                property: "strictEqual",
                message: "Use assert.equal instead.",
            },
        ],

        // Plugin eslint-plugin-import.
        // Module systems.
        "import/no-nodejs-modules": "off",

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
            {
                // Ignorer les vérifications de fetch() et Response qui sont
                // bien disponible dans Node v20, mais en expérimental.
                ignores: ["fetch", "Response"],
            },
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
        // Interdire l'import "node:assert" (et préférer "node:assert/strict").
        // https://github.com/eslint-community/eslint-plugin-n/issues/59
        "n/no-restricted-import": ["error", ["node:assert"]],
        "n/no-restricted-require": "error",
        "n/no-sync": "error",
        // Désactiver les règles n/prefer-global, car aucune variable globale de
        // Node n'est déclarée, donc si elles sont utilisées : la règle no-undef
        // remontera une erreur.
        "n/prefer-global/buffer": "off",
        "n/prefer-global/console": "off",
        "n/prefer-global/process": "off",
        "n/prefer-global/text-decoder": "off",
        "n/prefer-global/text-encoder": "off",
        "n/prefer-global/url-search-params": "off",
        "n/prefer-global/url": "off",
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
