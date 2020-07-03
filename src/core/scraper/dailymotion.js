/**
 * @module
 */
/* eslint-disable require-await */

import { matchPattern } from "../../tools/matchpattern.js";

/**
 * L'URL de l'extension pour lire des vidéos issues de Dailymotion.
 *
 * @constant {string}
 */
const PLUGIN_URL = "plugin://plugin.video.dailymotion_com/?mode=playVideo&url=";

/**
 * Extrait les informations nécessaire pour lire une vidéo sur Kodi.
 *
 * @param {URL} url L'URL d'une vidéo Dailymotion.
 * @returns {Promise.<string>} Une promesse contenant le lien du
 *                             <em>fichier</em>.
 */
const actionVideo = async function ({ pathname }) {
    return PLUGIN_URL + pathname.slice(7);
};
export const extractVideo = matchPattern(actionVideo,
    "*://www.dailymotion.com/video/*");

/**
 * Extrait les informations nécessaire pour lire une vidéo sur Kodi.
 *
 * @param {URL} url L'URL minifiée d'une vidéo Dailymotion.
 * @returns {Promise.<string>} Une promesse contenant le lien du
 *                             <em>fichier</em>.
 */
const actionMinify = async function ({ pathname }) {
    return PLUGIN_URL + pathname.slice(1);
};
export const extractMinify = matchPattern(actionMinify, "*://dai.ly/*");

/**
 * Extrait les informations nécessaire pour lire une vidéo sur Kodi.
 *
 * @param {URL} url L'URL d'une vidéo Dailymotion intégrée.
 * @returns {Promise.<string>} Une promesse contenant le lien du
 *                             <em>fichier</em>.
 */
const actionEmbed = async function ({ pathname }) {
    return PLUGIN_URL + pathname.slice(13);
};
export const extractEmbed = matchPattern(actionEmbed,
    "*://www.dailymotion.com/embed/video/*");
