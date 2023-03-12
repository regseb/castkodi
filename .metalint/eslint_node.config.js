/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

export default {
    env: {
        node: true,
    },

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
        "n/no-unpublished-import": "off",
        "n/no-unpublished-require": "error",
        "n/no-unsupported-features/es-builtins": "error",
        "n/no-unsupported-features/es-syntax": [
            "error",
            {
                ignores: ["dynamicImport", "modules"],
            },
        ],
        "n/no-unsupported-features/node-builtins": "error",
        "n/process-exit-as-throw": "error",
        "n/shebang": "error",

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
        "n/no-sync": ["error", { allowAtRootLevel: true }],
        "n/prefer-global/buffer": "error",
        "n/prefer-global/console": "error",
        "n/prefer-global/process": "error",
        "n/prefer-global/text-decoder": "error",
        "n/prefer-global/text-encoder": "error",
        "n/prefer-global/url-search-params": "error",
        "n/prefer-global/url": "error",
        "n/prefer-promises/dns": "error",
        "n/prefer-promises/fs": "error",
    },
};
