/**
 * @module
 */

/**
 * L'évènement d'une notification reçu d'un serveur JSON-RPC.
 */
export const NotificationEvent = class extends Event {

    /**
     * Crée un évènement d'une notification.
     *
     * @param {string} type          Le type de l'évènement
     *                               (<code>"notification"</code>).
     * @param {object} init          Les paramètres de l'évènement.
     * @param {string} init.method   La méthode de la notification.
     * @param {*}      [init.params] Les éventuels paramètres de la méthode.
     */
    constructor(type, { method, params }) {
        super(type);
        this.method = method;
        this.params = params;
    }
};
