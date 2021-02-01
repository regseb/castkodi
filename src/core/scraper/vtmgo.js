/**
 * @module
 */
/* eslint-disable require-await */

import { matchPattern } from "../../tools/matchpattern.js";

/**
 * L'URL de l'extension pour lire des vidéos issues de VRT NU.
 *
 * @constant {string}
 */
const PLUGIN_URL = "plugin://plugin.video.vtm.go/play/catalog/";

/**
 * Extrait les informations nécessaire pour lire une vidéo sur Kodi.
 *
 * @param {URL} url L'URL d'une vidéo VRT NU.
 * @returns {Promise<string>} Une promesse contenant le lien du
 *                            <em>fichier</em>.
 */
const actionEpisode = async function ({ pathname }) {
    return PLUGIN_URL + "episodes/" + pathname.slice(17);
};

export const extractEpisode = matchPattern(actionEpisode,
    "*://www.vtm.be/vtmgo/afspelen/e*",
    "*://vtm.be/vtmgo/afspelen/e*");

/**
 * Extrait les informations nécessaire pour lire une vidéo sur Kodi.
 *
 * @param {URL} url L'URL d'une vidéo VRT NU.
 * @returns {Promise<string>} Une promesse contenant le lien du
 *                            <em>fichier</em>.
 */
const actionMovie = async function ({ pathname }) {
    return PLUGIN_URL + "movies/" + pathname.slice(17);
};

export const extractMovie = matchPattern(actionMovie,
    "*://www.vtm.be/vtmgo/afspelen/m*",
    "*://vtm.be/vtmgo/afspelen/m*");

/**
 * Extrait les informations nécessaire pour lire une vidéo sur Kodi.
 *
 * @param {URL} url L'URL d'une vidéo VRT NU.
 * @returns {Promise<string>} Une promesse contenant le lien du
 *                            <em>fichier</em>.
 */
const actionMoviePage = async function ({ pathname }) {
    return PLUGIN_URL + "movies/" + pathname.slice(pathname.indexOf("~m") + 2);
};

export const extractMoviePage = matchPattern(actionMoviePage,
    "*://www.vtm.be/vtmgo/*~m*",
    "*://vtm.be/vtmgo/*~m*");

/**
 * Extrait les informations nécessaire pour lire une vidéo sur Kodi.
 *
 * @param {URL} _url L'URL d'une vidéo VRT NU.
 * @param {Object}   content      Le contenu de l'URL.
 * @param {Function} content.html La fonction retournant la promesse contenant
 *                                le document HTML.
 * @returns {Promise<string>} Une promesse contenant le lien du
 *                            <em>fichier</em>.
 */
const actionLive = async function (_url, content) {
    const doc = await content.html();
    const div = doc.querySelector("div.fjs-player[data-id]");
    return null === div ? null
                        : PLUGIN_URL + "channels/" + div.dataset.id;
};
export const extractLive = matchPattern(actionLive,
    "*://www.vtm.be/vtmgo/live-kijken/*",
    "*://vtm.be/vtmgo/live-kijken/*");
