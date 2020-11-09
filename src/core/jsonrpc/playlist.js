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
     * @param {Object}   kodi      Le client pour contacter Kodi.
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
     * @returns {Promise<string>} Une promesse contenant <code>"OK"</code>.
     */
    add(file) {
        return this.kodi.send("Playlist.Add", {
            playlistid: 1,
            item:       { file },
        });
    }

    /**
     * Vide la liste de lecture.
     *
     * @returns {Promise<string>} Une promesse contenant <code>"OK"</code>.
     */
    clear() {
        // Attention ! Le vidage de la liste de lecture interrompt la continuité
        // de lecture. https://github.com/xbmc/xbmc/issues/15958
        return this.kodi.send("Playlist.Clear", { playlistid: 1 });
    }

    /**
     * Récupère les éléments de la liste de lecture.
     *
     * @returns {Promise<Object[]>} Une promesse contenant les élements de la
     *                              liste de lecture.
     */
    async getItems() {
        const results = await this.kodi.send("Playlist.GetItems", {
            playlistid: 1,
            properties: ["file"],
        });
        return results.items?.map((i, p) => ({ ...i, position: p })) ?? [];
    }

    /**
     * Récupère un élément de la liste de lecture.
     *
     * @param {number} position La position de l'élément.
     * @returns {Promise<?Object>} Une promesse contenant l'élement de la liste
     *                             de lecture ou <code>null</code>.
     */
    async getItem(position) {
        const results = await this.kodi.send("Playlist.GetItems", {
            playlistid: 1,
            properties: ["file"],
            limits:     { start: position, end: position + 1 },
        });
        return results.items?.[0] ?? null;
    }

    /**
     * Insère un élément dans la liste de lecture.
     *
     * @param {string} file     L'URL envoyée à Kodi.
     * @param {number} position La position où l'élément sera inséré.
     * @returns {Promise<string>} Une promesse contenant <code>"OK"</code>.
     */
    insert(file, position) {
        return this.kodi.send("Playlist.Insert", {
            playlistid: 1,
            position,
            item:       { file },
        });
    }

    /**
     * Enlève un élément de la liste de lecture.
     *
     * @param {number} position La position de l'élément qui sera enlevé.
     * @returns {Promise<string>} Une promesse contenant <code>"OK"</code>.
     */
    remove(position) {
        return this.kodi.send("Playlist.Remove", {
            playlistid: 1,
            position,
        });
    }

    /**
     * Appelle les auditeurs d'une notification liée à l'espace de nom
     * <em>Playlist</em>.
     *
     * @param {Object} notification             La notification reçu de Kodi.
     * @param {string} notification.method      La méthode de la notification.
     * @param {Object} notification.params      Les paramètres de la méthode.
     * @param {*}      notification.params.data Les données des paramètres.
     */
    async handleNotification({ method, params: { data } }) {
        // Garder seulement les notifications de la liste de lecture des vidéos
        // et si des auditeurs sont présents.
        if (!method.startsWith("Playlist.") || 1 !== data.playlistid ||
                0 === this.onAdd.length + this.onClear.length +
                      this.onRemove.length) {
            return;
        }
        switch (method) {
            case "Playlist.OnAdd":
                this.onAdd.dispatch({
                    ...await this.getItem(data.position),
                    position: data.position,
                });
                break;
            case "Playlist.OnClear":
                this.onClear.dispatch(undefined);
                break;
            case "Playlist.OnRemove":
                this.onRemove.dispatch(data.position);
                break;
            default:
                // Ignorer les autres notifications.
        }
    }
};
