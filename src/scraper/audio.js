"use strict";

define(function () {

    /**
     * L'identifiant de la file d'attente des musiques.
     */
    const PLAYLIST_ID = 0;

    /**
     * La liste des patrons des URLs gérées.
     */
    const patterns = [
        "*://*/*.aac", "*://*/*.flac", "*://*/*.m4a", "*://*/*.mka",
        "*://*/*.mp3", "*://*/*.ogg", "*://*/*.pls"
    ];

    /**
     * Génère les informations nécessaire pour lire le fichier audio sur Kodi.
     *
     * @param {String} url L'URL de la musique.
     * @return {Promise} L'identifiant de la file d'attente et l'URL de la
     *                   musique.
     */
    const action = function (url) {
        return Promise.resolve({
            "playlistid": PLAYLIST_ID,
            "file":       url.toString()
        });
    }; // action()

    return patterns.reduce(function (rules, pattern) {
        rules[pattern] = action;
        return rules;
    }, {});
});
