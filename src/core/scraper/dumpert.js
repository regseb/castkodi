"use strict";

define([], function () {

    /**
     * L'URL de l'extension pour lire des vidéos issues de Dumpert.
     */
    const PLUGIN_URL = "plugin://plugin.video.dumpert/";

    /**
     * Les règles avec les patrons et leur action.
     */
    const rules = new Map();

    /**
     * Extrait les informations nécessaire pour lire la vidéo sur Kodi.
     *
     * @param {String} url L'URL d'une vidéo Dumpert.
     * @return {Promise} L'URL du <em>fichier</em>.
     */
    rules.set([
        "*://www.dumpert.nl/mediabase/*"
    ], function (url) {
        return Promise.resolve(
            PLUGIN_URL + "?action=play&video_page_url=" +
                                            encodeURIComponent(url.toString()));
    });

    return rules;
});
