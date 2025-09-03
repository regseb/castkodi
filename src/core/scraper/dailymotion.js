/**
 * @module
 * @license MIT
 * @see https://www.dailymotion.com/
 * @author Sébastien Règne
 */

import { kodi } from "../jsonrpc/kodi.js";
import * as dailymotionPlugin from "../plugin/dailymotion.js";
import * as sendtokodiPlugin from "../plugin/sendtokodi.js";
import { matchURLPattern } from "../tools/urlmatch.js";

/**
 * @import { URLMatch } from "../tools/urlmatch.js"
 */

/**
 * Répartit une vidéo Dailymotion à un plugin de Kodi.
 *
 * @param {string} videoId L'identifiant de la vidéo Dailymotion.
 * @returns {Promise<string>} Une promesse contenant le lien du _fichier_.
 */
const dispatch = async (videoId) => {
    const addons = await kodi.addons.getAddons("video");
    if (addons.some((a) => "plugin.video.dailymotion_com" === a.addonid)) {
        return dailymotionPlugin.generateUrl(videoId);
    }
    if (addons.some((a) => "plugin.video.sendtokodi" === a.addonid)) {
        return sendtokodiPlugin.generateUrl(
            new URL(`https://www.dailymotion.com/video/${videoId}`),
        );
    }
    // Envoyer par défaut au plugin Dailymotion
    return dailymotionPlugin.generateUrl(videoId);
};

/**
 * Extrait les informations nécessaires pour lire une vidéo sur Kodi.
 *
 * @param {URLMatch} urlMatch L'URL d'une vidéo Dailymotion avec l'identifiant
 *                            de la vidéo.
 * @returns {Promise<string>} Une promesse contenant le lien du _fichier_.
 */
const action = ({ videoId }) => {
    return dispatch(videoId);
};
export const extract = matchURLPattern(
    action,
    "https://www.dailymotion.com/video/:videoId",
    "https://dai.ly/:videoId",
    "https://www.dailymotion.com/embed/video/:videoId",
);

/**
 * Extrait les informations nécessaires pour lire une vidéo sur Kodi.
 *
 * @param {URLMatch} _url          L'URL d'une page quelconque ayant
 *                                 éventuellement un lecteur Dailymotion.
 * @param {Object}   metadata      Les métadonnées de l'URL.
 * @param {Function} metadata.html La fonction retournant la promesse contenant
 *                                 le document HTML ou `undefined`.
 * @returns {Promise<string|undefined>} Une promesse contenant le lien du
 *                                      _fichier_ ou `undefined`.
 * @see https://developers.dailymotion.com/player/#player-embed-script
 */
const actionPlayerScript = async (_url, metadata) => {
    const doc = await metadata.html();
    if (undefined === doc) {
        return undefined;
    }

    const script = doc.querySelector(
        'script[src^="https://geo.dailymotion.com/player/"][data-video]',
    );
    if (null === script) {
        return undefined;
    }
    return await dispatch(script.dataset.video);
};
export const extractPlayerScript = matchURLPattern(
    actionPlayerScript,
    "*://*/*",
);

/**
 * Extrait les informations nécessaires pour lire une vidéo sur Kodi.
 *
 * @param {URLMatch} url L'URL d'un lecteur Dailymotion avec sa vidéo.
 * @returns {Promise<string|undefined>} Une promesse contenant le lien du
 *                                      _fichier_ ou `undefined`.
 * @see https://developers.dailymotion.com/player/#player-iframe-embed
 */
const actionPlayerIframe = ({ searchParams }) => {
    return searchParams.has("video")
        ? dispatch(searchParams.get("video"))
        : Promise.resolve(undefined);
};
export const extractPlayerIframe = matchURLPattern(
    actionPlayerIframe,
    "https://geo.dailymotion.com/player/*",
);
