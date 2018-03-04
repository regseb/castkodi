"use strict";

/**
 * @module core/scraper/mixcloud
 */
define(["pebkac"], function (PebkacError) {

    /**
     * L'URL de l'extension pour lire des musiques issues de Mixcloud.
     *
     * @constant {string} PLUGIN_URL
     */
    const PLUGIN_URL = "plugin://plugin.audio.mixcloud/";

    /**
     * Les règles avec les patrons et leur action.
     *
     * @constant {Map} rules
     */
    const rules = new Map();

    /**
     * Extrait les informations nécessaire pour lire une musique sur Kodi.
     *
     * @param {String} url L'URL d'une musique Mixcloud.
     * @return {Promise} L'URL du <em>fichier</em>.
     */
    rules.set(["https://www.mixcloud.com/*/*/"], function (url) {
        if (url.pathname.startsWith("/discover/")) {
            return Promise.reject(new PebkacError("noaudio", "Mixcloud"));
        }

        return Promise.resolve(
            PLUGIN_URL + "?mode=40&key=" + encodeURIComponent(url.pathname));
    });

    return rules;
});
