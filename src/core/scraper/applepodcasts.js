/**
 * @module
 */
/* eslint-disable require-await */

import { matchPattern } from "../../tools/matchpattern.js";

/**
 * Extrait les informations nécessaire pour lire un son sur Kodi.
 *
 * @param {URL}          _url L'URL d'un son Apple Podcasts.
 * @param {HTMLDocument} doc  Le contenu HTML de la page.
 * @returns {Promise.<?string>} Une promesse contenant le lien du
 *                              <em>fichier</em> ou <code>null</code>.
 */
const action = async function (_url, doc) {
    const script = doc.querySelector("#shoebox-ember-data-store");
    return null === script ? null
                           : JSON.parse(script.text).data.attributes.assetUrl;
};
export const extract = matchPattern(action,
    "https://podcasts.apple.com/*/podcast/*/id*");
