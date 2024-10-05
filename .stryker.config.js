/**
 * @license MIT
 * @author Sébastien Règne
 */

/**
 * @import { PartialStrykerOptions } from "@stryker-mutator/api/core"
 */

/**
 * @type {PartialStrykerOptions}
 */
export default {
    disableTypeChecks: false,
    incremental: true,
    incrementalFile: ".stryker/incremental.json",
    ignoreStatic: true,
    mochaOptions: { config: "test/unit/mocharc.json" },
    mutate: [
        "src/**/*.js",
        "!src/options/**",
        "!src/polyfill/**",
        "!src/popup/**",
    ],
    reporters: ["dots", "clear-text"],
    tempDirName: ".stryker/tmp/",
    testRunner: "mocha",
};
