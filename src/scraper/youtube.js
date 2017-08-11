"use strict";

define(["pebkac"], function (PebkacError) {

    /**
     * L'identifiant de la file d'attente des vidéos.
     */
    const PLAYLIST_ID = 1;

    /**
     * L'URL de l'extension pour lire des vidéos issues de YouTube.
     */
    const PLUGIN_URL = "plugin://plugin.video.youtube/";

    /**
     * La liste des règles avec les patrons et leur action.
     */
    const rules = {};

    /**
     * Extrait les informations nécessaire pour lire la vidéo sur Kodi.
     *
     * @param {String} url L'URL d'une playlist ou vidéo YouTube.
     * @return {Promise} L'identifiant de la file d'attente et l'URL du
     *                   <em>fichier</em>.
     */
    rules["https://www.youtube.com/watch*"] = function (url) {
        if (url.searchParams.has("list")) {
            return Promise.resolve({
                "playlistid": PLAYLIST_ID,
                "file":       PLUGIN_URL +
                                     "?action=play_all" +
                                     "&playlist=" + url.searchParams.get("list")
            });
        }
        if (url.searchParams.has("v")) {
            return Promise.resolve({
                "playlistid": PLAYLIST_ID,
                "file":       PLUGIN_URL +
                                         "?action=play_video" +
                                         "&videoid=" + url.searchParams.get("v")
            });
        }

        return Promise.reject(new PebkacError("novideo", "YouTube"));
    };

    /**
     * Extrait les informations nécessaire pour lire la vidéo sur Kodi.
     *
     * @param {String} url L'URL minifié d'une vidéo YouTube.
     * @return {Promise} L'identifiant de la file d'attente et l'URL du
     *                   <em>fichier</em>.
     */
    rules["https://youtu.be/*"] = function (url) {
        return Promise.resolve({
            "playlistid": PLAYLIST_ID,
            "file":       PLUGIN_URL + "?action=play_video" +
                                       "&videoid=" + url.pathname.substr(1)
        });
    };

    /**
     * Extrait les informations nécessaire pour lire la vidéo sur Kodi.
     *
     * @param {String} url L'URL d'une vidéo YouTube (version mobile).
     * @return {Promise} L'identifiant de la file d'attente et l'URL du
     *                   <em>fichier</em>.
     */
    rules["https://m.youtube.com/watch*"] = function (url) {
        if (!url.searchParams.has("v")) {
            return Promise.reject(new PebkacError("novideo", "YouTube"));
        }

        return Promise.resolve({
            "playlistid": PLAYLIST_ID,
            "file":       PLUGIN_URL + "?action=play_video" +
                                       "&videoid=" + url.searchParams.get("v")
        });
    };

    /**
     * Extrait les informations nécessaire pour lire la vidéo sur Kodi.
     *
     * @param {String} url L'URL d'une playlist YouTube (version mobile).
     * @return {Promise} L'identifiant de la file d'attente et l'URL du
     *                   <em>fichier</em>.
     */
    rules["https://m.youtube.com/playlist*"] = function (url) {
        if (!url.searchParams.has("list")) {
            return Promise.reject(new PebkacError("novideo", "YouTube"));
        }

        return Promise.resolve({
            "playlistid": PLAYLIST_ID,
            "file":       PLUGIN_URL +
                                     "?action=play_all" +
                                     "&playlist=" + url.searchParams.get("list")
        });
    };

    return rules;
});
