/**
 * @module
 */

/**
 * L'évènement d'une notification reçu d'un serveur JSON-RPC.
 */
export const NotificationEvent = class extends Event {

    /**
     * La méthode de la notification.
     *
     * @type {string}
     */
    method;

    /**
     * Les éventuels paramètres de la méthode.
     *
     * @type {any}
     */
    params;

    /**
     * Crée un évènement d'une notification.
     *
     * @param {string} type          Le type de l'évènement
     *                               (<code>"notification"</code>).
     * @param {Object} init          Les paramètres de l'évènement.
     * @param {string} init.method   La méthode de la notification.
     * @param {any}    [init.params] Les éventuels paramètres de la méthode.
     */
    constructor(type, { method, params }) {
        super(type);
        this.method = method;
        this.params = params;
    }
};
