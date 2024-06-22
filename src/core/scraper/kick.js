/**
 * @module
 * @license MIT
 * @see https://kick.com/
 * @author Sébastien Règne
 */

import { matchPattern } from "../tools/matchpattern.js";

/**
 * L'URL de l'API de Kick.
 *
 * @type {string}
 */
const API_URL = "https://kick.com/api/v1/channels";

/**
 * Parse le JSON d'une réponse HTTP et retourne <code>undefined</code> en cas
 * d'erreur.
 *
 * @param {Response} response La réponse HTTP.
 * @returns {Promise<Record<string, any>|undefined>} Une promesse contenant
 *                                                   l'objet JSON ou
 *                                                   <code>undefined</code> si
 *                                                   la réponse ne contient pas
 *                                                   du JSON.
 */
const parse = async function (response) {
    try {
        return await response.json();
    } catch {
        // Ignorer les réponses qui ne sont pas au format JSON.
    }
    return undefined;
};

/**
 * Extrait les informations nécessaires pour lire une vidéo sur Kodi.
 *
 * @param {URL} url L'URL d'un live Kick.
 * @returns {Promise<string|undefined>} Une promesse contenant le lien du
 *                                      <em>fichier</em> ou
 *                                      <code>undefined</code>.
 */
const action = async function ({ pathname }) {
    const response = await fetch(API_URL + pathname);
    const json = await parse(response);
    if (undefined === json) {
        return undefined;
    }
    const playbackUrl = json.playback_url;
    return playbackUrl.startsWith("https://") ? playbackUrl : undefined;
};
export const extract = matchPattern(action, "*://kick.com/*");
