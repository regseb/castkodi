/**
 * @module
 */

import { NotificationListener } from "./notificationlistener.js";

/**
 * Le client JSON-RPC pour contacter l'espace de nom <em>Input</em> de Kodi.
 *
 * @see {@link https://kodi.wiki/view/JSON-RPC_API}
 */
export const Input = class {

    /**
     * Crée un client JSON-RPC pour l'espace de nom <em>Input</em>.
     *
     * @param {object}   kodi      Le client pour contacter Kodi.
     * @param {Function} kodi.send La méthode pour envoyer une requête.
     */
    constructor(kodi) {
        this.kodi = kodi;

        this.onInputRequested = new NotificationListener();
    }

    /**
     * Retourne en arrière dans l'interface.
     *
     * @returns {Promise.<string>} Une promesse contenant <code>"OK"</code>.
     */
    back() {
        return this.kodi.send("Input.Back");
    }

    /**
     * Affiche le menu contextuel.
     *
     * @returns {Promise.<string>} Une promesse contenant <code>"OK"</code>.
     */
    contextMenu() {
        return this.kodi.send("Input.ContextMenu");
    }

    /**
     * Navigue vers le bas dans l'interface.
     *
     * @returns {Promise.<string>} Une promesse contenant <code>"OK"</code>.
     */
    down() {
        return this.kodi.send("Input.Down");
    }

    /**
     * Affiche la page d'accueil de Kodi.
     *
     * @returns {Promise.<string>} Une promesse contenant <code>"OK"</code>.
     */
    home() {
        return this.kodi.send("Input.Home");
    }

    /**
     * Affiche les informations.
     *
     * @returns {Promise.<string>} Une promesse contenant <code>"OK"</code>.
     */
    info() {
        return this.kodi.send("Input.Info");
    }

    /**
     * Navigue vers la gauche dans l'interface.
     *
     * @returns {Promise.<string>} Une promesse contenant <code>"OK"</code>.
     */
    left() {
        return this.kodi.send("Input.Left");
    }

    /**
     * Navigue vers la droite dans l'interface.
     *
     * @returns {Promise.<string>} Une promesse contenant <code>"OK"</code>.
     */
    right() {
        return this.kodi.send("Input.Right");
    }

    /**
     * Sélectionne l'élément courant.
     *
     * @returns {Promise.<string>} Une promesse contenant <code>"OK"</code>.
     */
    select() {
        return this.kodi.send("Input.Select");
    }

    /**
     * Envoie du texte.
     *
     * @param {string}  text Le texte envoyé.
     * @param {boolean} done La marque indiquant s'il faut fermer la boite de
     *                       saisie.
     * @returns {Promise.<string>} Une promesse contenant <code>"OK"</code>.
     */
    sendText(text, done) {
        return this.kodi.send("Input.SendText", { text, done });
    }

    /**
     * Affiche le <em>menu à l'écran</em> (<em>On Screen Display</em>) du
     * lecteur courant.
     *
     * @returns {Promise.<string>} Une promesse contenant <code>"OK"</code>.
     */
    showOSD() {
        return this.kodi.send("Input.ShowOSD");
    }

    /**
     * Affiche les informations sur le processus de lecture.
     *
     * @returns {Promise.<string>} Une promesse contenant <code>"OK"</code>.
     */
    showPlayerProcessInfo() {
        return this.kodi.send("Input.ShowPlayerProcessInfo");
    }

    /**
     * Navigue vers le haut dans l'interface.
     *
     * @returns {Promise.<string>} Une promesse contenant <code>"OK"</code>.
     */
    up() {
        return this.kodi.send("Input.Up");
    }

    /**
     * Appelle les auditeurs d'une notification liée à l'espace de nom
     * <em>Input</em>.
     *
     * @param {object} notification             La notification reçu de Kodi.
     * @param {string} notification.method      La méthode de la notification.
     * @param {object} notification.params      Les paramètres de la méthode.
     * @param {*}      notification.params.data Les données des paramètres.
     */
    handleNotification({ method, params: { data } }) {
        // Garder seulement les notifications sur les entrées et si des
        // auditeurs sont présents.
        if (!method.startsWith("Input.") ||
                0 === this.onInputRequested.length) {
            return;
        }
        switch (method) {
            case "Input.OnInputRequested":
                this.onInputRequested.dispatch(data);
                break;
            default:
                // Ignorer les autres notifications.
        }
    }
};
