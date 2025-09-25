/**
 * @license MIT
 * @see https://htmlhint.com/rules/
 * @author Sébastien Règne
 */

export default {
    // Doctype and Head.
    "doctype-first": true,
    "doctype-html5": true,
    "head-script-disabled": true,
    "html-lang-require": false,
    "meta-charset-require": true,
    "meta-description-require": false,
    "meta-viewport-require": true,
    "link-rel-canonical-require": false,
    "script-disabled": false,
    "style-disabled": true,
    "title-require": true,

    // Attributes.
    "alt-require": true,
    "attr-lowercase": true,
    "attr-no-duplication": true,
    "attr-no-unnecessary-whitespace": true,
    "attr-sorted": true,
    "attr-unsafe-chars": true,
    "attr-value-double-quotes": true,
    "attr-value-no-duplication": true,
    "attr-value-not-empty": false,
    "attr-value-single-quotes": false,
    "attr-whitespace": true,
    "button-type-require": true,
    // Désactiver cette règle, car les formulaires ne sont pas soumis (les
    // valeurs sont récupérées en JavaScript).
    "form-method-require": false,
    "input-requires-label": false,

    // Tags.
    "empty-tag-not-self-closed": false,
    "frame-title-require": true,
    "h1-require": false,
    "href-abs-or-rel": false,
    "main-require": false,
    "src-not-empty": true,
    "tag-no-obsolete": true,
    "tag-pair": true,
    "tag-self-close": false,
    "tagname-lowercase": true,
    "tagname-specialchars": true,
    "tags-check": false,

    // Id.
    "id-class-ad-disabled": true,
    "id-class-value": "dash",
    "id-unique": true,

    // Inline.
    "inline-script-disabled": true,
    "inline-style-disabled": true,

    // Formatting.
    "space-tab-mixed-disabled": "space",
    "spec-char-escape": true,
};
