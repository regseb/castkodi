"use strict";

define(function () {

    /**
     * L'identifiant de la file d'attente des fichiers audio.
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
     * Extrait (éventuellement) les informations nécessaire pour lire le fichier
     * audio sur Kodi.
     *
     * @param {String} url L'URL qui sera analysée.
     * @return {Promise} L'identifiant de la file d'attente et l'URL du
     *                   fichier audio ; ou <code>null</code>.
     */
    const extract = function (url) {
        const ext = url.pathname.substr(url.pathname.lastIndexOf(".") + 1);
        if (["aac", "flac", "*m4a", "mka", "mp3", "ogg", "pls"].includes(ext)) {
            return Promise.resolve({
                "playlistid": PLAYLIST_ID,
                "file":       url.toString()
            });
        }
        return Promise.resolve(null);
    }; // extract()

    return { patterns, extract };
});
