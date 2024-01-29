/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import { matchPattern } from "../tools/matchpattern.js";

/**
 * Extrait le titre d'une vidéo YouTube.
 *
 * @param {URL} url L'URL de la vidéo YouTube.
 * @returns {Promise<string|undefined>} Une promesse contenant le titre ou le
 *                                      texte pour les vidéos non-disponibles.
 */
const actionVideo = async function (url) {
    if (url.searchParams.has("v")) {
        const response = await fetch(url);
        const text = await response.text();
        const doc = new DOMParser().parseFromString(text, "text/html");
        return (
            /** @type {HTMLMetaElement|null} */ (
                doc.querySelector('meta[property="og:title"]')
            )?.content ??
            browser.i18n.getMessage("labeller_youtube_unavailable")
        );
    }
    return undefined;
};
export const extractVideo = matchPattern(
    actionVideo,
    "*://www.youtube.com/watch*",
);

/**
 * Extrait le titre d'une playlist YouTube.
 *
 * @param {URL} url L'URL de la playlist YouTube.
 * @returns {Promise<string|undefined>} Une promesse contenant le titre ou le
 *                                      texte pour les playlists
 *                                      non-disponibles.
 */
const actionPlaylist = async function (url) {
    if (url.searchParams.has("list")) {
        const response = await fetch(url);
        const text = await response.text();
        const doc = new DOMParser().parseFromString(text, "text/html");
        const label = doc.querySelector('meta[property="og:title"]').content;
        return "undefined" === label
            ? browser.i18n.getMessage("labeller_youtube_mix")
            : label;
    }
    return undefined;
};
export const extractPlaylist = matchPattern(
    actionPlaylist,
    "*://www.youtube.com/playlist*",
);
