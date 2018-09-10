/**
 * @module core/scraper/full30
 */

import { PebkacError } from "../pebkac.js";

/**
 * L'expression rationnelle pour extraire l'URL de la vidéo.
 *
 * @constant {RegExp} URL_REGEXP
 */
const URL_REGEXP = /https?:\/\/videos\.full30\.com\/[^"]+\.(mp4|webm|ogv)/iu;

/**
 * Les règles avec les patrons et leur action.
 *
 * @constant {Map} rules
 */
export const rules = new Map();

/**
 * Extrait les informations nécessaire pour lire une vidéo sur Kodi.
 *
 * @param {String} url L'URL d'une vidéo Full30.
 * @return {Promise} L'URL du fichier.
 */
rules.set(["*://www.full30.com/video/*"], function (url) {
    return fetch(url.toString()).then(function (response) {
        return response.text();
    }).then(function (data) {
        const result = URL_REGEXP.exec(data);
        if (null === result) {
            throw new PebkacError("noVideo", "Full30");
        }
        return result[0];
    });
});
