/**
 * @license MIT
 * @author Sébastien Règne
 */

// @ts-expect-error -- Le plugin mocha ne fournit pas de types.
import mocha from "eslint-plugin-mocha";
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
            ...globals.mocha,
            ...globals.webextensions,
        },
    },

    plugins: { mocha },

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
        // Autoriser les hooks "afterEach", car ils sont toujours exécuter après
        // les tests (pour nettoyer l'environnement) même si les tests ont
        // échoués. Et autoriser les "before" pour désactiver les tests selon
        // dans quel pays ils sont exécutés.
        "mocha/no-hooks": ["error", { allow: ["afterEach", "before"] }],
        // Désactiver cette règle, car il n'y a pas de condition différente avec
        // la règle "no-hook".
        "mocha/no-hooks-for-single-case": "off",
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
