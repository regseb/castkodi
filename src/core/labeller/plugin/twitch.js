/**
 * @module
 * @license MIT
 * @see https://kodi.wiki/view/Add-on:Twitch
 * @author Sébastien Règne
 */
/* eslint-disable require-await */

import { matchPattern } from "../../tools/matchpattern.js";

/**
 * Extrait le titre d'un <em>live</em>, d'une vidéo ou d'un clip Twitch.
 *
 * @param {URL}      url                 L'URL utilisant le plugin Twitch.
 * @param {Object}   context             Le contexte du labellisateur.
 * @param {Function} context.metaExtract La fonction parente pour extraire un
 *                                       label.
 * @returns {Promise<string|undefined>} Une promesse contenant le titre ou
 *                                      <code>undefined</code>.
 */
const action = async function ({ searchParams }, { metaExtract }) {
    if (searchParams.has("channel_name")) {
        return metaExtract(
            new URL(
                "https://www.twitch.tv/" + searchParams.get("channel_name"),
            ),
        );
    }
    if (searchParams.has("video_id")) {
        return metaExtract(
            new URL(
                "https://www.twitch.tv/videos/" + searchParams.get("video_id"),
            ),
        );
    }
    if (searchParams.has("slug")) {
        return metaExtract(
            new URL("https://www.twitch.tv/clip/" + searchParams.get("slug")),
        );
    }
    return undefined;
};
export const extract = matchPattern(action, "plugin://plugin.video.twitch/*");
