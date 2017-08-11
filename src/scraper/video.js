"use strict";

define(function () {

    /**
     * L'identifiant de la file d'attente des vidéos.
     */
    const PLAYLIST_ID = 1;

    /**
     * La liste des patrons des URLs gérées.
     */
    const patterns = [
        "*://*/*.asf", "*://*/*.avi", "*://*/*.flv", "*://*/*.mkv",
        "*://*/*.mov", "*://*/*.mp4", "*://*/*.wmv"
    ];

    /**
     * Génère les informations nécessaire pour lire la video sur Kodi.
     *
     * @param {String} url L'URL d'une vidéo.
     * @return {Promise} L'identifiant de la file d'attente et l'URL de la
     *                   vidéo.
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
