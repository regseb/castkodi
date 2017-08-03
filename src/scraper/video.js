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
     * Extrait (éventuellement) les informations nécessaire pour lire la vidéo
     * sur Kodi.
     *
     * @param {String} url L'URL qui sera analysée.
     * @return {Promise} L'identifiant de la file d'attente et l'URL de la
     *                   vidéo ; ou <code>null</code>.
     */
    const extract = function (url) {
        const ext = url.pathname.substr(url.pathname.lastIndexOf(".") + 1);
        if (["asf", "avi", "flv", "mkv", "mov", "mp4", "wmv"].includes(ext)) {
            return Promise.resolve({
                "playlistid": PLAYLIST_ID,
                "file":       url.toString()
            });
        }
        return Promise.resolve(null);
    }; // extract()

    return { patterns, extract };
});
