"use strict";

define([], function () {

    /**
     * L'identifiant de la file d'attente des vidéos.
     */
    const PLAYLIST_ID = 1;

    /**
     * L'URL de l'extension pour lire des vidéos issues de Twitch.
     */
    const PLUGIN_URL = "plugin://plugin.video.twitch/";

    /**
     * La liste des règles avec les patrons et leur action.
     */
    const rules = {};

    /**
     * Extrait les informations nécessaire pour lire la vidéo sur Kodi.
     *
     * @param {String} url L'URL d'une vidéo Twitch.
     * @return {Promise} L'identifiant de la file d'attente et l'URL du
     *                   <em>fichier</em>.
     */
    rules["https://www.twitch.tv/videos/*"] = function (url) {
        return Promise.resolve({
            "playlistid": PLAYLIST_ID,
            "file":       PLUGIN_URL + "?mode=play" +
                                       "&video_id=" + url.pathname.substr(8)
        });
    };

    return rules;
});
