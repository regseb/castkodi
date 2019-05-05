/**
 * @module core/scraper/peertube
 */

import { PebkacError } from "../pebkac.js";
import { INSTANCES }   from "../../data/peertube.js";

/**
 * Les règles avec les patrons et leur action.
 *
 * @constant {Map}
 */
export const rules = new Map();

/**
 * Extrait les informations nécessaire pour lire la vidéo sur Kodi.
 *
 * @function action
 * @param {string} url L'URL d'une vidéo PeerTube.
 * @return {Promise} L'URL du <em>fichier</em>.
 */
rules.set([
    ...INSTANCES.map((i) => `*://${i}/videos/watch/*`),
    ...INSTANCES.map((i) => `*://${i}/videos/embed/*`)
], function (url) {
    const api = url.toString().replace(/^http:/iu, "https:")
                              .replace("videos/watch", "api/v1/videos")
                              .replace("videos/embed", "api/v1/videos");
    return fetch(api).then(function (response) {
        return response.json();
    }).then(function (response) {
        if ("files" in response) {
            return response.files[0].fileUrl;
        }

        throw new PebkacError("noVideo", "PeerTube");
    });
});
