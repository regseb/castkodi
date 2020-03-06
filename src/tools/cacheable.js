/**
 * @module
 */

/**
 * Stocke en cache le retour d'une méthode pour les prochains appels.
 *
 * @function
 * @param {Function} func La fonction dont le retour sera mis en cache.
 * @returns {Function} La fonction avec le cache.
 */
export const cacheable = function (func) {
    let cache = undefined;

    /**
     * Enrobe la fonction avec le cache.
     *
     * @returns {*} Le retour de la fonction (éventuellement récupéré dans le
     *              cache).
     */
    const wrapped = () => {
        if (undefined === cache) {
            cache = func();
        }
        return cache;
    };

    Object.defineProperty(wrapped, "name", {
        value:        func.name,
        configurable: true,
    });
    return wrapped;
};
