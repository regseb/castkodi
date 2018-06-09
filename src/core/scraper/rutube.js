/**
 * @module core/scraper/rutube
 */

import { PebkacError } from "../pebkac.js";

/**
 * L'URL de l'API de Rutube pour obtenir des informations sur une vidéo.
 *
 * @constant {string} API_URL
 */
const API_URL = "https://rutube.ru/api/play/options/";

/**
 * Les règles avec les patrons et leur action.
 *
 * @constant {Map} rules
 */
export const rules = new Map();

/**
 * Extrait les informations nécessaire pour lire une vidéo sur Kodi.
 *
 * @param {String} url L'URL d'une vidéo Rutube.
 * @return {Promise} L'URL du fichier.
 */
rules.set([
    "*://rutube.ru/video/*/*", "*://rutube.ru/play/embed/*"
], function (url) {
    const id = url.pathname.replace(/^\/video\//, "")
                           .replace(/^\/play\/embed\//, "")
                           .replace(/\/$/, "");
    if (!(/^[0-9a-z]+$/).test(id)) {
        return Promise.reject(new PebkacError("noVideo", "Rutube"));
    }

    return fetch(API_URL + id + "?format=json").then(function (response) {
        if (404 === response.status) {
            throw new PebkacError("noVideo", "Rutube");
        }
        return response.json();
    }).then(function (response) {
        return response["video_balancer"].m3u8;
    });
});
