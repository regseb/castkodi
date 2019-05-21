/**
 * @module core/scraper/applepodcasts
 */

import { PebkacError } from "../pebkac.js";

/**
 * Les règles avec les patrons et leur action.
 *
 * @constant {Map}
 */
export const rules = new Map();

/**
 * Extrait les informations nécessaire pour lire un son sur Kodi.
 *
 * @function action
 * @param {string} url L'URL d'un son de Apple Podcasts.
 * @return {Promise} L'URL du <em>fichier</em>.
 */
rules.set(["https://podcasts.apple.com/*/podcast/*/id*"], function (url) {
    return fetch(url.toString()).then(function (response) {
        return response.text();
    }).then(function (data) {
        const doc = new DOMParser().parseFromString(data, "text/html");

        const script = doc.querySelector("#shoebox-ember-data-store");
        if (null === script) {
            throw new PebkacError("noAudio", "Apple Podcasts");
        }

        const datastore = JSON.parse(script.textContent);
        return datastore.data.attributes.assetUrl;
    });
});
