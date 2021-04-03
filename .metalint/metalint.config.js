export default {
    patterns: [
        "!/.git/",
        "!/coverage/",
        "!/jsdocs/",
        "!/node_modules/",
        "!/src/polyfill/lib/",
        "**",
    ],
    checkers: [
        {
            patterns: ["/build/*.zip", "/src/"],
            linters: { "addons-linter": null },
        }, {
            patterns: "/src/**/*.js",
            linters: {
                eslint: ["eslint.config.js", "eslint_webext.config.js"],
            },
        }, {
            patterns: "/test/**/*.js",
            linters: {
                eslint: [
                    "eslint.config.js",
                    "eslint_node.config.js",
                    "eslint_test.config.js",
                ],
            },
        }, {
            patterns: "/.script/**/*.js",
            linters: {
                eslint: ["eslint.config.js", "eslint_node.config.js"],
            },
        }, {
            patterns: "/.metalint/**/*.js",
            linters: {
                eslint: ["eslint.config.js", "eslint_config.config.js"],
            },
        }, {
            patterns: "/src/**/*.html",
            linters: "htmlhint",
        }, {
            patterns: "/locales/**/*.html",
            linters: {
                htmlhint: ["htmlhint.config.js", { "doctype-first": false }],
            },
        }, {
            patterns: "*.css",
            linters: "stylelint",
        }, {
            patterns: "/src/options/*.css",
            linters: { purgecss: "purgecss_options.config.js" },
        }, {
            patterns: "/src/popup/*.css",
            linters: { purgecss: "purgecss_popup.config.js" },
        }, {
            patterns: ["!/CHANGELOG.md", "*.md"],
            linters: "markdownlint",
        }, {
            patterns: "*.json",
            linters: { "jsonlint-mod": null },
        }, {
            patterns: "*.yml",
            linters: { "yaml-lint": null },
        }, {
            patterns: "/package.json",
            linters: "david",
        },
    ],
};
