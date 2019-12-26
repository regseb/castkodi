/**
 * @module
 */
/* eslint-disable require-await */

import { matchPattern } from "../../tools/matchpattern.js";

/**
 * La liste des types pouvant contenir des URLs de son ou de vidéo.
 *
 * @constant {Array.<string>}
 */
const TYPES = ["AudioObject", "MusicVideoObject", "VideoObject"];

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
 * @param {URL}          _url L'URL d'une page quelconque.
 * @param {HTMLDocument} doc  Le contenu HTML de la page.
 * @returns {Promise.<?string>} Une promesse contenant le lien du
 *                              <em>fichier</em> ou <code>null</code>.
 */
const action = async function (_url, doc) {
    if (null === doc) {
        return null;
    }

    for (const script of doc.querySelectorAll(SELECTOR)) {
        try {
            for (const property of walk(JSON.parse(script.text))) {
                if (TYPES.includes(property["@type"]) &&
                        "contentUrl" in property) {
                    return property.contentUrl;
                }
            }
        } catch {
            // Ignorer les microdonnées ayant un JSON invalide.
        }
    }
    return null;
};
export const extract = matchPattern(action, "*://*/*");
