/**
 * @module
 * @license MIT
 * @see https://kick.com/
 * @author Sébastien Règne
 */

import { matchURLPattern } from "../tools/urlmatch.js";

/**
 * @import { URLMatch } from "../tools/urlmatch.js"
 */

/**
 * L'URL de l'API de Kick.
 *
 * @type {string}
 */
const API_URL = "https://kick.com/api/v2/channels";

/**
 * L'URL du site de Kick.
 *
 * @type {string}
 */
const SITE_URL = "https://kick.com";

/**
 * Parse le JSON d'une réponse HTTP et retourne `undefined` en cas d'erreur.
 *
 * @param {Response} response La réponse HTTP.
 * @returns {Promise<Record<string, any>|undefined>} Une promesse contenant
 *                                                   l'objet JSON ou `undefined`
 *                                                   si la réponse ne contient
 *                                                   pas du JSON.
 */
const parse = async (response) => {
    try {
        return await response.json();
    } catch {
        // Ignorer les réponses qui ne sont pas au format JSON.
    }
    return undefined;
};

/**
 * Extrait l'URL du flux d'un live Kick.
 *
 * @param {URLMatch} url L'URL d'un live Kick.
 * @returns {Promise<string|undefined>} Une promesse contenant le lien du
 *                                      flux ou `undefined`.
 */
const actionLive = async ({ pathname }) => {
    const response = await fetch(API_URL + pathname);
    const json = await parse(response);
    if (undefined === json) {
        return undefined;
    }

    const playbackUrl = json.playback_url;
    return playbackUrl?.startsWith("https://") ? playbackUrl : undefined;
};

/**
 * Extrait l'URL du flux d'une vidéo Kick.
 *
 * @param {URLMatch} url L'URL d'une vidéo Kick.
 * @returns {Promise<string|undefined>} Une promesse contenant le lien du
 *                                      flux ou `undefined`.
 */
const actionVideo = async ({ pathname }) => {
    const response = await fetch(SITE_URL + pathname);
    if (!response.ok) {
        return undefined;
    }

    const html = await response.text();
    const match = html.match(/https:\/\/stream\.kick\.com[^ "']+master\.m3u8/u);
    return match?.[0];
};

/**
 * Extraction pour les lives Kick.
 */
export const extractLive = matchURLPattern(
    actionLive,
    "https://kick.com/*",
);

/**
 * Extraction pour les vidéos Kick.
 */
export const extractVideo = matchURLPattern(
    actionVideo,
    {
        protocol: "https",
        hostname: "kick.com",
        pathname: "/:channel/videos/*",
    },
);
