/**
 * @module
 * @license MIT
 * @see https://www.dailymotion.com/
 * @author Sébastien Règne
 */

import { kodi } from "../jsonrpc/kodi.js";
import * as dailymotionPlugin from "../plugin/dailymotion.js";
import * as sendtokodiPlugin from "../plugin/sendtokodi.js";
import { matchPattern } from "../tools/matchpattern.js";

/**
 * Répartit une vidéo Dailymotion à un plugin de Kodi.
 *
 * @param {string} videoId L'identifiant de la vidéo Dailymotion.
 * @returns {Promise<string>} Une promesse contenant le lien du
 *                            <em>fichier</em>.
 */
const dispatch = async function (videoId) {
    const addons = new Set(await kodi.addons.getAddons("video"));
    if (addons.has("plugin.video.dailymotion_com")) {
        return await dailymotionPlugin.generateUrl(videoId);
    }
    if (addons.has("plugin.video.sendtokodi")) {
        return await sendtokodiPlugin.generateUrl(
            new URL(`https://www.dailymotion.com/video/${videoId}`),
        );
    }
    // Envoyer par défaut au plugin Dailymotion
    return await dailymotionPlugin.generateUrl(videoId);
};

/**
 * Extrait les informations nécessaires pour lire une vidéo sur Kodi.
 *
 * @param {URL} url L'URL d'une vidéo Dailymotion.
 * @returns {Promise<string>} Une promesse contenant le lien du
 *                            <em>fichier</em>.
 */
const actionVideo = function ({ pathname }) {
    return dispatch(pathname.slice(7));
};
export const extractVideo = matchPattern(
    actionVideo,
    "*://www.dailymotion.com/video/*",
);

/**
 * Extrait les informations nécessaires pour lire une vidéo sur Kodi.
 *
 * @param {URL} url L'URL minifiée d'une vidéo Dailymotion.
 * @returns {Promise<string>} Une promesse contenant le lien du
 *                            <em>fichier</em>.
 */
const actionMinify = function ({ pathname }) {
    return dispatch(pathname.slice(1));
};
export const extractMinify = matchPattern(actionMinify, "*://dai.ly/*");

/**
 * Extrait les informations nécessaires pour lire une vidéo sur Kodi.
 *
 * @param {URL} url L'URL d'une vidéo Dailymotion intégrée.
 * @returns {Promise<string>} Une promesse contenant le lien du
 *                            <em>fichier</em>.
 */
const actionEmbed = function ({ pathname }) {
    return dispatch(pathname.slice(13));
};
export const extractEmbed = matchPattern(
    actionEmbed,
    "*://www.dailymotion.com/embed/video/*",
);

/**
 * Extrait les informations nécessaires pour lire une vidéo sur Kodi.
 *
 * @param {URL}      _url          L'URL d'une page quelconque ayant
 *                                 éventuellement un lecteur Dailymotion.
 * @param {Object}   metadata      Les métadonnées de l'URL.
 * @param {Function} metadata.html La fonction retournant la promesse contenant
 *                                 le document HTML ou <code>undefined</code>.
 * @returns {Promise<string|undefined>} Une promesse contenant le lien du
 *                                      <em>fichier</em> ou
 *                                      <code>undefined</code>.
 * @see https://developers.dailymotion.com/player/#player-embed-script
 */
const actionPlayerScript = async function (_url, metadata) {
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
export const extractPlayerScript = matchPattern(actionPlayerScript, "*://*/*");

/**
 * Extrait les informations nécessaires pour lire une vidéo sur Kodi.
 *
 * @param {URL} url L'URL d'un lecteur Dailymotion avec sa vidéo.
 * @returns {Promise<string|undefined>} Une promesse contenant le lien du
 *                                      <em>fichier</em> ou
 *                                      <code>undefined</code>.
 * @see https://developers.dailymotion.com/player/#player-iframe-embed
 */
const actionPlayerIframe = function ({ searchParams }) {
    return searchParams.has("video")
        ? dispatch(searchParams.get("video"))
        : Promise.resolve(undefined);
};
export const extractPlayerIframe = matchPattern(
    actionPlayerIframe,
    "*://geo.dailymotion.com/player/*",
);
