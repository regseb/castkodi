/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

/**
 * @type {import("markdownlint").Configuration}
 */
export default {
    "heading-increment": true,
    "heading-style": { style: "atx" },
    "ul-style": { style: "dash" },
    "list-indent": true,
    "ul-indent": true,
    "no-trailing-spaces": true,
    "no-hard-tabs": true,
    "no-reversed-links": true,
    "no-multiple-blanks": true,
    // eslint-disable-next-line camelcase
    "line-length": { code_blocks: false, headings: false, stern: true },
    "commonds-show-output": true,
    "no-missing-space-atx": true,
    "no-multiple-space-atx": true,
    "no-missing-space-closed-atx": true,
    "no-multiple-space-closed-atx": true,
    "blanks-around-headings": true,
    "heading-start-left": true,
    // eslint-disable-next-line camelcase
    "no-duplicate-heading": { siblings_only: true },
    "single-title": true,
    "no-trailing-punctuation": true,
    "no-multiple-space-blockquote": true,
    "no-blanks-blockquote": true,
    "ol-prefix": { style: "ordered" },
    "list-marker-space": true,
    "blanks-around-fences": true,
    "blanks-around-lists": true,
    "no-inline-html": true,
    "no-bare-urls": true,
    "hr-style": { style: "---" },
    "no-emphasis-as-heading": true,
    "no-space-in-emphasis": true,
    "no-space-in-code": true,
    "no-space-in-links": true,
    "fenced-code-language": {
        // eslint-disable-next-line camelcase
        allowed_languages: [
            "CSS",
            "HTML",
            "JavaScript",
            "JSON",
            "Markdown",
            "Shell",
        ],
        // eslint-disable-next-line camelcase
        language_only: true,
    },
    "first-line-heading": true,
    "no-empty-links": true,
    "required-headings": true,
    "proper-names": false,
    "no-alt-text": true,
    "code-block-style": { style: "fenced" },
    "single-trailing-newline": true,
    "code-fence-style": { style: "backtick" },
    "emphasis-style": { style: "underscore" },
    "strong-style": { style: "asterisk" },
    "link-fragments": true,
    "reference-links-images": true,
    "link-image-reference-definitions": true,
};
