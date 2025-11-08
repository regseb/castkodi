/**
 * @license MIT
 * @see https://biomejs.dev/reference/configuration/
 * @author Sébastien Règne
 */

/**
 * @import { Configuration } from "@biomejs/js-api/nodejs"
 */

/**
 * @type {Configuration}
 */
export default {
    linter: {
        rules: {
            complexity: {
                // Désactiver cette règle, car les tests Mocha doivent utiliser
                // une fonction.
                // https://mochajs.org/next/features/arrow-functions/
                useArrowFunction: "off",
            },
        },
    },
};
