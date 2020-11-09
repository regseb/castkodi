/**
 * @module
 */
/* eslint-disable require-await */

import { matchPattern } from "../../tools/matchpattern.js";

/**
 * Extrait le titre d'une vidéo Vimeo.
 *
 * @param {URL} url Une URL utilisant le plugin de Vimeo.
 * @returns {Promise<?string>} Une promesse contenant le titre ou
 *                             <code>null</code>.
 */
const action = async function ({ searchParams }) {
    if (searchParams.has("video_id")) {
        const response = await fetch("https://vimeo.com/" +
                                     searchParams.get("video_id"));
        const text = await response.text();
        const doc = new DOMParser().parseFromString(text, "text/html");
        return doc.querySelector(`meta[property="og:title"]`).content;
    }
    return null;
};
export const extract = matchPattern(action,
    "plugin://plugin.video.vimeo/play/*");
