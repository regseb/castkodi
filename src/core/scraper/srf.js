/**
 * @module
 */

import { matchPattern } from "../tools/matchpattern.js";

/**
 * L'URL de l'API de Play SRF pour obtenir des informations sur la vidéo.
 *
 * @type {string}
 */
const API_URL = "https://il.srgssr.ch/integrationlayer/2.0/mediaComposition" +
                                                                      "/byUrn/";

/**
 * Extrait les informations nécessaire pour lire une vidéo sur Kodi.
 *
 * @param {URL} url L'URL d'une vidéo de Play SRF.
 * @returns {Promise<?string>} Une promesse contenant le lien du
 *                             <em>fichier</em> ou <code>null</code>.
 */
const action = async function ({ searchParams }) {
    if (!searchParams.has("urn")) {
        return null;
    }

    const response = await fetch(API_URL + searchParams.get("urn"));
    const json = await response.json();
    return json.chapterList?.[0].resourceList[0].analyticsMetadata.media_url ??
                                                                           null;
};
export const extract = matchPattern(action, "*://www.srf.ch/play/tv/*");
