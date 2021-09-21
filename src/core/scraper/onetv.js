/**
 * @module
 */
/* eslint-disable require-await */

import { matchPattern } from "../../tools/matchpattern.js";

/**
 * L'URL de l'API de Первый канал (1tv.ru).
 *
 * @type {string}
 */
const API_URL = "https://www.1tv.ru/playlist?single=true&video_id=";

/**
 * Extrait les informations nécessaire pour lire une vidéo sur Kodi.
 *
 * @param {URL}      url          L'URL d'une page de Первый канал (1tv.ru).
 * @param {Object}   content      Le contenu de l'URL.
 * @param {Function} content.html La fonction retournant la promesse contenant
 *                                le document HTML ou <code>null</code>.
 * @returns {Promise<?string>} Une promesse contenant le lien du
 *                             <em>fichier</em> ou <code>null</code>.
 */
const action = async function ({ pathname }, content) {
    let id;
    if (pathname.startsWith("/embed/")) {
        id = pathname.slice(7, pathname.indexOf(":"));
    } else {
        const doc = await content.html();
        const meta = doc.querySelector(`meta[property="ya:ovs:content_id"]`);
        if (null === meta) {
            return null;
        }
        id = meta.content.split(":")[0];
    }

    const response = await fetch(API_URL + id);
    const json = await response.json();
    return `https:${json[0].mbr[0].src}`;
};
export const extract = matchPattern(action, "*://www.1tv.ru/*");
