export default {
    testRunner: "mocha",
    ignorePatterns: ["/src/options/", "/src/polyfill/", "/src/popup/"],
    ignoreStatic: true,
    mochaOptions: { config: "test/unit/mocharc.json" },
    reporters: ["dots", "clear-text"],
};
