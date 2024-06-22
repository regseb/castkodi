/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import { NotificationListener } from "./notificationlistener.js";

/**
 * @import { NotificationEvent } from "../tools/notificationevent.js"
 * @import { Kodi } from "./kodi.js"
 */

/**
 * Le client JSON-RPC pour contacter l'espace de nom <em>Application</em> de
 * Kodi.
 *
 * @see https://kodi.wiki/view/JSON-RPC_API
 */
export const Application = class {
    /**
     * Le client pour contacter Kodi.
     *
     * @type {Kodi}
     */
    #kodi;

    /**
     * Le gestionnaire des auditeurs pour les notifications de changement de
     * propriétés de l'application.
     *
     * @type {NotificationListener}
     */
    onPropertyChanged = new NotificationListener();

    /**
     * Crée un client JSON-RPC pour l'espace de nom <em>Application</em>.
     *
     * @param {Kodi} kodi Le client pour contacter Kodi.
     */
    constructor(kodi) {
        this.#kodi = kodi;
    }

    /**
     * Récupère des propriétés de l'espace de nom <em>Application</em> de Kodi.
     *
     * @param {string[]} properties Les noms des propriétés demandées.
     * @returns {Promise<Object>} Une promesse contenant les valeurs des
     *                            propriétés.
     */
    getProperties(properties) {
        return this.#kodi.send("Application.GetProperties", { properties });
    }

    /**
     * Coupe ou remet le son.
     *
     * @returns {Promise<boolean>} Une promesse contenant le nouvel état du son.
     */
    setMute() {
        return this.#kodi.send("Application.SetMute", { mute: "toggle" });
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
            this.#kodi.send("Application.SetMute", { mute: false }),
            this.#kodi.send("Application.SetVolume", { volume }),
        ]);
        return results[1];
    }

    /**
     * Appelle les auditeurs d'une notification liée à l'espace de nom
     * <em>Application</em>.
     *
     * @param {NotificationEvent} notification L'évènement de la notification
     *                                         reçu de Kodi.
     */
    handleNotification({ method, params: { data } }) {
        // Analyser seulement les notifications venant de l'espace Application
        // et si des auditeurs sont présents.
        if (
            !method.startsWith("Application.") ||
            0 === this.onPropertyChanged.length
        ) {
            return;
        }
        switch (method.slice(12)) {
            case "OnVolumeChanged":
                this.onPropertyChanged.dispatch(data);
                break;
            default:
            // Ignorer les autres notifications.
        }
    }
};
