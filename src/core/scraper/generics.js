/**
 * @module
 */

import { action as audio }  from "./extractor/audio.js";
import { action as video }  from "./extractor/video.js";
import { action as ldjson } from "./extractor/ldjson.js";

/**
 * La liste des extracteurs.
 *
 * @constant {Array.<Function>}
 */
const extractors = [video, audio, ldjson];

/**
 * Les règles avec les patrons et leur action.
 *
 * @constant {Map.<Array.<string>, Function>}
 */
export const rules = new Map();

/**
 * Extrait les informations nécessaire pour lire un média sur Kodi.
 *
 * @function action
 * @param {URL}    url      L'URL d'une page quelconque.
 * @param {string} url.href Le lien de l'URL.
 * @returns {Promise} Une promesse contenant le lien du <em>fichier</em> ou
 *                    <code>null</code>.
 */
rules.set(["*://*/*"], async function ({ href }) {
    const response = await fetch(href);
    const contentType = response.headers.get("Content-Type");
    // Ignorer les pages qui ne sont pas du (X)HTML.
    if (null === contentType ||
            !contentType.startsWith("text/html") &&
            !contentType.startsWith("application/xhtml+xml")) {
        return null;
    }

    const text = await response.text();
    const doc = new DOMParser().parseFromString(text, "text/html");
    for (const extractor of extractors) {
        const file = extractor(doc);
        if (null !== file) {
            // Préfixer éventuellement l'URL extraite par l'URL de la page.
            return new URL(file, href).href;
        }
    }
    return null;
});
