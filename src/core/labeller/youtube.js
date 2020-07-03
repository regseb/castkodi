/**
 * @module
 */
/* eslint-disable require-await */

import { matchPattern } from "../../tools/matchpattern.js";

/**
 * Extrait le titre d'une vidéo ou d'une liste de lecture YouTube.
 *
 * @param {URL} url L'URL utilisant le plugin de YouTube.
 * @returns {Promise.<?string>} Une promesse contenant le titre ou
 *                              <code>null</code>.
 */
const action = async function ({ searchParams }) {
    if (searchParams.has("video_id")) {
        const response = await fetch("https://www.youtube.com/watch?v=" +
                                     searchParams.get("video_id"));
        const text = await response.text();
        const doc = new DOMParser().parseFromString(text, "text/html");
        return doc.querySelector(`meta[property="og:title"]`).content;
    }
    if (searchParams.has("playlist_id")) {
        const response = await fetch("https://www.youtube.com/playlist?list=" +
                                     searchParams.get("playlist_id"));
        const text = await response.text();
        const doc = new DOMParser().parseFromString(text, "text/html");
        const label = doc.querySelector(`meta[property="og:title"]`);
        return null === label
                             ? browser.i18n.getMessage("labeller_youtube_myMix")
                             : label.content;
    }
    return null;
};
export const extract = matchPattern(action,
    "plugin://plugin.video.youtube/play/*");
