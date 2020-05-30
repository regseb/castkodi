/**
 * @module
 */

import { NotificationListener } from "./notificationlistener.js";

/**
 * Le client JSON-RPC pour contacter l'espace de nom <em>Playlist</em> de Kodi.
 *
 * @see {@link https://kodi.wiki/view/JSON-RPC_API}
 */
export const Playlist = class {

    /**
     * Crée un client JSON-RPC pour l'espace de nom <em>Playlist</em>.
     *
     * @param {object}   kodi      Le client pour contacter Kodi.
     * @param {Function} kodi.send La méthode pour envoyer une requête.
     */
    constructor(kodi) {
        this.kodi = kodi;

        this.onAdd    = new NotificationListener();
        this.onClear  = new NotificationListener();
        this.onRemove = new NotificationListener();
    }

    /**
     * Ajoute un média à la liste de lecture.
     *
     * @param {string} file L'URL envoyée à Kodi.
     * @returns {Promise.<string>} Une promesse contenant <code>"OK"</code>.
     */
    async add(file) {
        var currentPlayerId;
        currentPlayerId = await this.kodi.getCurrentPlayerId();
        if (isNaN(currentPlayerId)) {
            return this.kodi.player.openItem(file);
        } else {
            return this.kodi.send("Playlist.Add", {
                playlistid: await this.kodi.getCurrentPlayerId(),
                item:       { file },
            });
        }
    }

    /**
     * Vide la liste de lecture.
     *
     * @returns {Promise.<string>} Une promesse contenant <code>"OK"</code>.
     */
    async clear() {
        return this.kodi.send("Playlist.Clear", { playlistid: await this.kodi.getCurrentPlayerId() });
    }

    /**
     * Récupère les éléments de la liste de lecture.
     *
     * @returns {Promise.<Array.<object>>} Une promesse contenant les élements
     *                                     de la liste de lecture.
     */
    async getItems() {
        const results = await this.kodi.send("Playlist.GetItems", {
            playlistid: await this.kodi.getCurrentPlayerId(),
            properties: ["file"],
        });
        return "items" in results ? results.items
                                  : [];
    }

    /**
     * Récupère un élément de la liste de lecture.
     *
     * @param {number} position La position de l'élément.
     * @returns {Promise.<?object>} Une promesse contenant l'élement de la liste
     *                              de lecture ou <code>null</code>.
     */
    async getItem(position) {
        const results = await this.kodi.send("Playlist.GetItems", {
            playlistid: await this.kodi.getCurrentPlayerId(),
            properties: ["file"],
            limits:     { start: position, end: position + 1 },
        });
        return "items" in results ? results.items[0]
                                  : null;
    }

    /**
     * Insère un élément dans la liste de lecture.
     *
     * @param {string} file     L'URL envoyée à Kodi.
     * @param {number} position La position où le média sera inséré.
     * @returns {Promise.<string>} Une promesse contenant <code>"OK"</code>.
     */
    async insert(file, position) {
        return this.kodi.send("Playlist.Insert", {
            playlistid: await this.kodi.getCurrentPlayerId(),
            position,
            item:       { file },
        });
    }

    /**
     * Enlève un élément de la liste de lecture.
     *
     * @param {number} position La position de l'élément qui sera enlevé.
     * @returns {Promise.<string>} Une promesse contenant <code>"OK"</code>.
     */
    async remove(position) {
        return this.kodi.send("Playlist.Remove", {
            playlistid: await this.kodi.getCurrentPlayerId(),
            position,
        });
    }

    /**
     * Appelle les auditeurs d'une notification liée à l'espace de nom
     * <em>Playlist</em>.
     *
     * @param {object} notification             La notification reçu de Kodi.
     * @param {string} notification.method      La méthode de la notification.
     * @param {object} notification.params      Les paramètres de la méthode.
     * @param {*}      notification.params.data Les données des paramètres.
     */
    handleNotification({ method, params: { data } }) {
        // Garder seulement les notifications de la liste de lecture des vidéos.
        if (!method.startsWith("Playlist.")) {
            return;
        }
        switch (method) {
            case "Playlist.OnAdd":
                this.onAdd.dispatch(data);
                break;
            case "Playlist.OnClear":
                this.onClear.dispatch(data);
                break;
            case "Playlist.OnRemove":
                this.onRemove.dispatch(data);
                break;
            default:
                // Ignorer les autres notifications.
        }
    }
};
