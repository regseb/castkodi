"use strict";

define(function () {

    /**
     * L'identifiant de la file d'attente des fichiers audio.
     */
    const PLAYLIST_ID = 0;

    /**
     * L'URL de l'extension pour lire des musiques issues de SoundCloud.
     */
    const PLUGIN_URL = "plugin://plugin.audio.soundcloud/";

    /**
     * La liste des patrons des URLs gérées.
     */
    const patterns = ["https://soundcloud.com/*"];

    /**
     * Extrait (éventuellement) les informations nécessaire pour lire la vidéo
     * sur Kodi.
     *
     * @param {String} url L'URL qui sera analysée.
     * @return {Promise} L'identifiant de la file d'attente et l'URL du
     *                   <em>fichier</em> ; ou <code>null</code>.
     */
    const extract = function (url) {
        if ("soundcloud.com" === url.hostname &&
                0 !== url.pathname.lastIndexOf("/"))  {
            return fetch("https://soundcloud.com/oembed?url=" +
                         encodeURIComponent(url)).then(function (response) {
                return response.text();
            }).then(function (response) {
                const RE = /api.soundcloud.com%2Ftracks%2F([^&]+)&/;
                return {
                    "playlistid": PLAYLIST_ID,
                    "file":       PLUGIN_URL + "play/" +
                                             "?audio_id=" + RE.exec(response)[1]
                };
            });
        }
        return Promise.resolve(null);
    }; // extract()

    return { patterns, extract };
});
