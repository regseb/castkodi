/**
 * @license MIT
 * @see https://biomejs.dev/reference/configuration/
 * @author Sébastien Règne
 */

/**
 * @import { Configuration } from "@biomejs/js-api/nodejs"
 */

/**
 * Seuls les linters de Biome sont utilisés et seulement les règles exclusives
 * à Biome.
 *
 * @type {Configuration}
 */
export default {
    formatter: { enabled: false },
    linter: {
        rules: {
            recommended: false,
            a11y: {
                // https://biomejs.dev/linter/javascript/sources/
                noSvgWithoutTitle: "off",
            },
            complexity: {
                // https://biomejs.dev/linter/javascript/sources/
                noEmptyTypeParameters: "off",
                noUselessContinue: "error",
                noUselessStringRaw: "error",
                useSimpleNumberKeys: "error",
                useSimplifiedLogicExpression: "error",
                // Utiliser cette règle à la place de la règle ESLint
                // prefer-arrow-callback, car la règle d'ESLint est incompatible
                // avec Prettier et on ne peut pas désactiver le fix d'une
                // règle. https://github.com/eslint/eslint/issues/18696
                useArrowFunction: "error",
            },
            correctness: {
                // https://biomejs.dev/linter/javascript/sources/
                noRenderReturnValue: "off",
                noUnusedFunctionParameters: "error",
                noVoidTypeReturn: "off",
                useImportExtensions: "off",
                useJsonImportAttributes: "off",
                useUniqueElementIds: "off",
            },
            performance: {
                // https://biomejs.dev/linter/javascript/sources/
                noAccumulatingSpread: "error",
                noDelete: "error",
                noDynamicNamespaceImportAccess: "error",
                useTopLevelRegex: "off",
            },
            style: {
                // https://biomejs.dev/linter/javascript/sources/
                noEnum: "off",
                noExportedImports: "error",
                noShoutyConstants: "error",
                noUnusedTemplateLiteral: "error",
                useNodeAssertStrict: "error",

                // ESLint.
                // Préférer cette règle à la règle "prefer-template" de ESLint,
                // car elle gère mieux les retours à la ligne.
                useTemplate: "error",
            },
            suspicious: {
                // https://biomejs.dev/linter/javascript/sources/
                noConstEnum: "off",
                noEvolvingTypes: "off",
                noGlobalIsFinite: "error",
                noGlobalIsNan: "error",
                noImplicitAnyLet: "off",
                noRedundantUseStrict: "error",
                noSuspiciousSemicolonInJsx: "off",
                noUselessEscapeInString: "error",
                useStaticResponseMethods: "error",
                useStrictMode: "error",

                // https://biomejs.dev/linter/json/sources/
                // Désactiver certaines règles qui sont spécifiques pour des
                // fichiers de configuration de Biome.
                noBiomeFirstException: "off",
                noDuplicateObjectKeys: "error",
                noQuickfixBiome: "off",
                useBiomeIgnoreFolder: "off",
            },
        },
    },
    assist: {
        actions: {
            recommended: false,
        },
    },
};
