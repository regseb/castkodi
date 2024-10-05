/**
 * @module
 * @license MIT
 * @see https://www.cbc.ca/listen
 * @author Sébastien Règne
 */

import { matchPattern } from "../tools/matchpattern.js";

/**
 * L'URL de l'API de CBC Listen.
 *
 * @type {string}
 */
const API_URL = "https://www.cbc.ca/listen/api/v1";

/**
 * L'expression rationnelle pour extraire les identifiants du show et du clip.
 *
 * @type {RegExp}
 */
const CLIP_ID_REGEXP =
    /^\/listen\/live-radio\/(?<type>\d+)-(?<show>\d+)-[^/]+\/clip\/(?<clip>\d+)-/u;

/**
 * L'expression rationnelle pour extraire les identifiants du podcast et de
 * l'épisode.
 *
 * @type {RegExp}
 */
const PODCAST_ID_REGEXP =
    /^\/listen\/cbc-podcasts\/(?<podcast>\d+)-[^/]+\/episode\/(?<episode>\d+)-/u;

/**
 * Extrait les informations nécessaires pour lire un audio sur Kodi.
 *
 * @param {URL} url L'URL d'un clip de CBC Listen.
 * @returns {Promise<string|undefined>} Une promesse contenant le lien du
 *                                      _fichier_ ou `undefined`.
 */
const actionClip = async function ({ pathname }) {
    const result = CLIP_ID_REGEXP.exec(pathname);
    if (null === result) {
        return undefined;
    }
    const type = Number(result.groups.type);
    const show = Number(result.groups.show);
    const clip = Number(result.groups.clip);
    const response = await fetch(`${API_URL}/shows/${type}/${show}/clips`);
    const json = await response.json();
    return json.data?.clips.find((e) => e.clipID === clip)?.src;
};
export const extractClip = matchPattern(
    actionClip,
    "https://www.cbc.ca/listen/live-radio/*/clip/*",
);

/**
 * Extrait les informations nécessaires pour lire un audio sur Kodi.
 *
 * @param {URL} url L'URL d'un podcast de CBC Listen.
 * @returns {Promise<string|undefined>} Une promesse contenant le lien du
 *                                      _fichier_ ou `undefined`.
 */
const actionPodcast = async function ({ pathname }) {
    const result = PODCAST_ID_REGEXP.exec(pathname);
    if (null === result) {
        return undefined;
    }
    const podcast = Number(result.groups.podcast);
    const episode = Number(result.groups.episode);
    const response = await fetch(`${API_URL}/podcasts/${podcast}`);
    const json = await response.json();
    return json.data?.episodes.find((e) => e.clipID === episode)?.mediaURL;
};
export const extractPodcast = matchPattern(
    actionPodcast,
    "*://www.cbc.ca/listen/cbc-podcasts/*/episode/*",
);
