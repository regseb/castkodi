/**
 * @module core/scraper/rutube
 */

import { PebkacError } from "../pebkac.js";

/**
 * L'URL de l'API de Rutube pour obtenir des informations sur une vidéo.
 *
 * @constant {string}
 */
const API_URL = "https://rutube.ru/api/play/options/";

/**
 * Les règles avec les patrons et leur action.
 *
 * @constant {Map}
 */
export const rules = new Map();

/**
 * Extrait les informations nécessaire pour lire une vidéo sur Kodi.
 *
 * @function action
 * @param {string} url L'URL d'une vidéo Rutube.
 * @return {Promise} L'URL du <em>fichier</em>.
 */
rules.set([
    "*://rutube.ru/video/*/*", "*://rutube.ru/play/embed/*"
], function (url) {
    const id = url.pathname.replace(/^\/video\//u, "")
                           .replace(/^\/play\/embed\//u, "")
                           .replace(/\/$/u, "");
    if (!(/^[0-9a-z]+$/u).test(id)) {
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
