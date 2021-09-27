/**
 * @module
 */

/**
 * Protège les caractères spéciaux pour les expressions rationnelles.
 *
 * @param {string} pattern Une chaine de caractères.
 * @returns {string} La chaine de caractères avec les caractères spéciaux
 *                   protégés.
 */
export const sanitize = function (pattern) {
    return pattern.replace(/[$()*+.?[\\\]^{|}]/gu, "\\$&");
};

/**
 * Convertis un modèle de correspondance en expression rationnelle.
 *
 * @param {string} pattern Un modèle de correspondance.
 * @returns {RegExp} L'expression rationnelle issue du modèle.
 */
export const compile = function (pattern) {
    if (pattern.startsWith("magnet:") || pattern.startsWith("acestream:")) {
        return new RegExp("^" + sanitize(pattern).replaceAll("\\*", ".*") + "$",
                          "iu");
    }

    const RE = /^(?<scheme>.+?):\/\/(?<host>\*|(?:\*\.)?[^*/]+)?\/(?<path>.*)/u;
    const { scheme, host, path } = RE.exec(pattern).groups;
    return new RegExp("^" +
        ("*" === scheme ? "https?"
                        : sanitize(scheme)) + "://" +
        ("*" === host ? "[^/]+"
                      : sanitize(host).replace("\\*", "[^./]+")) +
        "/" + sanitize(path).replaceAll("\\*", ".*") + "$", "iu");
};

/**
 * Ajoute un filtre sur l'URL en paramètre d'une fonction.
 *
 * @param {Function} func     La fonction qui sera filtrée.
 * @param {string[]} patterns Les modèles de correspondance pour filtrer l'URL.
 * @returns {Function} La fonction filtrée.
 */
export const matchPattern = function (func, ...patterns) {
    const regexes = patterns.map(compile);

    /**
     * Enrobe la fonction avec le filtre.
     *
     * @param {URL}   url    L'URL qui sera filtrée.
     * @param {any[]} others Les autres paramètres.
     * @returns {Promise<?string>} Une promesse contenant le lien du
     *                             <em>fichier</em> ou <code>null</code>.
     */
    const wrapped = (url, ...others) => {
        return regexes.some((r) => r.test(url.href)) ? func(url, ...others)
                                                     : Promise.resolve(null);
    };
    Object.defineProperty(wrapped, "name", {
        value:        func.name,
        configurable: true,
    });
    return wrapped;
};
