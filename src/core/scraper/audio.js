"use strict";

/**
 * @module core/scraper/audio
 */
define(function () {

    /**
     * Les règles avec les patrons et leur action.
     *
     * @constant {Map} rules
     */
    const rules = new Map();

    /**
     * Extrait les informations nécessaire pour lire la musique sur Kodi.
     *
     * @param {String} url L'URL d'un fichier audio.
     * @return {Promise} L'URL du fichier.
     */
    rules.set([
        "*://*/*aac",  "*://*/*aiff", "*://*/*ape", "*://*/*flac", "*://*/*m4a",
        "*://*/*midi", "*://*/*mka",  "*://*/*mp3", "*://*/*ogg",  "*://*/*pls",
        "*://*/*wav",  "*://*/*wma"
    ], function (url) {
        return Promise.resolve(url.toString());
    });

    return rules;
});
