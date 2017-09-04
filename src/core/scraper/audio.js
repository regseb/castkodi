"use strict";

define(function () {

    /**
     * L'identifiant de la file d'attente des musiques.
     */
    const PLAYLIST_ID = 0;

    /**
     * Les règles avec les patrons et leur action.
     */
    const rules = new Map();

    /**
     * Extrait les informations nécessaire pour lire la musique sur Kodi.
     *
     * @param {String} url L'URL d'un fichier audio.
     * @return {Promise} L'identifiant de la file d'attente et l'URL du fichier.
     */
    rules.set([
        "*://*/*.aac", "*://*/*.flac", "*://*/*.m4a", "*://*/*.mka",
        "*://*/*.mp3", "*://*/*.ogg", "*://*/*.pls"
    ], function (url) {
        return Promise.resolve({
            "playlistid": PLAYLIST_ID,
            "file":       url.toString()
        });
    });

    return rules;
});
