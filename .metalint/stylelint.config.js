/**
 * @license MIT
 * @see https://stylelint.io/user-guide/rules
 * @see https://github.com/hudochenkov/stylelint-order#rules
 * @author Sébastien Règne
 */

/**
 * @import { Config } from "stylelint"
 */

/**
 * @type {Config}
 */
export default {
    plugins: ["stylelint-order"],

    rules: {
        // AVOID ERRORS.
        // Deprecated.
        "at-rule-no-deprecated": true,
        "declaration-property-value-keyword-no-deprecated": true,
        "media-type-no-deprecated": true,
        "property-no-deprecated": true,

        // Descending.
        "no-descending-specificity": undefined,

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
        "at-rule-prelude-no-invalid": true,
        "color-no-invalid-hex": true,
        "function-calc-no-unspaced-operator": true,
        "keyframe-declaration-no-important": true,
        "media-query-no-invalid": true,
        "named-grid-areas-no-invalid": true,
        "no-invalid-double-slash-comments": true,
        "no-invalid-position-at-import-rule": true,
        "no-invalid-position-declaration": true,
        "string-no-newline": true,
        "syntax-string-no-invalid": true,

        // Irregular.
        "no-irregular-whitespace": true,

        // Missing.
        "custom-property-no-missing-var-function": true,
        "font-family-no-missing-generic-family-keyword": true,
        "nesting-selector-no-missing-scoping-root": true,

        // Non-standard.
        "function-linear-gradient-no-nonstandard-direction": true,

        // Overrides
        "declaration-block-no-shorthand-property-overrides": true,

        // Unmatchable
        "selector-anb-no-unmatchable": true,

        // Unknown.
        "annotation-no-unknown": true,
        "at-rule-descriptor-no-unknown": true,
        "at-rule-descriptor-value-no-unknown": true,
        "at-rule-no-unknown": true,
        "declaration-property-value-no-unknown": true,
        "function-no-unknown": true,
        "media-feature-name-no-unknown": true,
        "media-feature-name-value-no-unknown": true,
        "no-unknown-animations": true,
        "no-unknown-custom-media": true,
        // Désactiver cette règle, car les variables sont déclarées dans
        // d'autres fichiers.
        "no-unknown-custom-properties": undefined,
        "property-no-unknown": true,
        "selector-pseudo-class-no-unknown": true,
        "selector-pseudo-element-no-unknown": true,
        "selector-type-no-unknown": [true, { ignore: ["custom-elements"] }],
        "unit-no-unknown": true,

        // ENFORCE NON-STYLISTIC CONVENTIONS.
        // Allowed, disallowed & required.
        // At-rule.
        "at-rule-allowed-list": undefined,
        "at-rule-disallowed-list": undefined,
        "at-rule-no-vendor-prefix": true,
        "at-rule-property-required-list": undefined,

        // Color.
        "color-hex-alpha": undefined,
        "color-named": "always-where-possible",
        "color-no-hex": undefined,

        // Comment.
        "comment-word-disallowed-list": [
            ["/^TODO /", "/^FIXME /"],
            {
                severity: "warning",
            },
        ],

        // Declaration.
        "declaration-no-important": true,
        "declaration-property-unit-allowed-list": undefined,
        "declaration-property-unit-disallowed-list": undefined,
        "declaration-property-value-allowed-list": undefined,
        "declaration-property-value-disallowed-list": undefined,

        // Function.
        "function-allowed-list": undefined,
        "function-disallowed-list": undefined,
        "function-url-no-scheme-relative": undefined,
        "function-url-scheme-allowed-list": undefined,
        "function-url-scheme-disallowed-list": undefined,

        // Length.
        "length-zero-no-unit": true,

        // Media feature.
        "media-feature-name-allowed-list": undefined,
        "media-feature-name-disallowed-list": undefined,
        "media-feature-name-no-vendor-prefix": true,
        "media-feature-name-unit-allowed-list": undefined,
        "media-feature-name-value-allowed-list": undefined,

        // Property.
        "property-allowed-list": undefined,
        "property-disallowed-list": undefined,
        "property-no-vendor-prefix": [
            true,
            {
                ignoreProperties: ["appearance"],
            },
        ],

        // Rules.
        "rule-nesting-at-rule-required-list": undefined,
        "rule-selector-property-disallowed-list": undefined,

        // Selector.
        "selector-attribute-name-disallowed-list": undefined,
        "selector-attribute-operator-allowed-list": undefined,
        "selector-attribute-operator-disallowed-list": undefined,
        "selector-combinator-allowed-list": undefined,
        "selector-combinator-disallowed-list": undefined,
        "selector-disallowed-list": undefined,
        "selector-no-qualifying-type": undefined,
        "selector-no-vendor-prefix": true,
        "selector-pseudo-class-allowed-list": undefined,
        "selector-pseudo-class-disallowed-list": undefined,
        "selector-pseudo-element-allowed-list": undefined,
        "selector-pseudo-element-disallowed-list": undefined,

        // Unit.
        "unit-allowed-list": undefined,
        "unit-disallowed-list": undefined,

        // Value.
        "value-no-vendor-prefix": true,

        // Case.
        "function-name-case": "lower",
        "selector-type-case": "lower",
        "value-keyword-case": "lower",

        // Empty lines.
        "at-rule-empty-line-before": undefined,
        "comment-empty-line-before": undefined,
        "custom-property-empty-line-before": undefined,
        "declaration-empty-line-before": true,
        "rule-empty-line-before": undefined,

        // Max & min.
        "declaration-block-single-line-max-declarations": 1,
        "declaration-property-max-values": undefined,
        "max-nesting-depth": undefined,
        "number-max-precision": 2,
        "selector-max-attribute": undefined,
        "selector-max-class": undefined,
        "selector-max-combinators": undefined,
        "selector-max-compound-selectors": undefined,
        "selector-max-id": 1,
        "selector-max-pseudo-class": 3,
        "selector-max-specificity": undefined,
        "selector-max-type": undefined,
        "selector-max-universal": 1,
        "time-min-milliseconds": 100,

        // Notation.
        "alpha-value-notation": "percentage",
        "color-function-alias-notation": "without-alpha",
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
        "lightness-notation": "percentage",
        "media-feature-range-notation": "context",
        "selector-not-notation": "complex",
        "selector-pseudo-element-colon-notation": "double",

        // Pattern.
        "comment-pattern": undefined,
        "container-name-pattern": /^[a-z][0-9a-z]*(?:-[0-9a-z]+)*$/v,
        "custom-media-pattern": undefined,
        "custom-property-pattern": undefined,
        "keyframes-name-pattern": /^[a-z][0-9a-z]*(?:-[0-9a-z]+)*$/v,
        "layer-name-pattern": /^[a-z][0-9a-z]*(?:-[0-9a-z]+)*$/v,
        "selector-class-pattern": /^[a-z][0-9a-z]*(?:-[0-9a-z]+)*$/v,
        "selector-id-pattern": /^[a-z][0-9a-z]*(?:-[0-9a-z]+)*$/v,
        "selector-nested-pattern": undefined,

        // Quotes.
        "font-family-name-quotes": "always-where-recommended",
        "function-url-quotes": "always",
        "selector-attribute-quotes": "always",

        // Redundant.
        "block-no-redundant-nested-style-rules": true,
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
        "order/properties-order": undefined,
        "order/properties-alphabetical-order": true,
    },
};
