/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import { NotificationListener } from "./notificationlistener.js";

/* eslint-disable max-len */
/**
 * @typedef {import("../tools/notificationevent.js").NotificationEvent} NotificationEvent
 * @typedef {import("./kodi.js").Kodi} Kodi
 */
/* eslint-enable max-len */

/**
 * Le client JSON-RPC pour contacter l'espace de nom <em>Playlist</em> de Kodi.
 *
 * @see https://kodi.wiki/view/JSON-RPC_API
 */
export const Playlist = class {
    /**
     * Le client pour contacter Kodi.
     *
     * @type {Kodi}
     */
    #kodi;

    /**
     * Le gestionnaire des auditeurs pour les notifications d'ajout d'un média
     * dans la liste de lecture.
     *
     * @type {NotificationListener}
     */
    onAdd = new NotificationListener();

    /**
     * Le gestionnaire des auditeurs pour les notifications de vidage de la
     * liste de lecture.
     *
     * @type {NotificationListener}
     */
    onClear = new NotificationListener();

    /**
     * Le gestionnaire des auditeurs pour les notifications d'enlèvement d'un
     * média de la liste de lecture.
     *
     * @type {NotificationListener}
     */
    onRemove = new NotificationListener();

    /**
     * Crée un client JSON-RPC pour l'espace de nom <em>Playlist</em>.
     *
     * @param {Kodi} kodi Le client pour contacter Kodi.
     */
    constructor(kodi) {
        this.#kodi = kodi;
    }

    /**
     * Ajoute un média à la liste de lecture.
     *
     * @param {string} file L'URL envoyée à Kodi.
     * @returns {Promise<string>} Une promesse contenant <code>"OK"</code>.
     */
    add(file) {
        return this.#kodi.send("Playlist.Add", {
            playlistid: 1,
            item: { file },
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
        return this.#kodi.send("Playlist.Clear", { playlistid: 1 });
    }

    /**
     * Récupère les éléments de la liste de lecture.
     *
     * @returns {Promise<Object[]>} Une promesse contenant les élements de la
     *                              liste de lecture.
     */
    async getItems() {
        const results = await this.#kodi.send("Playlist.GetItems", {
            playlistid: 1,
            properties: ["file", "title"],
        });
        return results.items?.map((i, p) => ({ ...i, position: p })) ?? [];
    }

    /**
     * Récupère un élément de la liste de lecture.
     *
     * @param {number} position La position de l'élément.
     * @returns {Promise<Object|undefined>} Une promesse contenant l'élement de
     *                                      la liste de lecture ou
     *                                      <code>undefined</code>.
     */
    async getItem(position) {
        const results = await this.#kodi.send("Playlist.GetItems", {
            playlistid: 1,
            properties: ["file", "title"],
            limits: { start: position, end: position + 1 },
        });
        return results.items?.[0];
    }

    /**
     * Insère un élément dans la liste de lecture.
     *
     * @param {string} file     L'URL envoyée à Kodi.
     * @param {number} position La position où l'élément sera inséré.
     * @returns {Promise<string>} Une promesse contenant <code>"OK"</code>.
     */
    insert(file, position) {
        return this.#kodi.send("Playlist.Insert", {
            playlistid: 1,
            position,
            item: { file },
        });
    }

    /**
     * Enlève un élément de la liste de lecture.
     *
     * @param {number} position La position de l'élément qui sera enlevé.
     * @returns {Promise<string>} Une promesse contenant <code>"OK"</code>.
     */
    remove(position) {
        return this.#kodi.send("Playlist.Remove", { playlistid: 1, position });
    }

    /**
     * Échange la position de deux éléments de la liste de lecture.
     *
     * @param {number} position1 La position de l'élément qui sera échangé.
     * @param {number} position2 La position de l'autre élément qui sera
     *                           échangé.
     * @returns {Promise<string>} Une promesse contenant <code>"OK"</code>.
     */
    swap(position1, position2) {
        return this.#kodi.send("Playlist.Swap", {
            playlistid: 1,
            position1,
            position2,
        });
    }

    /**
     * Déplace un élément dans la liste de lecture.
     *
     * @param {number} position    La position de l'élément qui sera déplacé.
     * @param {number} destination La future position de l'élément.
     * @returns {Promise<string>} Une promesse contenant <code>"OK"</code>.
     */
    async move(position, destination) {
        if (position < destination) {
            for (let i = position; i < destination - 1; ++i) {
                await this.swap(i, i + 1);
            }
        } else {
            for (let i = position; i > destination; --i) {
                await this.swap(i, i - 1);
            }
        }
        return "OK";
    }

    /**
     * Appelle les auditeurs d'une notification liée à l'espace de nom
     * <em>Playlist</em>.
     *
     * @param {NotificationEvent} notification L'évènement d'une notification
     *                                         reçu de Kodi.
     */
    async handleNotification({ method, params: { data } }) {
        // Analyser seulement les notifications venant de l'espace Playlist, si
        // des auditeurs sont présents et si elles viennent de la liste de
        // lecture des vidéos.
        if (
            !method.startsWith("Playlist.") ||
            (0 === this.onAdd.length &&
                0 === this.onClear.length &&
                0 === this.onRemove.length) ||
            1 !== data.playlistid
        ) {
            return;
        }
        switch (method.slice(9)) {
            case "OnAdd":
                this.onAdd.dispatch({
                    ...(await this.getItem(data.position)),
                    position: data.position,
                });
                break;
            case "OnClear":
                this.onClear.dispatch(undefined);
                break;
            case "OnRemove":
                this.onRemove.dispatch(data.position);
                break;
            default:
            // Ignorer les autres notifications.
        }
    }
};
