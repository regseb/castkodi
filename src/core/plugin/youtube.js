/**
 * @module
 * @see https://kodi.wiki/view/Add-on:YouTube
 */
/* eslint-disable require-await */

import { matchPattern } from "../../tools/matchpattern.js";
import * as labeller from "../labeller/youtube.js";

/**
 * L'URL de l'extension pour lire des vidéos issues de YouTube.
 *
 * @type {string}
 */
const PLUGIN_URL = "plugin://plugin.video.youtube/play/";

/**
 * Génère l'URL d'une vidéo dans l'extension YouTube.
 *
 * @param {string}  videoId   L'identifiant de la vidéo YouTube.
 * @param {boolean} incognito La marque indiquant s'il faut lire la vidéo en
 *                            navigation privée.
 * @returns {Promise<string>} Une promesse contenant le lien du
 *                            <em>fichier</em>.
 */
export const generateVideoUrl = async function (videoId, incognito) {
    return `${PLUGIN_URL}?video_id=${videoId}` +
                        `&incognito=${incognito.toString()}`;
};

/**
 * Génère l'URL d'une playlist dans l'extension YouTube.
 *
 * @param {string}  playlistId L'identifiant de la playlist YouTube.
 * @param {boolean} incognito  La marque indiquant s'il faut lire la playlist en
 *                             navigation privée.
 * @returns {Promise<string>} Une promesse contenant le lien du
 *                            <em>fichier</em>.
 */
export const generatePlaylistUrl = async function (playlistId, incognito) {
    const config = await browser.storage.local.get(["youtube-order"]);
    return `${PLUGIN_URL}?playlist_id=${playlistId}` +
                        `&order=${config["youtube-order"]}` +
                        `&play=1&incognito=${incognito.toString()}`;
};

/**
 * Extrait le titre d'une vidéo ou d'une liste de lecture YouTube.
 *
 * @param {URL} url L'URL utilisant le plugin de YouTube.
 * @returns {Promise<?string>} Une promesse contenant le titre ou
 *                             <code>null</code>.
 */
const action = async function ({ searchParams }) {
    if (searchParams.has("video_id")) {
        return labeller.extractVideo(searchParams.get("video_id"));
    }
    if (searchParams.has("playlist_id")) {
        return labeller.extractPlaylist(searchParams.get("playlist_id"));
    }
    return null;
};
export const extract = matchPattern(action,
    "plugin://plugin.video.youtube/play/*");
