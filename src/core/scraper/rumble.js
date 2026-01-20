/**
 * @module
 * @license MIT
 * @see https://rumble.com/
 * @author Sébastien Règne
 */

import { matchURLPattern } from "../tools/urlmatch.js";

/**
 * @import { URLMatch } from "../tools/urlmatch.js"
 */

/**
 * L'URL de l'API de Rumble pour les vidéos.
 *
 * @type {string}
 */
const API_URL = "https://rumble.com/embedJS/u3/?request=video";

/**
 * Génère l'URL de la vidéo Rumble à partir de son identifiant.
 *
 * @param {string} id L'identifiant de la vidéo.
 * @returns {Promise<string|undefined>} Une promesse contenant le lien du
 *                                      _fichier_ ou `undefined`.
 */
const generateUrl = async (id) => {
    const response = await fetch(`${API_URL}&v=${id}`);
    const json = await response.json();
    return false === json ? undefined : Object.values(json.ua).at(-1)[0];
};

/**
 * Extrait les informations nécessaires pour lire une vidéo sur Kodi.
 *
 * @param {URLMatch} _url          L'URL d'une vidéo Rumble.
 * @param {Object}   metadata      Les métadonnées de l'URL.
 * @param {Function} metadata.html La fonction retournant la promesse contenant
 *                                 le document HTML.
 * @returns {Promise<string|undefined>} Une promesse contenant le lien du
 *                                      _fichier_ ou `undefined`.
 */
const action = async (_url, metadata) => {
    const doc = await metadata.html();
    const link = doc.querySelector(
        'link[rel="alternate"][type="application/json+oembed"]',
    );
    if (null === link) {
        return undefined;
    }

    // Récupérer l'identifiant de la vidéo dans une URL ayant ce format :
    // https://rumble.com/api/Media/oembed.json?url=https%3A%2F%2Frumble.com%2Fembed%2Ffoo%2F
    const id = link.href.slice(
        link.href.lastIndexOf("%2F", link.href.length - 4) + 3,
        -3,
    );
    return await generateUrl(id);
};
export const extract = matchURLPattern(action, "https://rumble.com/*.html");

/**
 * Extrait les informations nécessaires pour lire une vidéo embarquée sur Kodi.
 *
 * @param {URLMatch} urlMatch L'URL d'une vidéo embarquée de Rumble avec
 *                            l'identifiant.
 * @returns {Promise<string|undefined>} Une promesse contenant le lien du
 *                                      _fichier_ ou `undefined`.
 */
const actionEmbed = async ({ id }) => {
    return await generateUrl(id);
};
export const extractEmbed = matchURLPattern(
    actionEmbed,
    "https://rumble.com/embed/:id/",
);
