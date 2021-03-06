/**
 * @module
 */
/* eslint-disable require-await */

import { matchPattern } from "../../tools/matchpattern.js";

/**
 * Extrait le titre d'un <em>live</em>, d'une vidéo, ou d'un clip Twitch.
 *
 * @param {URL} url L'URL utilisant le plugin de Twitch.
 * @returns {Promise<?string>} Une promesse contenant le titre ou
 *                             <code>null</code>.
 */
const action = async function ({ searchParams }) {
    if (searchParams.has("channel_name") || searchParams.has("video_id")) {
        // Consulter la page du live ou de la vidéo en passant par la version
        // mobile car la version classique charge le contenu de la page en
        // asynchrone avec des APIs.
        const url = "https://m.twitch.tv/" +
                    (searchParams.has("channel_name")
                                    ? searchParams.get("channel_name")
                                    : "videos/" + searchParams.get("video_id"));
        const response = await fetch(url);
        const text = await response.text();
        const doc = new DOMParser().parseFromString(text, "text/html");
        const title = doc.querySelector("title").textContent;
        return title.slice(0, title.lastIndexOf(" - "));
    }
    if (searchParams.has("slug")) {
        return searchParams.get("slug");
    }
    return null;
};
export const extract = matchPattern(action, "plugin://plugin.video.twitch/*");
