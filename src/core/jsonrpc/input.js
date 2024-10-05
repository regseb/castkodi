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
 * Le client JSON-RPC pour contacter l'espace de nom _Input_ de Kodi.
 *
 * @see https://kodi.wiki/view/JSON-RPC_API
 */
export const Input = class {
    /**
     * Le client pour contacter Kodi.
     *
     * @type {Kodi}
     */
    #kodi;

    /**
     * Le gestionnaire des auditeurs pour les notifications de demande de
     * saisie.
     *
     * @type {NotificationListener}
     */
    onInputRequested = new NotificationListener();

    /**
     * Crée un client JSON-RPC pour l'espace de nom _Input_.
     *
     * @param {Kodi} kodi Le client pour contacter Kodi.
     */
    constructor(kodi) {
        this.#kodi = kodi;
    }

    /**
     * Retourne en arrière dans l'interface.
     *
     * @returns {Promise<string>} Une promesse contenant `"OK"`.
     */
    back() {
        return this.#kodi.send("Input.Back");
    }

    /**
     * Affiche le menu contextuel.
     *
     * @returns {Promise<string>} Une promesse contenant `"OK"`.
     */
    contextMenu() {
        return this.#kodi.send("Input.ContextMenu");
    }

    /**
     * Navigue vers le bas dans l'interface.
     *
     * @returns {Promise<string>} Une promesse contenant `"OK"`.
     */
    down() {
        return this.#kodi.send("Input.Down");
    }

    /**
     * Affiche la page d'accueil de Kodi.
     *
     * @returns {Promise<string>} Une promesse contenant `"OK"`.
     */
    home() {
        return this.#kodi.send("Input.Home");
    }

    /**
     * Affiche les informations.
     *
     * @returns {Promise<string>} Une promesse contenant `"OK"̀`.
     */
    info() {
        return this.#kodi.send("Input.Info");
    }

    /**
     * Navigue vers la gauche dans l'interface.
     *
     * @returns {Promise<string>} Une promesse contenant `"OK"`.
     */
    left() {
        return this.#kodi.send("Input.Left");
    }

    /**
     * Navigue vers la droite dans l'interface.
     *
     * @returns {Promise<string>} Une promesse contenant `"OK"`.
     */
    right() {
        return this.#kodi.send("Input.Right");
    }

    /**
     * Sélectionne l'élément courant.
     *
     * @returns {Promise<string>} Une promesse contenant `"OK"`.
     */
    select() {
        return this.#kodi.send("Input.Select");
    }

    /**
     * Envoie du texte.
     *
     * @param {string}  text Le texte envoyé.
     * @param {boolean} done La marque indiquant s'il faut fermer la boite de
     *                       saisie.
     * @returns {Promise<string>} Une promesse contenant `"OK"`.
     */
    sendText(text, done) {
        return this.#kodi.send("Input.SendText", { text, done });
    }

    /**
     * Affiche le _menu à l'écran_ (_On Screen Display_) du lecteur courant.
     *
     * @returns {Promise<string>} Une promesse contenant `"OK"`.
     */
    showOSD() {
        return this.#kodi.send("Input.ShowOSD");
    }

    /**
     * Affiche les informations sur le processus de lecture.
     *
     * @returns {Promise<string>} Une promesse contenant `"OK"`.
     */
    showPlayerProcessInfo() {
        return this.#kodi.send("Input.ShowPlayerProcessInfo");
    }

    /**
     * Navigue vers le haut dans l'interface.
     *
     * @returns {Promise<string>} Une promesse contenant `"OK"`.
     */
    up() {
        return this.#kodi.send("Input.Up");
    }

    /**
     * Appelle les auditeurs d'une notification liée à l'espace de nom _Input_.
     *
     * @param {NotificationEvent} notification L'évènement d'une notification
     *                                         reçu de Kodi.
     */
    handleNotification({ method, params: { data } }) {
        // Analyser seulement les notifications venant de l'espace Input et si
        // des auditeurs sont présents.
        if (
            !method.startsWith("Input.") ||
            0 === this.onInputRequested.length
        ) {
            return;
        }
        switch (method.slice(6)) {
            case "OnInputRequested":
                this.onInputRequested.dispatch(data);
                break;
            default:
            // Ignorer les autres notifications.
        }
    }
};
