"use strict";

define(function () {

    /**
     * L'identifiant de la file d'attente des vidéos.
     */
    const PLAYLIST_ID = 1;

    /**
     * L'URL de l'extension pour lire des vidéos issues de YouTube.
     */
    const PLUGIN_URL = "plugin://plugin.video.youtube/";

    /**
     * La liste des patrons des URLs gérées.
     */
    const patterns = [
        "https://www.youtube.com/watch*", "https://youtu.be/*",
        "https://m.youtube.com/watch*"
    ];

    /**
     * Extrait (éventuellement) les informations nécessaire pour lire la vidéo
     * sur Kodi.
     *
     * @param {String} url L'URL qui sera analysée.
     * @return {Promise} L'identifiant de la file d'attente et l'URL du
     *                   <em>fichier</em> ; ou <code>null</code>.
     */
    const extract = function (url) {
        if ("www.youtube.com" === url.hostname && "/watch" === url.pathname &&
                url.searchParams.has("list")) {
            return Promise.resolve({
                "playlistid": PLAYLIST_ID,
                "file":       PLUGIN_URL +
                                     "?action=play_all" +
                                     "&playlist=" + url.searchParams.get("list")
            });
        }
        if ("m.youtube.com" === url.hostname && "/playlist" === url.pathname &&
                url.searchParams.has("list")) {
            return Promise.resolve({
                "playlistid": PLAYLIST_ID,
                "file":       PLUGIN_URL +
                                     "?action=play_all" +
                                     "&playlist=" + url.searchParams.get("list")
            });
        }
        if (("www.youtube.com" === url.hostname ||
                "m.youtube.com" === url.hostname) &&
                "/watch" === url.pathname && url.searchParams.has("v")) {
            return Promise.resolve({
                "playlistid": PLAYLIST_ID,
                "file":       PLUGIN_URL +
                                         "?action=play_video" +
                                         "&videoid=" + url.searchParams.get("v")
            });
        }
        if ("youtu.be" === url.hostname) {
            return Promise.resolve({
                "playlistid": PLAYLIST_ID,
                "file":       PLUGIN_URL + "?action=play_video" +
                                           "&videoid=" + url.pathname.substr(1)
            });
        }
        return Promise.resolve(null);
    }; // extract()

    return { patterns, extract };
});
