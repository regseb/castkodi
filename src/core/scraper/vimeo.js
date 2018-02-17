"use strict";

define(["pebkac"], function (PebkacError) {

    /**
     * L'URL de l'extension pour lire des vidéos issues de Vimeo.
     */
    const PLUGIN_URL = "plugin://plugin.video.vimeo/";

    /**
     * Les règles avec les patrons et leur action.
     */
    const rules = new Map();

    /**
     * Extrait les informations nécessaire pour lire la vidéo sur Kodi.
     *
     * @param {String} url L'URL d'une vidéo Vimeo.
     * @return {Promise} L'URL du <em>fichier</em>.
     */
    rules.set(["https://vimeo.com/*"], function (url) {
        if (!(/^\/[0-9]+$/).test(url.pathname)) {
            return Promise.reject(new PebkacError("novideo", "Vimeo"));
        }

        return Promise.resolve(
            PLUGIN_URL + "play/?video_id=" + url.pathname.substr(1));
    });

    /**
     * Extrait les informations nécessaire pour lire la vidéo sur Kodi.
     *
     * @param {String} url L'URL du lecteur de Vimeo avec une vidéo.
     * @return {Promise} L'URL du <em>fichier</em>.
     */
    rules.set(["https://player.vimeo.com/video/*"], function (url) {
        if (!(/^\/video\/[0-9]+$/).test(url.pathname)) {
            return Promise.reject(new PebkacError("novideo", "Vimeo"));
        }

        return Promise.resolve(
            PLUGIN_URL + "play/?video_id=" + url.pathname.substr(7));
    });

    return rules;
});
