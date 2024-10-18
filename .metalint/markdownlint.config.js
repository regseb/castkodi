/**
 * @license MIT
 * @author Sébastien Règne
 */

/**
 * @import { ConfigurationStrict } from "markdownlint"
 */

/**
 * @type {ConfigurationStrict}
 */
export default {
    "heading-increment": true,
    // Désactiver les règles de style et laisser Prettier formatter les
    // fichiers.
    // https://github.com/DavidAnson/markdownlint/blob/main/doc/Prettier.md
    "heading-style": false,
    "ul-style": false,
    "list-indent": false,
    "ul-indent": false,
    "no-trailing-spaces": false,
    "no-hard-tabs": false,
    "no-reversed-links": true,
    "no-multiple-blanks": false,
    "line-length": false,
    "commands-show-output": true,
    "no-missing-space-atx": false,
    "no-multiple-space-atx": false,
    "no-missing-space-closed-atx": false,
    "no-multiple-space-closed-atx": false,
    "blanks-around-headings": false,
    "heading-start-left": false,
    // eslint-disable-next-line camelcase
    "no-duplicate-heading": { siblings_only: true },
    "single-title": true,
    "no-trailing-punctuation": true,
    "no-multiple-space-blockquote": false,
    "no-blanks-blockquote": false,
    "ol-prefix": false,
    "list-marker-space": false,
    "blanks-around-fences": false,
    "blanks-around-lists": false,
    "no-inline-html": true,
    "no-bare-urls": true,
    "hr-style": false,
    "no-emphasis-as-heading": true,
    "no-space-in-emphasis": true,
    "no-space-in-code": true,
    "no-space-in-links": true,
    "fenced-code-language": {
        // eslint-disable-next-line camelcase
        allowed_languages: [
            "css",
            "html",
            "javascript",
            "json",
            "markdown",
            "shell",
            "yaml",
        ],
        // eslint-disable-next-line camelcase
        language_only: true,
    },
    "first-line-heading": true,
    "no-empty-links": true,
    "required-headings": true,
    // Désactiver cette règle, car il n'y a pas de mots à vérifier.
    "proper-names": false,
    "no-alt-text": true,
    "code-block-style": { style: "fenced" },
    "single-trailing-newline": true,
    "code-fence-style": false,
    "emphasis-style": false,
    "strong-style": false,
    "link-fragments": true,
    "reference-links-images": true,
    "link-image-reference-definitions": true,
    // eslint-disable-next-line camelcase
    "link-image-style": { shortcut: false, url_inline: false },
    "table-pipe-style": { style: "leading_and_trailing" },
    "table-column-count": true,
    "blanks-around-tables": false,
};
