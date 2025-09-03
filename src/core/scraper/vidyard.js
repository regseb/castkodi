/**
 * @module
 * @license MIT
 * @see https://www.vidyard.com/
 * @author Sébastien Règne
 */

import { matchURLPattern } from "../tools/urlmatch.js";

/**
 * @import { URLMatch } from "../tools/urlmatch.js"
 */

/**
 * Extrait les informations nécessaires pour lire une vidéo sur Kodi.
 *
 * @param {URLMatch} urlMatch L'URL d'une vidéo de Vidyard.
 * @returns {Promise<string>} Une promesse contenant le lien du _fichier_.
 */
const action = async ({ id }) => {
    const response = await fetch(`https://play.vidyard.com/player/${id}.json`);
    const { payload } = await response.json();

    if ("vyContext" in payload) {
        for (const file of payload.vyContext.chapterAttributes[0].video_files) {
            if ("stream_master" === file.profile) {
                return file.url + "|Referer=https://play.vidyard.com/";
            }
        }
    }

    return (
        payload.chapters[0].sources.hls[0].url +
        "|Referer=https://play.vidyard.com/"
    );
};
export const extract = matchURLPattern(
    action,
    "https://play.vidyard.com/:id.html",
    "https://play.vidyard.com/:id",
);
