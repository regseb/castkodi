/**
 * @module
 */
/* eslint-disable require-await */

import { matchPattern } from "../../tools/matchpattern.js";

/**
 * Extrait le titre d'une vidéo Dumpert.
 *
 * @param {URL} url L'URL utilisant le plugin de Dumpert.
 * @returns {Promise<?string>} Une promesse contenant le titre ou
 *                             <code>null</code>.
 */
const action = async function ({ searchParams }) {
    if (searchParams.has("video_page_url")) {
        const url = decodeURIComponent(searchParams.get("video_page_url"));
        const response = await fetch(url);
        const text = await response.text();
        const doc = new DOMParser().parseFromString(text, "text/html");
        return doc.querySelector(`meta[property="og:title"]`).content;
    }
    return null;
};
export const extract = matchPattern(action, "plugin://plugin.video.dumpert/*");
