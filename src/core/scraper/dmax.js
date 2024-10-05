/**
 * @module
 * @license MIT
 * @see https://dmax.de/
 * @author Sébastien Règne
 */

import { matchPattern } from "../tools/matchpattern.js";

/**
 * L'URL de l'API de DMAX.
 *
 * @type {string}
 */
const API_URL = "https://eu1-prod.disco-api.com";

/**
 * Extrait les informations nécessaires pour lire une vidéo sur Kodi.
 *
 * @param {URL}      _url          L'URL d'une vidéo DMAX.
 * @param {Object}   metadata      Les métadonnées de l'URL.
 * @param {Function} metadata.html La fonction retournant la promesse contenant
 *                                 le document HTML.
 * @returns {Promise<string|undefined>} Une promesse contenant le lien du
 *                                      _fichier_ ou `undefined`.
 */
const action = async function (_url, metadata) {
    const doc = await metadata.html();
    const player = doc.querySelector("hyoga-player");
    if (null === player) {
        return undefined;
    }
    // Récupérer le jeton pour appeler l'API.
    let response = await fetch(`${API_URL}/token?realm=dmaxde`, {
        headers: {
            "x-device-info":
                "STONEJS/1 (Unknown/Unknown; Unknown/Unknown; Unknown)",
        },
    });
    let json = await response.json();
    const token = json.data.attributes.token;

    // Récupérer l'identifiant de la vidéo.
    let videoId;
    if (player.hasAttribute("assetid")) {
        const assetid = player.getAttribute("assetid");
        const subresponse = await fetch(
            `${API_URL}/content/videos/${assetid}`,
            {
                headers: { authorization: `Bearer ${token}` },
            },
        );
        const subjson = await subresponse.json();
        videoId = subjson.data.id;
    } else if (player.hasAttribute("showid")) {
        const showid = player.getAttribute("showid");
        const subresponse = await fetch(
            `${API_URL}/content/videos/?filter[show.id]=${showid}`,
            {
                headers: { authorization: `Bearer ${token}` },
            },
        );
        const subjson = await subresponse.json();
        videoId = subjson.data[0].id;
    } else {
        return undefined;
    }

    // Récupérer l'URL de la vidéo.
    response = await fetch(`${API_URL}/playback/v3/videoPlaybackInfo`, {
        method: "POST",
        headers: {
            authorization: `Bearer ${token}`,
            "content-type": "application/json",
        },
        body: JSON.stringify({
            deviceInfo: { adBlocker: false },
            videoId,
        }),
    });
    json = await response.json();
    if ("data" in json) {
        for (const streaming of json.data.attributes.streaming) {
            if ("hls" === streaming.type) {
                return streaming.url;
            }
        }
    }

    return undefined;
};
export const extract = matchPattern(action, "*://dmax.de/sendungen/*");
