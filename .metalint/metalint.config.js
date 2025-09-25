/**
 * @license MIT
 * @see https://github.com/regseb/metalint
 * @author Sébastien Règne
 */

/**
 * @import { Config } from "metalint/types"
 */

/**
 * @type {Config}
 */
export default {
    patterns: [
        "**",
        // Ignorer les répertoires et les fichiers générés.
        "!/.git/**",
        "!/.stryker/**",
        "!/build/**",
        "!/jsdocs/**",
        "!/node_modules/**",
        "!/src/polyfill/lib/**",
        "!/stryker.log",
        // Ignorer les fichiers de configuration de Visual Studio Code.
        "!/.vscode/**",
        // Ignorer les fichiers de configuration des IDEs de JetBrains :
        // WebStorm, IntelliJ IDEA...
        "!/.idea/**",
        // Ignorer les fichiers temporaires de Vim.
        "!*.swp",
        // Ignorer les autres lockfiles.
        "!/bun.lockb",
        "!/pnpm-lock.yaml",
        "!/yarn.lock",
    ],
    checkers: [
        {
            patterns: "/src/",
            linters: "addons-linter",
        },
        {
            patterns: "*.js",
            linters: ["prettier", "prettier_javascript", "eslint"],
            overrides: [
                {
                    patterns: "/src/**",
                    linters: "eslint_webext",
                },
                {
                    patterns: "/test/**",
                    linters: ["eslint_node", "eslint_test"],
                },
                {
                    patterns: "/.script/**",
                    linters: "eslint_node",
                },
                {
                    patterns: "*.config.js",
                    linters: ["eslint_node", "eslint_config"],
                },
            ],
        },
        {
            patterns: "*.html",
            linters: ["prettier", "htmlhint"],
        },
        {
            patterns: "*.css",
            linters: ["prettier", "prettier_css", "stylelint"],
            overrides: [
                {
                    patterns: "/src/options/**",
                    linters: "purgecss_options",
                },
                {
                    patterns: "/src/popup/**",
                    linters: "purgecss_popup",
                },
            ],
        },
        {
            patterns: "*.md",
            linters: ["prettier", "markdownlint"],
            overrides: {
                // Utiliser des règles spécifiques pour les fichiers des
                // boutiques.
                patterns: "/locales/**",
                linters: ["prettier_store", "markdownlint_store"],
            },
        },
        {
            patterns: "*.json",
            linters: ["prettier", "prantlf__jsonlint"],
            overrides: [
                {
                    patterns: "/package.json",
                    linters: "npm-package-json-lint",
                },
                // Indenter avec quatre espaces les fichiers des messages i18n
                // pour avoir le même format que Weblate.
                {
                    patterns: ["/locales/**", "/src/_locales/**"],
                    linters: "prettier_messages",
                },
            ],
        },
        {
            patterns: "*.yml",
            linters: ["prettier", "yaml-lint"],
        },
        {
            patterns: "*.svg",
            linters: "prettier",
        },
    ],
};
