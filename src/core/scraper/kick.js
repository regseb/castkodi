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
 * L'URL de base du site Kick.
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
 * Tente d'extraire le lien HLS d'un VOD Kick depuis la page HTML.
 *
 * @param {string} pathname Le chemin de l'URL (ex: /foo/videos/xxxx).
 * @returns {Promise<string|undefined>} Le lien vers le master.m3u8 ou `undefined`.
 */
const extractVod = async (pathname) => {
    // On reconstruit l'URL publique de la page VOD.
    const response = await fetch(SITE_URL + pathname);
    if (!response.ok) {
        return undefined;
    }
    const html = await response.text();

    // Les VODs Kick exposent un lien de ce genre :
    // https://stream.kick.com/.../master.m3u8
    const match = html.match(/https:\/\/stream\.kick\.com[^"' ]+master\.m3u8/);
    return match?.[0];
};

/**
 * Extrait les informations nécessaires pour lire une vidéo sur Kodi.
 *
 * @param {URLMatch} url L'URL d'un live ou d'un VOD Kick.
 * @returns {Promise<string|undefined>} Une promesse contenant le lien du
 *                                      _fichier_ ou `undefined`.
 */
const action = async ({ pathname }) => {
    // Cas 1 : VOD, les URLs ressemblent à /<channel>/videos/<uuid>
    if (pathname.includes("/videos/")) {
        const vodUrl = await extractVod(pathname);
        if (vodUrl !== undefined) {
            return vodUrl;
        }
        // si on n'a rien trouvé dans la page, on laisse tomber sur le
        // comportement d'origine (live) ci-dessous.
    }

    // Cas 2 : live ou page de chaîne classique
    const response = await fetch(API_URL + pathname);
    const json = await parse(response);
    if (undefined === json) {
        return undefined;
    }
    const playbackUrl = json.playback_url;
    return playbackUrl?.startsWith("https://") ? playbackUrl : undefined;
};

export const extract = matchURLPattern(action, "https://kick.com/*");
