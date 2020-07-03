/**
 * @module
 */
/* eslint-disable require-await */

import { matchPattern } from "../../tools/matchpattern.js";

/**
 * Extrait le titre d'une vidéo Dailymotion.
 *
 * @param {URL} url L'URL utilisant le plugin de Dailymotion.
 * @returns {Promise.<?string>} Une promesse contenant le titre ou
 *                              <code>null</code>.
 */
const action = async function ({ searchParams }) {
    if (searchParams.has("url")) {
        const response = await fetch("https://www.dailymotion.com/video/" +
                                     searchParams.get("url"));
        const text = await response.text();
        const doc = new DOMParser().parseFromString(text, "text/html");
        const label = doc.querySelector(`meta[property="og:title"]`).content;
        return label.slice(0, label.lastIndexOf(" - "));
    }
    return null;
};
export const extract = matchPattern(action,
    "plugin://plugin.video.dailymotion_com/*");
