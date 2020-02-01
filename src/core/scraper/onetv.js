/**
 * @module
 */
/* eslint-disable require-await */

import { matchPattern } from "../../tools/matchpattern.js";

/**
 * L'URL de l'API de Первый канал (1tv.ru).
 *
 * @constant {string}
 */
const API_URL = "https://www.1tv.ru/playlist?single=true&video_id=";

/**
 * Extrait les informations nécessaire pour lire une vidéo sur Kodi.
 *
 * @param {URL} url L'URL d'une page embarquée de Первый канал (1tv.ru).
 * @returns {Promise.<?string>} Une promesse contenant le lien du
 *                              <em>fichier</em> ou <code>null</code>.
 */
const action = async function ({ pathname }) {
    const id = pathname.slice(7, pathname.indexOf(":"));
    const response = await fetch(API_URL + id);
    const json = await response.json();
    return "https:" + json[0].mbr[0].src;
};
export const extract = matchPattern(action, "*://www.1tv.ru/embed/*");
