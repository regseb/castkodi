/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

/**
 * Les erreurs spécifiques à Cast Kodi.
 *
 * @see https://fr.wikipedia.org/wiki/PEBKAC
 */
export const PebkacError = class extends Error {
    /**
     * La clé du message d'erreur.
     *
     * @type {string}
     */
    #key;

    /**
     * Les détails de l'erreur.
     *
     * @type {Object}
     */
    #details;

    /**
     * Crée une erreur avec un message et un titre.
     *
     * @param {string}          key               La clé du message d'erreur.
     * @param {string|string[]} [substitutions]   La ou les éventuelles
     *                                            substitutions qui seront
     *                                            insérées dans le message.
     * @param {Object}          [options]         Les éventuelles options de
     *                                            l'erreur.
     * @param {any}             [options.cause]   L'éventuelle cause de
     *                                            l'erreur.
     * @param {Object}          [options.details] Les éventuels détails de
     *                                            l'erreur.
     */
    constructor(key, substitutions, options) {
        super(
            browser.i18n.getMessage(
                `notifications_${key}_message`,
                substitutions,
            ),
            {
                ...(undefined === options?.cause
                    ? {}
                    : { cause: options.cause }),
            },
        );
        this.name = "PebkacError";
        this.#key = key;
        this.#details = options?.details ?? {};
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

    /**
     * Retourne les détails de l'erreur.
     *
     * @returns {Object} Les détails de l'erreur.
     */
    get details() {
        return this.#details;
    }
};
