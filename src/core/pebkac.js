/**
 * @module
 */

/**
 * Les erreurs spécifiques à Cast Kodi.
 */
export const PebkacError = class extends Error {

    /**
     * Crée une erreur avec un message et un titre.
     *
     * @param {string}          key                La clé du message d'erreur.
     * @param {string|string[]} [substitutions=[]] La ou les éventuelles
     *                                             substitutions qui seront
     *                                             insérées dans le message.
     */
    constructor(key, substitutions = []) {
        super(browser.i18n.getMessage("notifications_" + key + "_message",
                                      substitutions));
        this.name = "PebkacError";
        this.type = key;
        this.title = browser.i18n.getMessage("notifications_" + key + "_title");
    }
};
