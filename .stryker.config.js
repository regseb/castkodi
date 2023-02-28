/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

/**
 * @type {import("@stryker-mutator/api/core").PartialStrykerOptions}
 */
export default {
    incremental: true,
    incrementalFile: ".stryker/stryker-incremental.json",
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
