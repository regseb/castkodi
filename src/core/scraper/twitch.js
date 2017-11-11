"use strict";

define(["pebkac"], function (PebkacError) {

    /**
     * L'identifiant de la file d'attente des vidéos.
     */
    const PLAYLIST_ID = 1;

    /**
     * L'URL de l'extension pour lire des vidéos issues de Twitch.
     */
    const PLUGIN_URL = "plugin://plugin.video.twitch/";

    /**
     * Les règles avec les patrons et leur action.
     */
    const rules = new Map();

    /**
     * Extrait les informations nécessaire pour lire la vidéo sur Kodi.
     *
     * @param {String} url L'URL d'une vidéo Twitch.
     * @return {Promise} L'identifiant de la file d'attente et l'URL du
     *                   <em>fichier</em>.
     */
    rules.set(["https://*.twitch.tv/videos/*"], function (url) {
        return Promise.resolve({
            "playlistid": PLAYLIST_ID,
            "file":       PLUGIN_URL + "?mode=play" +
                                       "&video_id=" + url.pathname.substr(8)
        });
    });

    /**
     * Extrait les informations nécessaire pour lire le <em>live</em> sur Kodi.
     *
     * @param {String} url L'URL d'un <em>live</em> Twitch.
     * @return {Promise} L'identifiant de la file d'attente et l'URL du
     *                   <em>fichier</em>.
     */
    rules.set(["https://*.twitch.tv/*"], function (url) {
        const headers = { "client-id": "jzkbprff40iqj646a697cyrvl0zt2m6" };
        return fetch("https://api.twitch.tv/kraken/channels" + url.pathname,
                     { headers }).then(function (response) {
            return response.json();
        }).then(function (response) {
            if ("_id" in response) {
                return {
                    "playlistid": PLAYLIST_ID,
                    "file":       PLUGIN_URL + "?mode=play" +
                                               "&channel_id=" + response["_id"]
                };
            }
            throw new PebkacError("novideo", "Twitch");
        });
    });

    return rules;
});
