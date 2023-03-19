/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

export default {
    plugins: ["stylelint-order"],

    rules: {
        // AVOID ERRORS.
        // Descending.
        "no-descending-specificity": null,

        // Duplicate.
        "declaration-block-no-duplicate-custom-properties": true,
        "declaration-block-no-duplicate-properties": true,
        "font-family-no-duplicate-names": true,
        "keyframe-block-no-duplicate-selectors": true,
        "no-duplicate-at-import-rules": true,
        "no-duplicate-selectors": true,

        // Empty.
        "block-no-empty": [true, { ignore: ["comments"] }],
        "comment-no-empty": true,
        "no-empty-source": true,

        // Invalid.
        "color-no-invalid-hex": true,
        "function-calc-no-unspaced-operator": true,
        "keyframe-declaration-no-important": true,
        "named-grid-areas-no-invalid": true,
        "no-invalid-double-slash-comments": true,
        "no-invalid-position-at-import-rule": true,
        "string-no-newline": true,

        // Irregular.
        "no-irregular-whitespace": true,

        // Missing.
        "custom-property-no-missing-var-function": true,
        "font-family-no-missing-generic-family-keyword": true,

        // Non-stantard.
        "function-linear-gradient-no-nonstandard-direction": true,

        // Overrides
        "declaration-block-no-shorthand-property-overrides": true,

        // Unmatchable
        "selector-anb-no-unmatchable": true,

        // Unknown.
        "annotation-no-unknown": true,
        "at-rule-no-unknown": true,
        "declaration-property-value-no-unknown": true,
        "function-no-unknown": true,
        "media-feature-name-no-unknown": true,
        "no-unknown-animations": true,
        "property-no-unknown": true,
        "selector-pseudo-class-no-unknown": true,
        "selector-pseudo-element-no-unknown": true,
        "selector-type-no-unknown": [true, { ignore: ["custom-elements"] }],
        "unit-no-unknown": true,

        // ENFORCE NON-STYLISTIC CONVENTIONS.
        // Allowed, disallowed & required.
        // At-rule.
        "at-rule-allowed-list": null,
        "at-rule-disallowed-list": null,
        "at-rule-no-vendor-prefix": true,
        "at-rule-property-required-list": null,

        // Color.
        "color-hex-alpha": null,
        "color-named": "always-where-possible",
        "color-no-hex": null,

        // Comment.
        "comment-word-disallowed-list": [
            ["/^TODO /", "/^FIXME /"],
            {
                severity: "warning",
            },
        ],

        // Declaration.
        "declaration-no-important": true,
        "declaration-property-unit-allowed-list": null,
        "declaration-property-unit-disallowed-list": null,
        "declaration-property-value-allowed-list": null,
        "declaration-property-value-disallowed-list": null,

        // Function.
        "function-allowed-list": null,
        "function-disallowed-list": null,
        "function-url-no-scheme-relative": null,
        "function-url-scheme-allowed-list": null,
        "function-url-scheme-disallowed-list": null,

        // Length.
        "length-zero-no-unit": true,

        // Media feature.
        "media-feature-name-allowed-list": null,
        "media-feature-name-disallowed-list": null,
        "media-feature-name-no-vendor-prefix": true,
        "media-feature-name-unit-allowed-list": null,
        "media-feature-name-value-allowed-list": null,

        // Property.
        "property-allowed-list": null,
        "property-disallowed-list": null,
        "property-no-vendor-prefix": [
            true,
            {
                ignoreProperties: ["appearance"],
            },
        ],

        // Rules.
        "rule-selector-property-disallowed-list": null,

        // Selector.
        "selector-attribute-name-disallowed-list": null,
        "selector-attribute-operator-allowed-list": null,
        "selector-attribute-operator-disallowed-list": null,
        "selector-combinator-allowed-list": null,
        "selector-combinator-disallowed-list": null,
        "selector-disallowed-list": null,
        "selector-no-qualifying-type": null,
        "selector-no-vendor-prefix": true,
        "selector-pseudo-class-allowed-list": null,
        "selector-pseudo-class-disallowed-list": null,
        "selector-pseudo-element-allowed-list": null,
        "selector-pseudo-element-disallowed-list": null,

        // Unit.
        "unit-allowed-list": null,
        "unit-disallowed-list": null,

        // Value.
        "value-no-vendor-prefix": true,

        // Case.
        "function-name-case": "lower",
        "selector-type-case": "lower",
        "value-keyword-case": "lower",

        // Empty lines.
        "at-rule-empty-line-before": null,
        "comment-empty-line-before": null,
        "custom-property-empty-line-before": null,
        "declaration-empty-line-before": true,
        "rule-empty-line-before": null,

        // Max & min.
        "declaration-block-single-line-max-declarations": 1,
        "declaration-property-max-values": null,
        "max-nesting-depth": null,
        "number-max-precision": 2,
        "selector-max-attribute": null,
        "selector-max-class": null,
        "selector-max-combinators": null,
        "selector-max-compound-selectors": null,
        "selector-max-id": 1,
        "selector-max-pseudo-class": 3,
        "selector-max-specificity": null,
        "selector-max-type": null,
        "selector-max-universal": 1,
        "time-min-milliseconds": 100,

        // Notation.
        "alpha-value-notation": "percentage",
        "color-function-notation": "modern",
        "color-hex-length": "long",
        "font-weight-notation": [
            "named-where-possible",
            {
                ignore: ["relative"],
            },
        ],
        "hue-degree-notation": "angle",
        "import-notation": "string",
        "keyframe-selector-notation": "keyword",
        "media-feature-range-notation": "context",
        "selector-not-notation": "complex",
        "selector-pseudo-element-colon-notation": "double",

        // Pattern.
        "comment-pattern": null,
        "custom-media-pattern": null,
        "custom-property-pattern": null,
        "keyframes-name-pattern": "^[a-z][0-9a-z]*(-[0-9a-z]+)*$",
        "selector-class-pattern":
            "^([a-z][0-9a-z]*(-[0-9a-z]+)*|Chromium|Firefox)$",
        "selector-id-pattern": "^[a-z][0-9a-z]*(-[0-9a-z]+)*$",
        "selector-nested-pattern": null,

        // Quotes.
        "font-family-name-quotes": "always-where-recommended",
        "function-url-quotes": "always",
        "selector-attribute-quotes": "always",

        // Redundant.
        "declaration-block-no-redundant-longhand-properties": true,
        "shorthand-property-no-redundant-values": true,

        // Whitespace inside.
        "comment-whitespace-inside": "always",

        // PLUGIN STYLELINT-ORDER.
        "order/order": [
            "custom-properties",
            "dollar-variables",
            "at-variables",
            "declarations",
            "rules",
            "at-rules",
        ],
        "order/properties-order": null,
        "order/properties-alphabetical-order": true,
    },
};
