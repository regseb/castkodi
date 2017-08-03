"use strict";

define(function () {

    /**
     * L'identifiant de la file d'attente des vidéos.
     */
    const PLAYLIST_ID = 1;

    /**
     * L'URL de l'extension pour lire des vidéos issues de Dailymotion.
     */
    const PLUGIN_URL = "plugin://plugin.video.dailymotion_com/";

    /**
     * La liste des patrons des URLs gérées.
     */
    const patterns = ["*://www.dailymotion.com/video/*", "*://dai.ly/*"];

    /**
     * Extrait (éventuellement) les informations nécessaire pour lire la vidéo
     * sur Kodi.
     *
     * @param {String} url L'URL qui sera analysée.
     * @return {Promise} L'identifiant de la file d'attente et l'URL du
     *                   <em>fichier</em> ; ou <code>null</code>.
     */
    const extract = function (url) {
        if ("www.dailymotion.com" === url.hostname &&
                url.pathname.startsWith("/video/")) {
            return Promise.resolve({
                "playlistid": PLAYLIST_ID,
                "file":       PLUGIN_URL + "?mode=playVideo" +
                                           "&url=" + url.pathname.substr(7)
            });
        }
        if ("dai.ly" === url.hostname) {
            return Promise.resolve({
                "playlistid": PLAYLIST_ID,
                "file":       PLUGIN_URL + "?mode=playVideo" +
                                           "&url=" + url.pathname.substr(1)
            });
        }
        return Promise.resolve(null);
    }; // extract()

    return { patterns, extract };
});
