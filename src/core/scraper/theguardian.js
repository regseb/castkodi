/**
 * @module
 */
/* eslint-disable require-await */

import { matchPattern } from "../../tools/matchpattern.js";

/**
 * L'URL de l'extension pour lire des vidéos issues de YouTube.
 *
 * @constant {string}
 */
const PLUGIN_URL = "plugin://plugin.video.youtube/play/";

/**
 * Extrait les informations nécessaire pour lire une vidéo sur Kodi.
 *
 * @param {URL}          _url              L'URL d'un article du Guardian.
 * @param {HTMLDocument} doc               Le contenu HTML de la page.
 * @param {object}       options           Les options de l'extraction.
 * @param {boolean}      options.incognito La marque indiquant si l'utilisateur
 *                                         est en navigation privée.
 * @returns {Promise.<?string>} Une promesse contenant le lien du
 *                              <em>fichier</em> ou <code>null</code>.
 */
const actionVideo = async function (_url, doc, { incognito }) {
    const div = doc.querySelector("div.youtube-media-atom__iframe");
    return null === div ? null
                        : PLUGIN_URL + "?video_id=" + div.dataset.assetId +
                                       "&incognito=" + incognito.toString();
};
export const extractVideo = matchPattern(actionVideo,
    "*://www.theguardian.com/*");

/**
 * Extrait les informations nécessaire pour lire un son sur Kodi.
 *
 * @param {URL}          _url L'URL d'un article du Guardian.
 * @param {HTMLDocument} doc  Le contenu HTML de la page.
 * @returns {Promise.<?string>} Une promesse contenant le lien du
 *                              <em>fichier</em> ou <code>null</code>.
 */
const actionAudio = async function (_url, doc) {
    const figure = doc.querySelector("figure#audio-component-container");
    return null === figure ? null
                           : figure.dataset.source;
};
export const extractAudio = matchPattern(actionAudio,
    "*://www.theguardian.com/*");
