export default {
    plugins: ["stylelint-order"],

    rules: {
        // POSSIBLE ERRORS.
        // Color.
        "color-no-invalid-hex": true,

        // Font family.
        "font-family-no-duplicate-names": true,
        "font-family-no-missing-generic-family-keyword": true,

        // Named grid areas.
        "named-grid-areas-no-invalid": true,

        // Function.
        "function-calc-no-unspaced-operator": true,
        "function-linear-gradient-no-nonstandard-direction": true,
        "function-no-unknown": true,

        // String.
        "string-no-newline": true,

        // Unit.
        "unit-no-unknown": true,

        // Custom property.
        "custom-property-no-missing-var-function": true,

        // Property.
        "property-no-unknown": true,

        // Keyframe declaration.
        "keyframe-declaration-no-important": true,

        // Declaration block.
        "declaration-block-no-duplicate-custom-properties": true,
        "declaration-block-no-duplicate-properties": true,
        "declaration-block-no-shorthand-property-overrides": true,

        // Block.
        "block-no-empty": [true, { ignore: ["comments"] }],

        // Selector.
        "selector-pseudo-class-no-unknown": true,
        "selector-pseudo-element-no-unknown": true,
        "selector-type-no-unknown": [true, { ignore: ["custom-elements"] }],

        // Media feature.
        "media-feature-name-no-unknown": true,

        // At-rule.
        "at-rule-no-unknown": true,

        // Comment.
        "comment-no-empty": true,

        // General / Sheet.
        "no-descending-specificity": null,
        "no-duplicate-at-import-rules": true,
        "no-duplicate-selectors": true,
        "no-empty-source": true,
        "no-extra-semicolons": true,
        "no-invalid-double-slash-comments": true,
        "no-invalid-position-at-import-rule": true,

        // LIMIT LANGUAGE FEATURES.
        // Alpha-value.
        "alpha-value-notation": "percentage",

        // Hue.
        "hue-degree-notation": "angle",

        // Color.
        "color-function-notation": "modern",
        "color-hex-alpha": null,
        "color-named": "always-where-possible",
        "color-no-hex": null,

        // Length.
        "length-zero-no-unit": true,

        // Font weight.
        "font-weight-notation": ["named-where-possible", {
            ignore: ["relative"],
        }],

        // Function.
        "function-allowed-list": null,
        "function-disallowed-list": null,
        "function-url-no-scheme-relative": null,
        "function-url-scheme-allowed-list": null,
        "function-url-scheme-disallowed-list": null,

        // Keyframes.
        "keyframes-name-pattern": "^[a-z][0-9a-z]*(-[0-9a-z]+)*$",

        // Number.
        "number-max-precision": 2,

        // Time.
        "time-min-milliseconds": 100,

        // Unit.
        "unit-allowed-list": null,
        "unit-disallowed-list": null,

        // Shorthand property.
        "shorthand-property-no-redundant-values": true,

        // Value.
        "value-no-vendor-prefix": true,

        // Custom property.
        "custom-property-pattern": null,

        // Property.
        "property-allowed-list": null,
        "property-disallowed-list": null,
        "property-no-vendor-prefix": [true, {
            ignoreProperties: ["appearance"],
        }],

        // Declaration.
        "declaration-block-no-redundant-longhand-properties": true,
        "declaration-no-important": true,
        "declaration-property-unit-allowed-list": null,
        "declaration-property-unit-disallowed-list": null,
        "declaration-property-value-allowed-list": null,
        "declaration-property-value-disallowed-list": null,

        // Declaration block.
        "declaration-block-single-line-max-declarations": 1,

        // Selector.
        "selector-attribute-name-disallowed-list": null,
        "selector-attribute-operator-allowed-list": null,
        "selector-attribute-operator-disallowed-list": null,
        "selector-class-pattern": "^([a-z][0-9a-z]*(-[0-9a-z]+)*" +
                                                            "|Chrome|Firefox)$",
        "selector-combinator-allowed-list": null,
        "selector-combinator-disallowed-list": null,
        "selector-disallowed-list": null,
        "selector-id-pattern": "^[a-z][0-9a-z]*(-[0-9a-z]+)*$",
        "selector-max-attribute": null,
        "selector-max-class": null,
        "selector-max-combinators": null,
        "selector-max-compound-selectors": null,
        "selector-max-empty-lines": 0,
        "selector-max-id": 1,
        "selector-max-pseudo-class": 3,
        "selector-max-specificity": null,
        "selector-max-type": null,
        "selector-max-universal": 1,
        "selector-nested-pattern": null,
        "selector-no-qualifying-type": null,
        "selector-no-vendor-prefix": true,
        "selector-pseudo-class-allowed-list": null,
        "selector-pseudo-class-disallowed-list": null,
        "selector-pseudo-element-allowed-list": null,
        "selector-pseudo-element-colon-notation": "double",
        "selector-pseudo-element-disallowed-list": null,

        // Rules.
        "rule-selector-property-disallowed-list": null,

        // Media feature.
        "media-feature-name-allowed-list": null,
        "media-feature-name-disallowed-list": null,
        "media-feature-name-no-vendor-prefix": true,
        "media-feature-name-value-allowed-list": null,

        // Custom media.
        "custom-media-pattern": null,

        // At-rule.
        "at-rule-allowed-list": null,
        "at-rule-disallowed-list": null,
        "at-rule-no-vendor-prefix": true,
        "at-rule-property-required-list": null,

        // Comment.
        "comment-pattern": null,
        "comment-word-disallowed-list": [["/^TODO /", "/^FIXME /"], {
            severity: "warning",
        }],

        // General / Sheet.
        "max-nesting-depth": null,
        "no-unknown-animations": true,

        // STYLISTIC ISSUES.
        // Color.
        "color-hex-case": "lower",
        "color-hex-length": "long",

        // Font family.
        "font-family-name-quotes": "always-where-recommended",

        // Function.
        "function-comma-newline-after": null,
        "function-comma-newline-before": null,
        "function-comma-space-after": "always-single-line",
        "function-comma-space-before": "never",
        "function-max-empty-lines": 0,
        "function-name-case": "lower",
        "function-parentheses-newline-inside": "always-multi-line",
        "function-parentheses-space-inside": "never-single-line",
        "function-url-quotes": "always",
        "function-whitespace-after": "always",

        // Number.
        "number-leading-zero": "always",
        "number-no-trailing-zeros": true,

        // String.
        "string-quotes": "double",

        // Unit.
        "unit-case": "lower",

        // Value.
        "value-keyword-case": "lower",

        // Value list.
        "value-list-comma-newline-after": "always-multi-line",
        "value-list-comma-newline-before": "never-multi-line",
        "value-list-comma-space-after": "always-single-line",
        "value-list-comma-space-before": "never",
        "value-list-max-empty-lines": 0,

        // Custom property.
        "custom-property-empty-line-before": null,

        // Property.
        "property-case": "lower",

        // Declaration.
        "declaration-bang-space-after": "never",
        "declaration-bang-space-before": "always",
        "declaration-colon-newline-after": "always-multi-line",
        "declaration-colon-space-after": "always-single-line",
        "declaration-colon-space-before": "never",
        "declaration-empty-line-before": true,

        // Declaration block.
        "declaration-block-semicolon-newline-after": "always-multi-line",
        "declaration-block-semicolon-newline-before": "never-multi-line",
        "declaration-block-semicolon-space-after": "always-single-line",
        "declaration-block-semicolon-space-before": "never",
        "declaration-block-trailing-semicolon": "always",

        // Block.
        "block-closing-brace-empty-line-before": "never",
        "block-closing-brace-newline-after": "always",
        "block-closing-brace-newline-before": "always-multi-line",
        "block-closing-brace-space-after": null,
        "block-closing-brace-space-before": "always-single-line",
        "block-opening-brace-newline-after": "always-multi-line",
        "block-opening-brace-newline-before": null,
        "block-opening-brace-space-after": "always-single-line",
        "block-opening-brace-space-before": "always-multi-line",

        // Selector.
        "selector-attribute-brackets-space-inside": "never",
        "selector-attribute-operator-space-after": "never",
        "selector-attribute-operator-space-before": "never",
        "selector-attribute-quotes": "always",
        "selector-combinator-space-after": "always",
        "selector-combinator-space-before": "always",
        "selector-descendant-combinator-no-non-space": true,
        "selector-pseudo-class-case": "lower",
        "selector-pseudo-class-parentheses-space-inside": "never",
        "selector-pseudo-element-case": "lower",
        "selector-type-case": "lower",

        // Selector list.
        "selector-list-comma-newline-after": "always-multi-line",
        "selector-list-comma-newline-before": "never-multi-line",
        "selector-list-comma-space-after": "always-single-line",
        "selector-list-comma-space-before": "never",

        // Rule.
        "rule-empty-line-before": null,

        // Media feature.
        "media-feature-colon-space-after": "always",
        "media-feature-colon-space-before": "never",
        "media-feature-name-case": "lower",
        "media-feature-parentheses-space-inside": "never",
        "media-feature-range-operator-space-after": "always",
        "media-feature-range-operator-space-before": "always",

        // Media query list.
        "media-query-list-comma-newline-after": "always-multi-line",
        "media-query-list-comma-newline-before": "never-multi-line",
        "media-query-list-comma-space-after": "always",
        "media-query-list-comma-space-before": "never",

        // At-rule.
        "at-rule-empty-line-before": null,
        "at-rule-name-case": "lower",
        "at-rule-name-newline-after": null,
        "at-rule-name-space-after": "always",
        "at-rule-semicolon-newline-after": "always",
        "at-rule-semicolon-space-before": "never",

        // Comment.
        "comment-empty-line-before": null,
        "comment-whitespace-inside": "always",

        // General / Sheet.
        indentation: 4,
        linebreaks: "unix",
        "max-empty-lines": 2,
        "max-line-length": [80, { severity: "warning" }],
        "no-eol-whitespace": true,
        "no-missing-end-of-source-newline": true,
        "no-empty-first-line": true,
        "unicode-bom": "never",
        "no-irregular-whitespace": true,

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
