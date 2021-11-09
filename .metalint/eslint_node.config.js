export default {
    env: {
        node: true,
    },

    rules: {
        // Plugin eslint-plugin-import.
        // Module systems.
        "import/no-nodejs-modules": 0,

        // Plugin eslint-plugin-node.
        // Possible Errors.
        "node/handle-callback-err": 2,
        "node/no-callback-literal": 2,
        "node/no-exports-assign": 2,
        "node/no-extraneous-import": 2,
        "node/no-extraneous-require": 2,
        "node/no-missing-import": 2,
        "node/no-missing-require": 2,
        "node/no-new-require": 2,
        "node/no-path-concat": 2,
        "node/no-process-exit": 2,
        "node/no-unpublished-bin": 2,
        "node/no-unpublished-import": 0,
        "node/no-unpublished-require": 2,
        "node/no-unsupported-features/es-builtins": 2,
        "node/no-unsupported-features/es-syntax": [2, {
            ignores: ["dynamicImport", "modules"],
        }],
        "node/no-unsupported-features/node-builtins": 2,
        "node/process-exit-as-throw": 2,
        "node/shebang": 2,

        // Best Practices.
        "node/no-deprecated-api": 2,

        // Stylistic Issues.
        "node/callback-return": 2,
        "node/exports-style": 2,
        "node/file-extension-in-import": 2,
        "node/global-require": 0,
        "node/no-mixed-requires": 2,
        "node/no-process-env": 0,
        "node/no-restricted-import": 2,
        "node/no-restricted-require": 2,
        "node/no-sync": [2, { allowAtRootLevel: true }],
        "node/prefer-global/buffer": 2,
        "node/prefer-global/console": 2,
        "node/prefer-global/process": 2,
        "node/prefer-global/text-decoder": 2,
        "node/prefer-global/text-encoder": 2,
        "node/prefer-global/url-search-params": 2,
        "node/prefer-global/url": 2,
        "node/prefer-promises/dns": 2,
        "node/prefer-promises/fs": 2,
    },
};
