/**
 * @module
 * @license MIT
 * @see https://www.dailymotion.com/
 * @author Sébastien Règne
 */
/* eslint-disable require-await */

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
        return dailymotionPlugin.generateUrl(videoId);
    }
    if (addons.has("plugin.video.sendtokodi")) {
        return sendtokodiPlugin.generateUrl(
            new URL(`https://www.dailymotion.com/video/${videoId}`),
        );
    }
    // Envoyer par défaut au plugin Dailymotion
    return dailymotionPlugin.generateUrl(videoId);
};

/**
 * Extrait les informations nécessaire pour lire une vidéo sur Kodi.
 *
 * @param {URL} url L'URL d'une vidéo Dailymotion.
 * @returns {Promise<string>} Une promesse contenant le lien du
 *                            <em>fichier</em>.
 */
const actionVideo = async function ({ pathname }) {
    return dispatch(pathname.slice(7));
};
export const extractVideo = matchPattern(
    actionVideo,
    "*://www.dailymotion.com/video/*",
);

/**
 * Extrait les informations nécessaire pour lire une vidéo sur Kodi.
 *
 * @param {URL} url L'URL minifiée d'une vidéo Dailymotion.
 * @returns {Promise<string>} Une promesse contenant le lien du
 *                            <em>fichier</em>.
 */
const actionMinify = async function ({ pathname }) {
    return dispatch(pathname.slice(1));
};
export const extractMinify = matchPattern(actionMinify, "*://dai.ly/*");

/**
 * Extrait les informations nécessaire pour lire une vidéo sur Kodi.
 *
 * @param {URL} url L'URL d'une vidéo Dailymotion intégrée.
 * @returns {Promise<string>} Une promesse contenant le lien du
 *                            <em>fichier</em>.
 */
const actionEmbed = async function ({ pathname }) {
    return dispatch(pathname.slice(13));
};
export const extractEmbed = matchPattern(
    actionEmbed,
    "*://www.dailymotion.com/embed/video/*",
);

/**
 * Extrait les informations nécessaire pour lire une vidéo sur Kodi.
 *
 * @param {URL}      _url         L'URL d'une page quelconque ayant
 *                                éventuellement un lecteur Dailymotion.
 * @param {Object}   content      Le contenu de l'URL.
 * @param {Function} content.html La fonction retournant la promesse contenant
 *                                le document HTML ou <code>undefined</code>.
 * @returns {Promise<string|undefined>} Une promesse contenant le lien du
 *                                      <em>fichier</em> ou
 *                                      <code>undefined</code>.
 * @see https://developers.dailymotion.com/player/#player-embed-script
 */
const actionPlayerScript = async function (_url, content) {
    const doc = await content.html();
    if (undefined === doc) {
        return undefined;
    }

    const script = doc.querySelector(
        'script[src^="https://geo.dailymotion.com/player/"][data-video]',
    );
    if (null === script) {
        return undefined;
    }
    return dispatch(script.dataset.video);
};
export const extractPlayerScript = matchPattern(actionPlayerScript, "*://*/*");

/**
 * Extrait les informations nécessaire pour lire une vidéo sur Kodi.
 *
 * @param {URL} url L'URL d'un lecteur Dailymotion avec sa vidéo.
 * @returns {Promise<string|undefined>} Une promesse contenant le lien du
 *                                      <em>fichier</em> ou
 *                                      <code>undefined</code>.
 * @see https://developers.dailymotion.com/player/#player-iframe-embed
 */
const actionPlayerIframe = async function ({ searchParams }) {
    return searchParams.has("video")
        ? dispatch(searchParams.get("video"))
        : undefined;
};
export const extractPlayerIframe = matchPattern(
    actionPlayerIframe,
    "*://geo.dailymotion.com/player/*",
);
