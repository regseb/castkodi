/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

/**
 * @type {import("eslint").Linter.Config}
 */
export default {
    env: {
        browser: true,
        mocha: true,
        webextensions: true,
    },

    rules: {
        // Suggestions.
        complexity: "off",
        "func-names": "off",
        "max-classes-per-file": "off",
        "max-lines": "off",
        "max-lines-per-function": "off",
        "max-statements": "off",
        "prefer-arrow-callback": "off",

        // Plugin eslint-plugin-mocha.
        "mocha/consistent-spacing-between-blocks": "error",
        "mocha/handle-done-callback": "error",
        "mocha/max-top-level-suites": "error",
        "mocha/no-async-describe": "error",
        "mocha/no-empty-description": "error",
        "mocha/no-exclusive-tests": "error",
        "mocha/no-exports": "error",
        "mocha/no-global-tests": "error",
        "mocha/no-hooks": ["error", { allow: ["before"] }],
        "mocha/no-hooks-for-single-case": "error",
        "mocha/no-identical-title": "error",
        "mocha/no-mocha-arrows": "error",
        "mocha/no-nested-tests": "error",
        "mocha/no-pending-tests": "error",
        "mocha/no-return-and-callback": "error",
        "mocha/no-return-from-async": "error",
        "mocha/no-setup-in-describe": "error",
        "mocha/no-sibling-hooks": "error",
        "mocha/no-skipped-tests": "off",
        "mocha/no-synchronous-tests": "off",
        "mocha/no-top-level-hooks": "error",
        "mocha/prefer-arrow-callback": "error",
        "mocha/valid-suite-description": "off",
        "mocha/valid-test-description": "off",

        // Plugin eslint-plugin-no-unsanitized.
        "no-unsanitized/method": "off",

        // Plugin eslint-plugin-unicorn.
        // Ne pas obliger à sortir les fonctions des tests.
        "unicorn/consistent-function-scoping": "off",
        // Autoriser la valeur null pour pouvoir tester cette valeur dans les
        // tests.
        "unicorn/no-null": "off",
    },
};
