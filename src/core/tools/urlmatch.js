/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

/**
 * URL avec les groupes nommés du patron.
 *
 * @typedef {URL & Record<string, string>} URLMatch
 */

/**
 * Enrobe une fonction avec un filtre d'URL.
 *
 * @param {Function}                      func     La fonction à enrober.
 * @param {...(URLPattern|string|Object)} patterns Les patrons pour filtrer
 *                                                 l'URL.
 * @returns {Function} La fonction enrobée.
 */
export const matchURLPattern = (func, ...patterns) => {
    const urlPatterns = patterns.map((p) =>
        p instanceof URLPattern ? p : new URLPattern(p),
    );

    /**
     * Exécute la fonction si l'URL respecte une des patrons.
     *
     * @param {URL}    url    L'URL qui sera filtrée.
     * @param {...any} others Les autres paramètres.
     * @returns {Promise<any|undefined>} Une promesse contenant le retour de la
     *                                   fonction ; ou `undefined` si l'URL ne
     *                                   respecte pas un des patrons.
     */
    const wrapped = (url, ...others) => {
        for (const urlPattern of urlPatterns) {
            const match = urlPattern.exec(url);
            if (null !== match) {
                const urlMatch = /** @type {URLMatch} */ (new URL(url));
                const groups = {
                    ...match.protocol.groups,
                    ...match.username.groups,
                    ...match.password.groups,
                    ...match.hostname.groups,
                    ...match.port.groups,
                    ...match.pathname.groups,
                    ...match.search.groups,
                    ...match.hash.groups,
                };
                for (const [key, value] of Object.entries(groups)) {
                    Object.defineProperty(urlMatch, key, { value });
                }
                return func(urlMatch, ...others);
            }
        }
        return Promise.resolve();
    };
    Object.defineProperty(wrapped, "name", {
        value: func.name,
        configurable: true,
    });
    return wrapped;
};
