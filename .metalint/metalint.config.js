/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

export default {
    patterns: [
        "!/CHANGELOG.md",
        "!/.git/",
        "!/jsdocs/",
        "!/node_modules/",
        "!/src/polyfill/lib/",
        "!/.stryker/",
        "!*.swp",
        "**",
    ],
    checkers: [
        {
            patterns: ["*.json", "*.md", "*.svg", "*.yml"],
            linters: "prettier",
        },
        {
            patterns: "*.js",
            linters: {
                prettier: ["prettier.config.js", { tabWidth: 4 }],
            },
        },
        {
            patterns: ["/build/firefox/*.zip", "/src/"],
            linters: "addons-linter",
        },
        {
            patterns: "/src/**/*.js",
            linters: {
                eslint: ["eslint.config.js", "eslint_webext.config.js"],
            },
        },
        {
            patterns: "/test/**/*.js",
            linters: {
                eslint: [
                    "eslint.config.js",
                    "eslint_node.config.js",
                    "eslint_test.config.js",
                ],
            },
        },
        {
            patterns: "/.script/**/*.js",
            linters: {
                eslint: ["eslint.config.js", "eslint_node.config.js"],
            },
        },
        {
            patterns: "*.config.js",
            linters: {
                eslint: ["eslint.config.js", "eslint_config.config.js"],
            },
        },
        {
            patterns: "*.html",
            linters: "htmlhint",
        },
        {
            patterns: "*.tpl",
            linters: {
                htmlhint: ["htmlhint.config.js", "htmlhint_tpl.config.js"],
            },
        },
        {
            patterns: "*.css",
            linters: "stylelint",
        },
        {
            patterns: "/src/options/*.css",
            linters: { purgecss: "purgecss_options.config.js" },
        },
        {
            patterns: "/src/popup/*.css",
            linters: { purgecss: "purgecss_popup.config.js" },
        },
        {
            patterns: "*.md",
            linters: "markdownlint",
        },
        {
            patterns: "*.json",
            linters: { "jsonlint-mod": null },
        },
        {
            patterns: "/package.json",
            linters: "npm-package-json-lint",
        },
        {
            patterns: "*.yml",
            linters: { "yaml-lint": null },
        },
    ],
};
