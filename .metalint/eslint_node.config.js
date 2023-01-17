export default {
    env: {
        node: true,
    },

    rules: {
        // Suggestions.
        "no-restricted-properties": [2, {
            object: "assert",
            property: "deepStrictEqual",
            message: "Use assert.deepEqual instead.",
        }, {
            object: "assert",
            property: "notDeepStrictEqual",
            message: "Use assert.notDeepEqual instead.",
        }, {
            object: "assert",
            property: "notStrictEqual",
            message: "Use assert.notEqual instead.",
        }, {
            object: "assert",
            property: "strictEqual",
            message: "Use assert.equal instead.",
        }],

        // Plugin eslint-plugin-import.
        // Module systems.
        "import/no-nodejs-modules": 0,

        // Plugin eslint-plugin-n.
        // Possible Errors.
        "n/handle-callback-err": 2,
        "n/no-callback-literal": 2,
        "n/no-exports-assign": 2,
        "n/no-extraneous-import": 2,
        "n/no-extraneous-require": 2,
        "n/no-missing-import": 2,
        "n/no-missing-require": 2,
        "n/no-new-require": 2,
        "n/no-path-concat": 2,
        "n/no-process-exit": 2,
        "n/no-unpublished-bin": 2,
        "n/no-unpublished-import": 0,
        "n/no-unpublished-require": 2,
        "n/no-unsupported-features/es-builtins": 2,
        "n/no-unsupported-features/es-syntax": [2, {
            ignores: ["dynamicImport", "modules"],
        }],
        "n/no-unsupported-features/node-builtins": 2,
        "n/process-exit-as-throw": 2,
        "n/shebang": 2,

        // Best Practices.
        "n/no-deprecated-api": 2,

        // Stylistic Issues.
        "n/callback-return": 2,
        "n/exports-style": 2,
        "n/file-extension-in-import": 2,
        "n/global-require": 0,
        "n/no-mixed-requires": 2,
        "n/no-process-env": 0,
        // Interdire l'import "node:assert" (et préférer "node:assert/strict").
        // https://github.com/eslint-community/eslint-plugin-n/issues/59
        "n/no-restricted-import": [2, ["node:assert"]],
        "n/no-restricted-require": 2,
        "n/no-sync": [2, { allowAtRootLevel: true }],
        "n/prefer-global/buffer": 2,
        "n/prefer-global/console": 2,
        "n/prefer-global/process": 2,
        "n/prefer-global/text-decoder": 2,
        "n/prefer-global/text-encoder": 2,
        "n/prefer-global/url-search-params": 2,
        "n/prefer-global/url": 2,
        "n/prefer-promises/dns": 2,
        "n/prefer-promises/fs": 2,
    },
};
