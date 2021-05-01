/**
 * @module
 */
/* eslint-disable require-await */

import { matchPattern } from "../../tools/matchpattern.js";
// eslint-disable-next-line import/no-cycle
import { extract as metaExtract } from "../scrapers.js";

/**
 * Extrait les informations nécessaire pour lire une vidéo sur Kodi.
 *
 * @param {URL}      _url              L'URL d'une vidéo Konbini.
 * @param {Object}   content           Le contenu de l'URL.
 * @param {Function} content.html      La fonction retournant la promesse
 *                                     contenant le document HTML.
 * @param {Object}   options           Les options de l'extraction.
 * @param {boolean}  options.depth     La marque indiquant si l'extraction est
 *                                     en profondeur.
 * @param {boolean}  options.incognito La marque indiquant si l'utilisateur est
 *                                     en navigation privée.
 * @returns {Promise<?string>} Une promesse contenant le lien du
 *                             <em>fichier</em> ou <code>null</code>.
 */
const action = async function (_url, content, options) {
    const doc = await content.html();
    const script = doc.querySelector("script#__NEXT_DATA__");

    const entities = JSON.parse(script.text).props.initialState.posts.entities;
    for (const entity of Object.values(entities)) {
        for (const element of entity.content) {
            if ("iframe" !== element.tagName) {
                continue;
            }
            const subdoc = new DOMParser().parseFromString(element.value,
                                                           "text/html");
            const iframe = subdoc.querySelector("iframe");
            const file = await metaExtract(new URL(iframe.src),
                                           { ...options, depth: true });
            if (null !== file) {
                return file;
            }
        }
    }
    return null;
};
export const extract = matchPattern(action, "*://www.konbini.com/*");
