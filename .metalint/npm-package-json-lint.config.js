/**
 * @license MIT
 * @author Sébastien Règne
 */

export default {
    rules: {
        // Require node rules.
        "require-author": "error",
        "require-bin": "off",
        "require-bugs": "error",
        "require-bundledDependencies": "off",
        "require-config": "off",
        "require-contributors": "off",
        "require-cpu": "off",
        "require-dependencies": "off",
        "require-description": "error",
        "require-devDependencies": "off",
        "require-directories": "off",
        "require-engines": "error",
        "require-files": "off",
        "require-funding": "error",
        "require-homepage": "error",
        "require-keywords": "error",
        "require-license": "error",
        "require-main": "off",
        "require-man": "off",
        "require-module": "off",
        "require-name": "error",
        "require-optionalDependencies": "off",
        "require-os": "off",
        "require-peerDependencies": "off",
        "require-preferGlobal": "off",
        "require-private": "off",
        "require-publishConfig": "off",
        "require-repository-directory": "off",
        "require-repository": "error",
        "require-scripts": "error",
        "require-type": "error",
        "require-types": "off",
        "require-typings": "off",
        "require-version": "error",

        // Type rules.
        "bin-type": "error",
        "bundledDependencies-type": "error",
        "config-type": "error",
        "cpu-type": "error",
        "dependencies-type": "error",
        "description-type": "error",
        "devDependencies-type": "error",
        "directories-type": "error",
        "engines-type": "error",
        "files-type": "error",
        "homepage-type": "error",
        "keywords-type": "error",
        "license-type": "error",
        "main-type": "error",
        "man-type": "error",
        "name-type": "error",
        "optionalDependencies-type": "error",
        "os-type": "error",
        "peerDependencies-type": "error",
        "preferGlobal-type": "error",
        "private-type": "error",
        "repository-type": "error",
        "scripts-type": "error",
        "type-type": "error",
        "version-type": "error",

        // Valid value rules.
        "valid-values-author": "off",
        "valid-values-engines": "off",
        "valid-values-license": "off",
        "valid-values-name-scope": "off",
        "valid-values-private": "off",
        "valid-values-publishConfig": "off",
        "valid-values-type": ["error", ["module"]],

        // Dependency rules.
        "no-repeated-dependencies": "error",

        "no-absolute-version-dependencies": "off",
        // Ne pas activer cette règle, car la règle
        // prefer-absolute-version-dependencies oblige les versions absolues.
        "no-archive-dependencies": "off",
        // Ne pas activer cette règle, car la règle
        // prefer-absolute-version-dependencies oblige les versions absolues.
        "no-caret-version-dependencies": "off",
        // Ne pas activer cette règle, car la règle
        // prefer-absolute-version-dependencies oblige les versions absolues.
        "no-file-dependencies": "off",
        // Ne pas activer cette règle, car la règle
        // prefer-absolute-version-dependencies oblige les versions absolues.
        "no-git-dependencies": "off",
        "no-restricted-dependencies": "off",
        "no-restricted-pre-release-dependencies": "off",
        // Ne pas activer cette règle, car la règle
        // prefer-absolute-version-dependencies oblige les versions absolues.
        "no-tilde-version-dependencies": "off",
        "prefer-absolute-version-dependencies": "error",
        "prefer-alphabetical-dependencies": "error",
        "prefer-caret-version-dependencies": "off",
        "prefer-no-version-zero-dependencies": "off",
        "prefer-tilde-version-dependencies": "off",

        "no-absolute-version-devDependencies": "off",
        // Ne pas activer cette règle, car la règle
        // prefer-absolute-version-devDependencies oblige les versions absolues.
        "no-archive-devDependencies": "off",
        // Ne pas activer cette règle, car la règle
        // prefer-absolute-version-devDependencies oblige les versions absolues.
        "no-caret-version-devDependencies": "off",
        // Ne pas activer cette règle, car la règle
        // prefer-absolute-version-devDependencies oblige les versions absolues.
        "no-file-devDependencies": "off",
        // Ne pas activer cette règle, car la règle
        // prefer-absolute-version-devDependencies oblige les versions absolues.
        "no-git-devDependencies": "off",
        "no-restricted-devDependencies": "off",
        "no-restricted-pre-release-devDependencies": "off",
        // Ne pas activer cette règle, car la règle
        // prefer-absolute-version-devDependencies oblige les versions absolues.
        "no-tilde-version-devDependencies": "off",
        "prefer-absolute-version-devDependencies": "error",
        "prefer-alphabetical-devDependencies": "error",
        "prefer-caret-version-devDependencies": "off",
        "prefer-no-version-zero-devDependencies": "off",
        "prefer-tilde-version-devDependencies": "off",

        "prefer-alphabetical-bundledDependencies": "error",

        "prefer-alphabetical-optionalDependencies": "error",

        "prefer-alphabetical-peerDependencies": "error",

        // Scripts rules.
        "prefer-alphabetical-scripts": "off",
        "prefer-scripts": "off",

        // Format rules.
        "description-format": [
            "error",
            {
                requireCapitalFirstLetter: true,
                requireEndingPeriod: true,
            },
        ],
        "name-format": "error",
        "version-format": "error",

        // Package.json property rules.
        "prefer-property-order": ["error", []],
        "no-duplicate-properties": "error",

        // Disallowed node rules.
        "prefer-no-contributors": "off",
        "prefer-no-dependencies": "off",
        "prefer-no-devDependencies": "off",
        "prefer-no-engineStrict": "off",
        "prefer-no-optionalDependencies": "off",
        "prefer-no-peerDependencies": "off",
    },
};
