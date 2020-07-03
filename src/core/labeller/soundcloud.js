/**
 * @module
 */
/* eslint-disable require-await */

import { matchPattern } from "../../tools/matchpattern.js";

/**
 * Extrait le titre d'un son SoundCloud.
 *
 * @param {URL} url L'URL utilisant le plugin de SoundCloud.
 * @returns {Promise.<?string>} Une promesse contenant le titre ou
 *                              <code>null</code>.
 */
const action = async function ({ searchParams }) {
    if (searchParams.has("url")) {
        const url = decodeURIComponent(searchParams.get("url"));
        const response = await fetch(url);
        const text = await response.text();
        const doc = new DOMParser().parseFromString(text, "text/html");
        const meta = doc.querySelector(`meta[property="og:title"]`);
        return null === meta ? null
                             : meta.content;
    }
    return null;
};
export const extract = matchPattern(action,
    "plugin://plugin.audio.soundcloud/play/*");
