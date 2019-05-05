/**
 * @module core/scraper/allocine
 */

import { PebkacError } from "../pebkac.js";

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
 * @param {string} url L'URL d'une vidéo AlloCiné.
 * @return {Promise} L'URL du <em>fichier</em>.
 */
rules.set(["http://www.allocine.fr/*"], function (url) {
    return fetch(url.toString()).then(function (response) {
        return response.text();
    }).then(function (data) {
        const doc = new DOMParser().parseFromString(data, "text/html");

        const iframe = doc.querySelector("iframe[src^=\"/_video/\"]");
        // Si l'iframe n'est pas trouvé : chercher directement la figure.
        if (null === iframe) {
            return data;
        }
        return fetch("http://www.allocine.fr" + iframe.src)
                                                     .then(function (response) {
            return response.text();
        });
    }).then(function (data) {
        const doc = new DOMParser().parseFromString(data, "text/html");

        const figure = doc.querySelector("figure[data-model]");
        if (null === figure) {
            throw new PebkacError("noVideo", "AlloCiné");
        }
        const sources = JSON.parse(figure.dataset.model).videos[0].sources;
        return "http:" + ("high" in sources ? sources.high
                                            : sources.medium);
    });
});
