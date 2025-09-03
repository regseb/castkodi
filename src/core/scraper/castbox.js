/**
 * @module
 * @license MIT
 * @see https://castbox.fm/
 * @author Sébastien Règne
 */

import { matchURLPattern } from "../tools/urlmatch.js";

/**
 * @import { URLMatch } from "../tools/urlmatch.js"
 */

/**
 * L'URL de l'API de Castbox pour obtenir des informations sur un épisode d'un
 * podcast.
 *
 * @type {string}
 */
const API_URL = "https://everest.castbox.fm/data/episode/v4?eid=";

/**
 * Extrait les informations nécessaires pour lire une vidéo sur Kodi.
 *
 * @param {URLMatch} urlMatch L'URL d'un épisode d'un podcast sur Castbox avec
 *                            l'identifiant de l'épisode.
 * @returns {Promise<string|undefined>} Une promesse contenant le lien du
 *                                      _fichier_ ou `undefined`.
 */
const action = async ({ eid }) => {
    const response = await fetch(API_URL + eid);
    const json = await response.json();
    return json.data.url;
};
export const extract = matchURLPattern(
    action,
    "https://castbox.fm/episode/*-id*-id:eid",
);
