/**
 * @module
 */
/* eslint-disable require-await */

import { matchPattern }           from "../../tools/matchpattern.js";
// eslint-disable-next-line import/no-cycle
import { extract as metaExtract } from "../scrapers.js";

/**
 * La liste des types pouvant contenir des URLs de son ou de vidéo.
 *
 * @constant {Set.<string>}
 */
const TYPES = new Set(["AudioObject", "MusicVideoObject", "VideoObject"]);

/**
 * Le sélecteur retournant les scripts contenant des microdonnées.
 *
 * @constant {string}
 */
const SELECTOR = `script[type="application/ld+json"]`;

/**
 * Extrait récursivement les propriétés de type objet d'un objet JSON.
 *
 * @param {object} root Un objet JSON.
 * @returns {Array.<object>} La liste des objets extraits.
 */
const walk = function (root) {
    return [root, ...Object.values(root)
                           .filter((p) => null !== p &&
                                          "object" === typeof p &&
                                          !Array.isArray(p))
                           .flatMap(walk)];
};

/**
 * Extrait les informations nécessaire pour lire un média sur Kodi.
 *
 * @param {URL}      url               L'URL d'une page quelconque.
 * @param {object}   content           Le contenu de l'URL.
 * @param {Function} content.html      La fonction retournant la promesse
 *                                     contenant le document HTML ou
 *                                     <code>null</code>.
 * @param {object}   options           Les options de l'extraction.
 * @param {number}   options.depth     Le niveau de profondeur de l'extraction.
 * @param {boolean}  options.incognito La marque indiquant si l'utilisateur est
 *                                     en navigation privée.
 * @returns {Promise.<?string>} Une promesse contenant le lien du
 *                              <em>fichier</em> ou <code>null</code>.
 */
const action = async function ({ href }, content, options) {
    const doc = await content.html();
    if (null === doc) {
        return null;
    }

    for (const script of doc.querySelectorAll(SELECTOR)) {
        try {
            for (const property of walk(JSON.parse(script.text))) {
                if (!TYPES.has(property["@type"])) {
                    continue;
                }

                if ("contentUrl" in property) {
                    return property.contentUrl;
                }
                if ("embedUrl" in property) {
                    const file = await metaExtract(
                        new URL(property.embedUrl, href),
                        { ...options, depth: options.depth + 1 },
                    );
                    if (null !== file) {
                        return file;
                    }
                }
            }
        } catch {
            // Ignorer les microdonnées ayant un JSON invalide.
        }
    }
    return null;
};
export const extract = matchPattern(action, "*://*/*");
