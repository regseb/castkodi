/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

// Ajouter une prothèse pour la nouvelle méthode `RegExp.escape()`.
// https://github.com/tc39/proposal-regex-escaping
// https://issues.chromium.org/353856236
// https://bugzil.la/1918235
// https://github.com/orgs/nodejs/discussions/37488
if (!("escape" in RegExp)) {
    RegExp.escape = (text) => {
        return text.replaceAll(/[$()*+.?[\\\]^{|}]/gu, String.raw`\$&`);
    };
}
