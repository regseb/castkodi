export default {
    incremental: true,
    incrementalFile: ".stryker/stryker-incremental.json",
    ignorePatterns: ["/src/options/", "/src/polyfill/", "/src/popup/"],
    ignoreStatic: true,
    mochaOptions: { config: "test/unit/mocharc.json" },
    reporters: ["dots", "clear-text"],
    tempDirName: ".stryker/tmp/",
    testRunner: "mocha",
};
