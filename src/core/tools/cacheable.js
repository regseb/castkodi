/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

/**
 * Stocke en cache le retour d'une fonction pour les prochains appels.
 *
 * @param {Function} func La fonction dont le retour sera mis en cache.
 * @returns {Function} La fonction avec le cache.
 */
export const cacheable = function (func) {
    /**
     * Les résultats déjà mis en cache selon les paramètres reçus.
     *
     * @type {Map<string, any>}
     */
    const cache = new Map();

    /**
     * Enrobe la fonction avec le cache.
     *
     * @param {any[]} args Les paramètres retransmits à la fonction.
     * @returns {any} Le retour de la fonction (éventuellement récupéré dans le
     *                cache).
     */
    const wrapped = function (...args) {
        const key = JSON.stringify(args);
        if (cache.has(key)) {
            return cache.get(key);
        }

        const value = func(...args);
        cache.set(key, value);
        return value;
    };

    Object.defineProperty(wrapped, "name", {
        value: func.name,
        configurable: true,
    });
    return wrapped;
};
