/**
 * @module
 */

import { matchPattern } from "../../tools/matchpattern.js";

/**
 * L'URL de l'extension pour lire des vidéos issues de VRT NU.
 *
 * @constant {string}
 */
const PLUGIN_URL = "plugin://plugin.video.vtm.go/play/catalog/";

/**
 * Extrait les informations nécessaire pour lire une vidéo sur Kodi.
 *
 * @param {URL} url L'URL d'une vidéo VRT NU.
 * @param {Object}   content      Le contenu de l'URL.
 * @param {Function} content.html La fonction retournant la promesse contenant
 *                                le document HTML.
 * @returns {Promise<string>} Une promesse contenant le lien du
 *                            <em>fichier</em>.
 */
const action = async function ({ pathname }, content) {
    const tryPathname = function () {
        const categories = {
            e: "episodes",
            m: "movies",
        };
        const regex = /^\/vtmgo\/(?:afspelen\/|[^/]*~)([em])([\da-z-]+)$/u;
        const matches = regex.exec(pathname);
        if (null === matches) {
            return null;
        }
        const [, categoryIdentifier, item] = matches;

        return PLUGIN_URL + categories[categoryIdentifier] + "/" + item;
    };
    const tryContent = async function () {
        if (null === content || undefined === content) {
            return null;
        }
        const doc = await content.html();
        if (null === doc) {
            return null;
        }

        const playerDiv = doc.querySelector(".fjs-player");
        if (null === playerDiv) {
            return null;
        }
        let category = playerDiv.getAttribute("data-assettype");
        if (null === category || "" === category) {
            return null;
        }
        if ("s" !== category.slice(-1)) {
            category += "s";
        }
        const item = playerDiv.getAttribute("data-id");

        return PLUGIN_URL + category + "/" + item;
    };
    let returnValue = await tryContent();
    if (null === returnValue) {
        returnValue = tryPathname();
    }
    return returnValue;
};
export const extract = matchPattern(action,
    "*://www.vtm.be/vtmgo/*",
    "*://vtm.be/vtmgo/*");
