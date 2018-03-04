"use strict";

/**
 * @module core/scraper/twitch
 */
define(["pebkac"], function (PebkacError) {

    /**
     * L'URL de l'extension pour lire des vidéos issues de Twitch.
     *
     * @constant {string} PLUGIN_URL
     */
    const PLUGIN_URL = "plugin://plugin.video.twitch/";

    /**
     * Les règles avec les patrons et leur action.
     *
     * @constant {Map} rules
     */
    const rules = new Map();

    /**
     * Extrait les informations nécessaire pour lire la vidéo sur Kodi.
     *
     * @param {String} url L'URL d'une vidéo Twitch.
     * @return {Promise} L'URL du <em>fichier</em>.
     */
    rules.set(["https://*.twitch.tv/videos/*"], function (url) {
        return Promise.resolve(
            PLUGIN_URL + "?mode=play&video_id=" + url.pathname.substr(8));
    });

    /**
     * Extrait les informations nécessaire pour lire le <em>live</em> sur Kodi.
     *
     * @param {String} url L'URL d'un <em>live</em> Twitch.
     * @return {Promise} L'URL du <em>fichier</em>.
     */
    rules.set(["https://*.twitch.tv/*"], function (url) {
        const headers = { "client-id": "jzkbprff40iqj646a697cyrvl0zt2m6" };
        return fetch("https://api.twitch.tv/kraken/channels" + url.pathname,
                     { headers }).then(function (response) {
            return response.json();
        }).then(function (response) {
            if (!("_id" in response)) {
                throw new PebkacError("novideo", "Twitch");
            }
            return PLUGIN_URL + "?mode=play&channel_id=" + response["_id"];
        });
    });

    return rules;
});
