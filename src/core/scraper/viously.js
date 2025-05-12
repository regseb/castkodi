/**
 * @module
 * @license MIT
 * @see https://www.viously.com/
 * @author Sébastien Règne
 */

import { matchPattern } from "../tools/matchpattern.js";

/**
 * Extrait les informations nécessaires pour lire une vidéo sur Kodi.
 *
 * @param {URL} url L'URL d'une vidéo Viously.
 * @returns {Promise<string>} Une promesse contenant le lien du _fichier_.
 */
const action = ({ pathname }) => {
    const id = pathname.slice(pathname.indexOf("/", 1) + 1);
    return Promise.resolve(
        `https://www.viously.com/video/hls/${id}/index.m3u8`,
    );
};
export const extract = matchPattern(
    action,
    "*://www.viously.com/export/*",
    "*://www.viously.com/amp/*",
);

/**
 * Extrait les informations nécessaires pour lire une vidéo intégrée sur Kodi.
 *
 * @param {URL}      _url          L'URL d'une page quelconque ayant
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
export const extractIntegrate = matchPattern(actionIntegrate, "*://*/*");
