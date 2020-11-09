/**
 * La prothèse de la classe <code>Event</code>.
 *
 * @see {@link https://developer.mozilla.org/docs/Web/API/Event/Event}
 */
export const Event = class {

    /**
     * Crée un évènement lambda.
     *
     * @param {string} type Le nom du type de l'évènement.
     */
    constructor(type) {

        /**
         * Le nom du type de l'évènement.
         *
         * @type {string}
         */
        this.type = type;
    }
};
