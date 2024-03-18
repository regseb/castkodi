/**
 * @module
 * @license MIT
 * @see https://castbox.fm/
 * @author Sébastien Règne
 */

import { matchPattern } from "../tools/matchpattern.js";

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
 * @param {URL} url L'URL d'un épisode d'un podcast sur Castbox.
 * @returns {Promise<string|undefined>} Une promesse contenant le lien du
 *                                      <em>fichier</em> ou
 *                                      <code>undefined</code>.
 */
const action = async function ({ pathname }) {
    const id = pathname.slice(pathname.lastIndexOf("-id") + 3);
    const response = await fetch(API_URL + id);
    const json = await response.json();
    return json.data.url;
};
export const extract = matchPattern(action, "*://castbox.fm/episode/*-id*-id*");
