/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

/**
 * Convertis un modèle de correspondance en expression rationnelle.
 *
 * @param {string} pattern Un modèle de correspondance.
 * @returns {RegExp} L'expression rationnelle issue du modèle.
 * @see https://developer.mozilla.org/Add-ons/WebExtensions/Match_patterns
 */
export const compile = (pattern) => {
    if (pattern.startsWith("magnet:") || pattern.startsWith("acestream:")) {
        return new RegExp(
            "^" + RegExp.escape(pattern).replaceAll(String.raw`\*`, ".*") + "$",
            "iu",
        );
    }

    const RE = /^(?<scheme>.+?):\/\/(?<host>.+?)\/(?<path>.*)/u;
    const { scheme, host, path } = RE.exec(pattern).groups;
    return new RegExp(
        "^" +
            ("*" === scheme ? "https?" : RegExp.escape(scheme)) +
            "://" +
            ("*" === host
                ? "[^/]+"
                : RegExp.escape(host).replace(String.raw`\*`, "[^./]+")) +
            "/" +
            RegExp.escape(path).replaceAll(String.raw`\*`, ".*") +
            "$",
        "iu",
    );
};

/**
 * Ajoute un filtre sur l'URL en paramètre d'une fonction.
 *
 * @param {Function}  func     La fonction qui sera filtrée.
 * @param {...string} patterns Les modèles de correspondance pour filtrer l'URL.
 * @returns {Function} La fonction filtrée.
 * @see https://developer.mozilla.org/Add-ons/WebExtensions/Match_patterns
 */
export const matchPattern = (func, ...patterns) => {
    const regexes = patterns.map(compile);

    /**
     * Enrobe la fonction avec un filtre.
     *
     * @param {URL}    url    L'URL qui sera filtrée.
     * @param {...any} others Les autres paramètres.
     * @returns {Promise<any|undefined>} Une promesse contenant le retour de la
     *                                   fonction ; ou `undefined` si l'URL ne
     *                                   respecte pas un des modèles de
     *                                   correspondance.
     */
    const wrapped = (url, ...others) => {
        return regexes.some((r) => r.test(url.href))
            ? func(url, ...others)
            : Promise.resolve();
    };
    Object.defineProperty(wrapped, "name", {
        value: func.name,
        configurable: true,
    });
    return wrapped;
};
