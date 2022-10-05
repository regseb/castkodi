export default {
    testRunner: "mocha",
    ignorePatterns: [
        "/src/options/", "/src/polyfill/", "/src/popup/", "/src/script/",
    ],
    ignoreStatic: true,
    mochaOptions: { config: "test/unit/mocharc.json" },
    reporters: ["dots", "clear-text"],
};
