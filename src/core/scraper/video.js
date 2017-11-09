"use strict";

define(function () {

    /**
     * L'identifiant de la file d'attente des vidéos.
     */
    const PLAYLIST_ID = 1;

    /**
     * Les règles avec les patrons et leur action.
     */
    const rules = new Map();

    /**
     * Extrait les informations nécessaire pour lire la vidéo sur Kodi.
     *
     * @param {String} url L'URL d'une vidéo.
     * @return {Promise} L'identifiant de la file d'attente et l'URL du fichier.
     */
    rules.set([
        "*://*/*asf", "*://*/*avi", "*://*/*flv", "*://*/*mkv", "*://*/*mov",
        "*://*/*mp4", "*://*/*m4v", "*://*/*wmv"
    ], function (url) {
        return Promise.resolve({
            "playlistid": PLAYLIST_ID,
            "file":       url.toString()
        });
    });

    return rules;
});
