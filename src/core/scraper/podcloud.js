/**
 * @module
 * @license MIT
 * @see https://podcloud.fr/
 * @author Sébastien Règne
 */

import { matchURLPattern } from "../tools/urlmatch.js";

/**
 * @import { URLMatch } from "../tools/urlmatch.js"
 */

/**
 * Extrait les informations nécessaires pour lire un son sur Kodi.
 *
 * @param {URLMatch} urlMatch L'URL d'un son podCloud avec l'identifiant du
 *                            podcast et de l'épisode.
 * @returns {Promise<string>} Une promesse contenant le lien du _fichier_.
 */
const action = ({ podcast, episode }) => {
    return Promise.resolve(
        `https://podcloud.fr/ext/${podcast}/${episode}/enclosure.mp3`,
    );
};
export const extract = matchURLPattern(
    action,
    "https://podcloud.fr/podcast/:podcast/episode/:episode",
);
