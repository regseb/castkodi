/**
 * @module
 */
/* eslint-disable require-await */

import { matchPattern } from "../../tools/matchpattern.js";

/**
 * L'URL de l'API de Rutube pour obtenir des informations sur une vidéo.
 *
 * @constant {string}
 */
const API_URL = "https://rutube.ru/api/play/options/";

/**
 * Extrait les informations nécessaire pour lire une vidéo sur Kodi.
 *
 * @param {URL} url L'URL d'une vidéo Rutube.
 * @returns {Promise.<?string>} Une promesse contenant le lien du
 *                              <em>fichier</em> ou <code>null</code>.
 */
const action = async function ({ pathname }) {
    const id = pathname.replace(/^\/video\//u, "")
                       .replace(/^\/play\/embed\//u, "")
                       .replace(/\/$/u, "");
    if (!(/^[0-9a-z]+$/u).test(id)) {
        return null;
    }

    const response = await fetch(API_URL + id + "?format=json");
    if (404 === response.status) {
        return null;
    }
    const json = await response.json();
    return json.video_balancer.m3u8;
};
export const extract = matchPattern(action,
    "*://rutube.ru/video/*/*",
    "*://rutube.ru/play/embed/*");
