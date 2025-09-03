/**
 * @module
 * @license MIT
 * @see https://www.viously.com/
 * @author Sébastien Règne
 */

import { matchURLPattern } from "../tools/urlmatch.js";

/**
 * @import { URLMatch } from "../tools/urlmatch.js"
 */

/**
 * Extrait les informations nécessaires pour lire une vidéo sur Kodi.
 *
 * @param {URLMatch} urlMatch L'URL d'une vidéo Viously avec l'identifiant de la
 *                            vidéo.
 * @returns {Promise<string>} Une promesse contenant le lien du _fichier_.
 */
const action = ({ id }) => {
    return Promise.resolve(
        `https://www.viously.com/video/hls/${id}/index.m3u8`,
    );
};
export const extract = matchURLPattern(
    action,
    "https://www.viously.com/export/:id",
    "https://www.viously.com/amp/:id",
);

/**
 * Extrait les informations nécessaires pour lire une vidéo intégrée sur Kodi.
 *
 * @param {URLMatch} _url          L'URL d'une page quelconque ayant
 *                                 éventuellement un lecteur Viously.
 * @param {Object}   metadata      Les métadonnées de l'URL.
 * @param {Function} metadata.html La fonction retournant la promesse contenant
 *                                 le document HTML ou `undefined`.
 * @returns {Promise<string|undefined>} Une promesse contenant le lien du
 *                                      _fichier_ ou `undefined`.
 * @see https://developers.viously.com/docs/how-to-integrate-the-viously-video-player
 */
const actionIntegrate = async (_url, metadata) => {
    const doc = await metadata.html();
    if (undefined === doc) {
        return undefined;
    }

    const player = doc.querySelector(".vsly-player[id]");
    return null === player
        ? undefined
        : `https://www.viously.com/video/hls/${player.id}/index.m3u8`;
};
export const extractIntegrate = matchURLPattern(actionIntegrate, "*://*/*");
