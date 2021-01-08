export default {
    env: {
        browser: true,
        mocha: true,
        webextensions: true,
    },

    rules: {
        complexity: 0,

        "func-names": 0,
        "max-lines": 0,
        "max-lines-per-function": 0,
        "max-statements": 0,

        "prefer-arrow-callback": 0,

        "mocha/handle-done-callback": 2,
        "mocha/max-top-level-suites": 2,
        "mocha/no-async-describe": 2,
        "mocha/no-exclusive-tests": 2,
        "mocha/no-exports": 2,
        "mocha/no-global-tests": 2,
        "mocha/no-hooks": [2, { allow: ["before"] }],
        "mocha/no-hooks-for-single-case": 0,
        "mocha/no-identical-title": 2,
        "mocha/no-mocha-arrows": 2,
        "mocha/no-nested-tests": 2,
        "mocha/no-pending-tests": 2,
        "mocha/no-return-and-callback": 2,
        "mocha/no-return-from-async": 2,
        "mocha/no-setup-in-describe": 2,
        "mocha/no-sibling-hooks": 2,
        "mocha/no-skipped-tests": 2,
        "mocha/no-synchronous-tests": 0,
        "mocha/no-top-level-hooks": 2,
        "mocha/prefer-arrow-callback": 0,
        "mocha/valid-suite-description": 0,
        "mocha/valid-test-description": 0,
    },
};
