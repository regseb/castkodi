/**
 * @module
 * @see https://kodi.wiki/view/Add-on:VTM_GO
 */
/* eslint-disable require-await */

import * as labeller from "../labeller/vtmgo.js";
import { matchPattern } from "../tools/matchpattern.js";

/**
 * L'URL de l'extension pour lire des vidéos issues de VTM GO.
 *
 * @type {string}
 */
const PLUGIN_URL = "plugin://plugin.video.vtm.go/play/catalog";

/**
 * Génère l'URL d'un épisode dans l'extension VTM GO.
 *
 * @param {string} episodeId L'identifiant de l'épisode VTM GO.
 * @returns {Promise<string>} Une promesse contenant le lien du
 *                            <em>fichier</em>.
 */
export const generateEpisodeUrl = async function (episodeId) {
    return `${PLUGIN_URL}/episodes/${episodeId}`;
};

/**
 * Génère l'URL d'un film dans l'extension VTM GO.
 *
 * @param {string} movieId L'identifiant du film VTM GO.
 * @returns {Promise<string>} Une promesse contenant le lien du
 *                            <em>fichier</em>.
 */
export const generateMovieUrl = async function (movieId) {
    return `${PLUGIN_URL}/movies/${movieId}`;
};

/**
 * Génère l'URL d'une chaine dans l'extension VTM GO.
 *
 * @param {string} channelId L'identifiant de la chaine VTM GO.
 * @returns {Promise<string>} Une promesse contenant le lien du
 *                            <em>fichier</em>.
 */
export const generateChannelUrl = async function (channelId) {
    return `${PLUGIN_URL}/channels/${channelId}`;
};

/**
 * Extrait le titre d'un épisode VTM GO.
 *
 * @param {URL} url L'URL utilisant le plugin de VTM GO.
 * @returns {Promise<string|undefined>} Une promesse contenant le titre ou
 *                                      <code>undefined</code>.
 */
const actionEpisode = async function ({ pathname }) {
    // Enlever le nom de domaine car un bogue dans Firefox le déplace dans le
    // chemin. https://bugzil.la/1374505
    const episodeId = pathname.replace("//plugin.video.vtm.go", "").slice(23);
    return labeller.extractEpisode(episodeId);
};
export const extractEpisode = matchPattern(actionEpisode,
    "plugin://plugin.video.vtm.go/play/catalog/episodes/*");

/**
 * Extrait le titre d'un film VTM GO.
 *
 * @param {URL} url L'URL utilisant le plugin de VTM GO.
 * @returns {Promise<string|undefined>} Une promesse contenant le titre ou
 *                                      <code>undefined</code>.
 */
const actionMovie = async function ({ pathname }) {
    // Enlever le nom de domaine car un bogue dans Firefox le déplace dans le
    // chemin. https://bugzil.la/1374505
    const movieId = pathname.replace("//plugin.video.vtm.go", "").slice(21);
    return labeller.extractMovie(movieId);
};
export const extractMovie = matchPattern(actionMovie,
    "plugin://plugin.video.vtm.go/play/catalog/movies/*");

/**
 * Extrait le titre d'une chaine VTM GO.
 *
 * @param {URL} url L'URL utilisant le plugin de VTM GO.
 * @returns {Promise<string|undefined>} Une promesse contenant le titre ou
 *                                      <code>undefined</code>.
 */
const actionChannel = async function ({ pathname }) {
    // Enlever le nom de domaine car un bogue dans Firefox le déplace dans le
    // chemin. https://bugzil.la/1374505
    const channelId = pathname.replace("//plugin.video.vtm.go", "").slice(23);
    return labeller.extractChannel(channelId);
};
export const extractChannel = matchPattern(actionChannel,
    "plugin://plugin.video.vtm.go/play/catalog/channels/*");
