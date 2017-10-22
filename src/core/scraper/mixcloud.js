"use strict";

define(["pebkac"], function (PebkacError) {

    /**
     * L'identifiant de la file d'attente des musiques.
     */
    const PLAYLIST_ID = 0;

    /**
     * L'URL de l'extension pour lire des musiques issues de Mixcloud.
     */
    const PLUGIN_URL = "plugin://plugin.audio.mixcloud/";

    /**
     * Les règles avec les patrons et leur action.
     */
    const rules = new Map();

    /**
     * Extrait les informations nécessaire pour lire une musique sur Kodi.
     *
     * @param {String} url L'URL d'une musique Mixcloud.
     * @return {Promise} L'identifiant de la file d'attente et l'URL du
     *                   <em>fichier</em>.
     */
    rules.set(["https://www.mixcloud.com/*/*/"], function (url) {
        if (url.pathname.startsWith("/discover/")) {
            return Promise.reject(new PebkacError("noaudio", "Mixcloud"));
        }

        return Promise.resolve({
            "playlistid": PLAYLIST_ID,
            "file":       PLUGIN_URL + "?mode=40&key=" +
                                                encodeURIComponent(url.pathname)
        });
    });

    return rules;
});
