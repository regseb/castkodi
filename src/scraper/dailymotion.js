"use strict";

define([], function () {

    /**
     * L'identifiant de la file d'attente des vidéos.
     */
    const PLAYLIST_ID = 1;

    /**
     * L'URL de l'extension pour lire des vidéos issues de Dailymotion.
     */
    const PLUGIN_URL = "plugin://plugin.video.dailymotion_com/";

    /**
     * La liste des règles avec les patrons et leur action.
     */
    const rules = {};

    /**
     * Extrait les informations nécessaire pour lire la vidéo sur Kodi.
     *
     * @param {String} url L'URL d'une vidéo Dailymotion.
     * @return {Promise} L'identifiant de la file d'attente et l'URL du
     *                   <em>fichier</em>.
     */
    rules["*://www.dailymotion.com/video/*"] = function (url) {
        return Promise.resolve({
            "playlistid": PLAYLIST_ID,
            "file":       PLUGIN_URL + "?mode=playVideo" +
                                       "&url=" + url.pathname.substr(7)
        });
    };

    /**
     * Extrait les informations nécessaire pour lire la vidéo sur Kodi.
     *
     * @param {String} url L'URL minifié d'une vidéo Dailymotion.
     * @return {Promise} L'identifiant de la file d'attente et l'URL du
     *                   <em>fichier</em>.
     */
    rules["*://dai.ly/*"] = function (url) {
        return Promise.resolve({
            "playlistid": PLAYLIST_ID,
            "file":       PLUGIN_URL + "?mode=playVideo" +
                                       "&url=" + url.pathname.substr(1)
        });
    };

    return rules;
});
