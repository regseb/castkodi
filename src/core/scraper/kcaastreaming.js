/**
 * @module
 */
/* eslint-disable require-await */

import { matchPattern } from "../../tools/matchpattern.js";

/**
 * Extrait les informations nécessaire pour lire un son sur Kodi.
 *
 * @param {URL}          _url L'URL du <em>live</em> de KCAA Radio.
 * @param {HTMLDocument} doc  Le contenu HTML de la page.
 * @returns {Promise.<string>} Une promesse contenant le lien du
 *                             <em>fichier</em>.
 */
const action = async function (_url, doc) {
    return doc.querySelector("#show a").href;
};
export const extract = matchPattern(action, "http://live.kcaastreaming.com/");
