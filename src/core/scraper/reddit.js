/**
 * @module
 * @license MIT
 * @see https://www.reddit.com/
 * @author Sébastien Règne
 */

import { matchURLPattern } from "../tools/urlmatch.js";
// eslint-disable-next-line import/no-cycle
import { extract as iframeExtract } from "./iframe.js";

/**
 * @import { URLMatch } from "../tools/urlmatch.js"
 */

/**
 * Extrait les informations nécessaires pour lire une vidéo sur Kodi.
 *
 * @param {URLMatch} _url          L'URL d'une vidéo Reddit.
 * @param {Object}   metadata      Les métadonnées de l'URL.
 * @param {Function} metadata.html La fonction retournant la promesse contenant
 *                                 le document HTML.
 * @returns {Promise<string|undefined>} Une promesse contenant le lien du
 *                                      _fichier_ ou `undefined`.
 */
const action = async (_url, metadata) => {
    const doc = await metadata.html();

    if ("old.reddit.com" === _url.hostname) {
        const playerDiv = doc.querySelector("div[data-hls-url]");
        return playerDiv?.dataset.hlsUrl;
    }

    const player = doc.querySelector("shreddit-player-2[src]");
    return player?.getAttribute("src");
};
export const extract = matchURLPattern(
    action,
    "https://www.reddit.com/r/*",
    "https://old.reddit.com/r/*",
);

/**
 * Extrait les informations nécessaires pour lire une vidéo sur Kodi.
 *
 * @param {URLMatch} url               L'URL d'une vidéo embarquée sur Reddit.
 * @param {Object}   metadata          Les métadonnées de l'URL.
 * @param {Function} metadata.html     La fonction retournant la promesse
 *                                     contenant le document HTML.
 * @param {Object}   context           Le contexte de l'extraction.
 * @param {boolean}  context.depth     La marque indiquant si l'extraction est
 *                                     en profondeur.
 * @param {boolean}  context.incognito La marque indiquant si l'utilisateur est
 *                                     en navigation privée.
 * @returns {Promise<string|undefined>} Une promesse contenant le lien du
 *                                      _fichier_ ou `undefined`.
 */
const actionEmbed = async (url, metadata, context) => {
    const doc = await metadata.html();
    for (const embed of doc.querySelectorAll("shreddit-embed[html]")) {
        const subMetadata = {
            html: () =>
                Promise.resolve(
                    new DOMParser().parseFromString(
                        embed.getAttribute("html"),
                        "text/html",
                    ),
                ),
        };
        const file = await iframeExtract(url, subMetadata, context);
        if (undefined !== file) {
            return file;
        }
    }
    return undefined;
};
export const extractEmbed = matchURLPattern(
    actionEmbed,
    "https://www.reddit.com/r/*",
);
