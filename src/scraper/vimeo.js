"use strict";

define(function () {

    /**
     * L'identifiant de la file d'attente des vidéos.
     */
    const PLAYLIST_ID = 1;

    /**
     * L'URL de l'extension pour lire des vidéos issues de Vimeo.
     */
    const PLUGIN_URL = "plugin://plugin.video.vimeo/";

    /**
     * La liste des patrons des URLs gérées.
     */
    const patterns = ["https://vimeo.com/*"];

    /**
     * Extrait (éventuellement) les informations nécessaire pour lire la vidéo
     * sur Kodi.
     *
     * @param {String} url L'URL qui sera analysée.
     * @return {Promise} L'identifiant de la file d'attente et l'URL du
     *                   <em>fichier</em> ; ou <code>null</code>.
     */
    const extract = function (url) {
        if ("vimeo.com" === url.hostname && (/^\/[0-9]+$/).test(url.pathname)) {
            return Promise.resolve({
                "playlistid": PLAYLIST_ID,
                "file":       PLUGIN_URL + "play/" +
                                           "?video_id=" + url.pathname.substr(1)
            });
        }
        return Promise.resolve(null);
    }; // extract()

    return { patterns, extract };
});
