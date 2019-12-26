/**
 * @module
 */
/* eslint-disable require-await */

import { matchPattern } from "../../tools/matchpattern.js";

/**
 * Extrait les informations nécessaire pour lire une vidéo sur Kodi. Ce scraper
 * est similaire au scraper de l'Open Graph, mais il ne vérifie pas le type de
 * la vidéo car Первый канал (1tv.ru) n'indique pas le bon format
 * (<code>text/html</code> alors que la vidéo est un fichier <em>mp4</em>).
 *
 * @param {URL}          _url L'URL d'une page de Первый канал (1tv.ru).
 * @param {HTMLDocument} doc  Le contenu HTML de la page.
 * @returns {Promise.<?string>} Une promesse contenant le lien du
 *                              <em>fichier</em> ou <code>null</code>.
 */
const action = async function (_url, doc) {
    const meta = doc.querySelector(`meta[property="og:video:url"]`);
    return null === meta ? null
                         : meta.content;
};
export const extract = matchPattern(action, "*://www.1tv.ru/*");
