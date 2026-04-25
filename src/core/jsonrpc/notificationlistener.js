/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

/**
 * Le gestionnaire d'auditeurs pour des notifications.
 *
 * @template {any} T Le type des données de la notification.
 */
export const NotificationListener = class {
    /**
     * Les auditeurs dans le gestionnaire.
     *
     * @type {((data: T) => any)[]}
     */
    #listeners = [];

    /**
     * Retourne le nombre d'auditeurs.
     *
     * @returns {number} Le nombre d'auditeurs.
     */
    get length() {
        return this.#listeners.length;
    }

    /**
     * Ajoute un auditeur dans le gestionnaire.
     *
     * @param {(data: T) => any} listener La fonction de l'auditeur qui sera
     *                                    appelée lors d'une notification.
     */
    addListener(listener) {
        this.#listeners.push(listener);
    }

    /**
     * Envoie une notification aux auditeurs.
     *
     * @param {T} data Les données de la notification.
     */
    dispatch(data) {
        this.#listeners.map((l) => l(data));
    }
};
