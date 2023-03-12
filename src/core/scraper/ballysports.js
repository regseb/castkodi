/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import { matchPattern } from "../tools/matchpattern.js";

/**
 * L'URL de l'API de Bally Sports.
 *
 * @type {string}
 */
const API_URL = "https://cdn.ballysports.deltatre.digital/api/items";

/**
 * L'URL de l'API des publications de Bally Sports.
 *
 * @type {string}
 */
const FEED_URL =
    "https://feedpublisher.ballysports.com/divauni/SINCLAIR/fe/video/videodata";

/**
 * Extrait les informations nécessaire pour lire une vidéo sur Kodi.
 *
 * @param {URL} url L'URL d'une vidéo de Bally Sports.
 * @returns {Promise<string|undefined>} Une promesse contenant le lien du
 *                                      <em>fichier</em> ou
 *                                      <code>undefined</code>.
 */
const action = async function ({ pathname }) {
    const response = await fetch(
        `${API_URL}/${pathname.slice(11)}?use_custom_id=true`,
    );
    const json = await response.json();
    if (!("videoId" in json)) {
        return undefined;
    }

    const subresponse = await fetch(`${FEED_URL}/${json.videoId}.xml`);
    const text = await subresponse.text();
    const xml = new DOMParser().parseFromString(text, "application/xml");

    const uri = xml.querySelector('videoSource[name="HLSv3"] uri');
    return uri.textContent;
};
export const extract = matchPattern(
    action,
    "*://www.ballysports.com/watch/vod/*",
);
