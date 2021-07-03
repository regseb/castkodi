export default {
    env: {
        browser: true,
        webextensions: true,
    },

    rules: {
        // Désactiver cette règle car addons-linter rejète les await dans le
        // scope global (https://github.com/mozilla/addons-linter/issues/3741).
        "unicorn/prefer-top-level-await": 0,
    },
};
