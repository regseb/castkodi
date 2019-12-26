/**
 * @module
 */
/* eslint-disable require-await */

import { matchPattern } from "../../tools/matchpattern.js";

/**
 * Extrait les informations nécessaire pour lire un son sur Kodi.
 *
 * @param {URL}          _url L'URL d'un son Blog Talk Radio.
 * @param {HTMLDocument} doc  Le contenu HTML de la page.
 * @returns {Promise.<?string>} Une promesse contenant le lien du
 *                              <em>fichier</em> ou <code>null</code>.
 */
const action = async function (_url, doc) {
    const meta = doc.querySelector(`meta[property="twitter:player:stream"]`);
    return null === meta ? null
                         : meta.content;
};
export const extract = matchPattern(action,
    "*://www.blogtalkradio.com/*");
