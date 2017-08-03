"use strict";

define(function () {

    /**
     * L'identifiant de la file d'attente des vidéos.
     */
    const PLAYLIST_ID = 1;

    /**
     * L'URL de l'extension pour lire des vidéos issues de Twitch.
     */
    const PLUGIN_URL = "plugin://plugin.video.twitch/";

    /**
     * La liste des patrons des URLs gérées.
     */
    const patterns = ["https://www.twitch.tv/videos/*"];

    /**
     * Extrait (éventuellement) les informations nécessaire pour lire la vidéo
     * sur Kodi.
     *
     * @param {String} url L'URL qui sera analysée.
     * @return {Promise} L'identifiant de la file d'attente et l'URL du
     *                   <em>fichier</em> ; ou <code>null</code>.
     */
    const extract = function (url) {
        if ("www.twitch.tv" === url.hostname &&
                url.pathname.startsWith("/videos/")) {
            return Promise.resolve({
                "playlistid": PLAYLIST_ID,
                "file":       PLUGIN_URL + "?mode=play" +
                                           "&video_id=" + url.pathname.substr(8)
            });
        }
        return Promise.resolve(null);
    }; // extract()

    return { patterns, extract };
});
