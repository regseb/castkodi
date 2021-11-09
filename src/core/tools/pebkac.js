/**
 * @module
 */

/**
 * Les erreurs spécifiques à Cast Kodi.
 */
export const PebkacError = class extends Error {

    /**
     * La clé du message d'erreur.
     *
     * @type {string}
     */
    #key;

    /**
     * Crée une erreur avec un message et un titre.
     *
     * @param {string}          key             La clé du message d'erreur.
     * @param {string|string[]} [substitutions] La ou les éventuelles
     *                                          substitutions qui seront
     *                                          insérées dans le message.
     */
    constructor(key, substitutions = []) {
        super(browser.i18n.getMessage(`notifications_${key}_message`,
                                      substitutions));
        this.name = "PebkacError";
        this.#key = key;
    }

    /**
     * Retourne le type de l'erreur.
     *
     * @returns {string} Le type de l'erreur.
     */
    get type() {
        return this.#key;
    }

    /**
     * Retourne le titre de l'erreur.
     *
     * @returns {string} Le titre de l'erreur.
     */
    get title() {
        return browser.i18n.getMessage(`notifications_${this.#key}_title`);
    }
};
