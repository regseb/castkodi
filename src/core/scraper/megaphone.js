/**
 * @module
 * @license MIT
 * @see https://megaphone.spotify.com/
 * @author Sébastien Règne
 */

import { matchURLPattern } from "../tools/urlmatch.js";

/**
 * @import { URLMatch } from "../tools/urlmatch.js"
 */

/**
 * Extrait les informations nécessaires pour lire un son sur Kodi.
 *
 * @param {URLMatch} url L'URL d'un son de Megaphone.
 * @returns {Promise<string>} Une promesse contenant le lien du _fichier_.
 */
const actionPlayer = ({ pathname }) => {
    return Promise.resolve(`https://dcs.megaphone.fm${pathname}.mp3`);
};
export const extractPlayer = matchURLPattern(
    actionPlayer,
    "*://player.megaphone.fm/*",
);

/**
 * Extrait les informations nécessaires pour lire un son sur Kodi.
 *
 * @param {URLMatch} url L'URL d'un son (d'une liste de lecture) de Megaphone.
 * @returns {Promise<string|undefined>} Une promesse contenant le lien du
 *                                      _fichier_ ou `undefined`.
 */
const actionPlaylist = ({ searchParams }) => {
    return Promise.resolve(
        searchParams.has("e")
            ? `https://dcs.megaphone.fm/${searchParams.get("e")}.mp3`
            : undefined,
    );
};
export const extractPlaylist = matchURLPattern(
    actionPlaylist,
    "https://playlist.megaphone.fm/*",
);
