/**
 * @module
 */
/* eslint-disable require-await */

import * as plugin from "../plugin/vtmgo.js";
import { matchPattern } from "../tools/matchpattern.js";

/**
 * Extrait les informations nécessaire pour lire un épisode sur Kodi.
 *
 * @param {URL} url L'URL d'un épisode de VTM GO.
 * @returns {Promise<string>} Une promesse contenant le lien du
 *                            <em>fichier</em>.
 */
const actionEpisode = async function ({ pathname }) {
    return plugin.generateEpisodeUrl(pathname.slice(17));
};

export const extractEpisode = matchPattern(actionEpisode,
    "*://vtm.be/vtmgo/afspelen/e*",
    "*://www.vtm.be/vtmgo/afspelen/e*");

/**
 * Extrait les informations nécessaire pour lire un film sur Kodi.
 *
 * @param {URL} url L'URL d'un film de VTM GO.
 * @returns {Promise<string>} Une promesse contenant le lien du
 *                            <em>fichier</em>.
 */
const actionMovie = async function ({ pathname }) {
    return plugin.generateMovieUrl(pathname.slice(17));
};

export const extractMovie = matchPattern(actionMovie,
    "*://vtm.be/vtmgo/afspelen/m*",
    "*://www.vtm.be/vtmgo/afspelen/m*");

/**
 * Extrait les informations nécessaire pour lire un film sur Kodi.
 *
 * @param {URL} url L'URL d'une page d'un film de VTM GO.
 * @returns {Promise<string>} Une promesse contenant le lien du
 *                            <em>fichier</em>.
 */
const actionMoviePage = async function ({ pathname }) {
    return plugin.generateMovieUrl(pathname.slice(pathname.indexOf("~m") + 2));
};

export const extractMoviePage = matchPattern(actionMoviePage,
    "*://vtm.be/vtmgo/*~m*",
    "*://www.vtm.be/vtmgo/*~m*");

/**
 * Extrait les informations nécessaire pour lire une chaine sur Kodi.
 *
 * @param {URL}      _url         L'URL d'une chaine VTM GO.
 * @param {Object}   content      Le contenu de l'URL.
 * @param {Function} content.html La fonction retournant la promesse contenant
 *                                le document HTML.
 * @returns {Promise<string|undefined>} Une promesse contenant le lien du
 *                                      <em>fichier</em> ou
 *                                      <code>undefined</code>.
 */
const actionChannel = async function (_url, content) {
    const doc = await content.html();
    const div = doc.querySelector("div.fjs-player[data-id]");
    return null === div ? undefined
                        : plugin.generateChannelUrl(div.dataset.id);
};
export const extractChannel = matchPattern(actionChannel,
    "*://vtm.be/vtmgo/live-kijken/*",
    "*://www.vtm.be/vtmgo/live-kijken/*");
