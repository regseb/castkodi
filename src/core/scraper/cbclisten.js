/**
 * @module
 * @license MIT
 * @see https://www.cbc.ca/listen
 * @author Sébastien Règne
 */

import { matchURLPattern } from "../tools/urlmatch.js";

/**
 * @import { URLMatch } from "../tools/urlmatch.js"
 */

/**
 * L'URL de l'API de CBC Listen.
 *
 * @type {string}
 */
const API_URL = "https://www.cbc.ca/listen/api/v1";

/**
 * Le nombre maximum qu'on peut demander à l'API retournant les clips. Cette
 * valeur est égale à la valeur maximum pour un nombre entier signé sur 32 bits.
 *
 * @type {number}
 */
const MAX_PAGE_SIZE = 2_147_483_647;

/**
 * Extrait les informations nécessaires pour lire un audio sur Kodi.
 *
 * @param {URLMatch} urlMatch L'URL d'un clip de CBC Listen.
 * @returns {Promise<string|undefined>} Une promesse contenant le lien du
 *                                      _fichier_ ou `undefined`.
 */
const actionClip = async ({ type, show, clip }) => {
    const clipID = Number(clip);
    const response = await fetch(
        `${API_URL}/shows/${type}/${show}/clips?pageSize=${MAX_PAGE_SIZE}`,
    );
    const json = await response.json();
    return json.data?.clips.find((e) => e.clipID === clipID)?.src;
};
export const extractClip = matchURLPattern(
    actionClip,
    "https://www.cbc.ca/listen/live-radio/:type-:show-*/clip/:clip-*",
);

/**
 * Extrait les informations nécessaires pour lire un audio sur Kodi.
 *
 * @param {URLMatch} url L'URL d'un podcast de CBC Listen.
 * @returns {Promise<string|undefined>} Une promesse contenant le lien du
 *                                      _fichier_ ou `undefined`.
 */
const actionPodcast = async ({ podcast, episode }) => {
    const clipID = Number(episode);
    const response = await fetch(`${API_URL}/podcasts/${podcast}`);
    const json = await response.json();
    return json.data?.episodes.find((e) => e.clipID === clipID)?.mediaURL;
};
export const extractPodcast = matchURLPattern(
    actionPodcast,
    "https://www.cbc.ca/listen/cbc-podcasts/:podcast-*/episode/:episode-*",
);
