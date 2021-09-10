/**
 * @module
 */

import { NotificationListener } from "./notificationlistener.js";

/**
 * Le client JSON-RPC pour contacter l'espace de nom <em>Application</em> de
 * Kodi.
 *
 * @see https://kodi.wiki/view/JSON-RPC_API
 */
export const Application = class {

    /**
     * Crée un client JSON-RPC pour l'espace de nom <em>Application</em>.
     *
     * @param {import("./kodi.js").Kodi} kodi Le client pour contacter Kodi.
     */
    constructor(kodi) {

        /**
         * Le client pour contacter Kodi.
         *
         * @private
         * @type {import("./kodi.js").Kodi}
         */
        this._kodi = kodi;

        /**
         * Le gestionnaire des auditeurs pour les notifications de changement
         * de propriétés de l'application.
         *
         * @type {NotificationListener}
         */
        this.onPropertyChanged = new NotificationListener();
    }

    /**
     * Récupère des propriétés de l'espace de nom <em>Application</em> de Kodi.
     *
     * @param {string[]} properties Les noms des propriétés demandées.
     * @returns {Promise<Object>} Une promesse contenant les valeurs des
     *                            propriétés.
     */
    getProperties(properties) {
        return this._kodi.send("Application.GetProperties", { properties });
    }

    /**
     * Coupe ou remet le son.
     *
     * @returns {Promise<boolean>} Une promesse contenant le nouvel état du son.
     */
    setMute() {
        return this._kodi.send("Application.SetMute", { mute: "toggle" });
    }

    /**
     * Change le volume et remet le son.
     *
     * @param {number|string} volume Le nouveau volume (entre <code>0</code> et
     *                               <code>100</code>) ; ou
     *                               <code>"increment"</code> /
     *                               <code>"decrement"</code> pour augmenter ou
     *                               diminuer le volume d'un cran.
     * @returns {Promise<number>} Une promesse contenant la nouvelle valeur du
     *                            son.
     */
    async setVolume(volume) {
        const results = await Promise.all([
            this._kodi.send("Application.SetMute", { mute: false }),
            this._kodi.send("Application.SetVolume", { volume }),
        ]);
        return results[1];
    }

    /**
     * Appelle les auditeurs d'une notification liée à l'espace de nom
     * <em>Application</em>.
     *
     * @param {Object} notification             La notification reçu de Kodi.
     * @param {string} notification.method      La méthode de la notification.
     * @param {Object} notification.params      Les paramètres de la méthode.
     * @param {any}    notification.params.data Les données des paramètres.
     */
    handleNotification({ method, params: { data } }) {
        // Garder seulement les notifications sur l'application et si des
        // auditeurs sont présents.
        if (!method.startsWith("Application.") ||
                0 === this.onPropertyChanged.length) {
            return;
        }
        switch (method) {
            case "Application.OnVolumeChanged":
                this.onPropertyChanged.dispatch(data);
                break;
            default:
                // Ignorer les autres notifications.
        }
    }
};
