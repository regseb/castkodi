/**
 * @module
 */

/**
 * Le gestionnaire d'auditeurs pour des notifications.
 */
export const NotificationListener = class {

    /**
     * Initialise un gestionnaire.
     */
    constructor() {

        /**
         * Les auditeurs dans le gestionnaire.
         *
         * @private
         * @type {Function[]}
         */
        this.listeners = [];
    }

    /**
     * Retourne le nombre d'auditeurs.
     *
     * @returns {number} Le nombre d'auditeurs.
     */
    get length() {
        return this.listeners.length;
    }

    /**
     * Ajoute un auditeur dans le gestionnaire.
     *
     * @param {Function} listener La fonction appelée lors d'une notification.
     */
    addListener(listener) {
        this.listeners.push(listener);
    }

    /**
     * Envoi une notification aux auditeurs.
     *
     * @param {*} data Les données de la notification.
     */
    dispatch(data) {
        this.listeners.map((l) => l(data));
    }
};
