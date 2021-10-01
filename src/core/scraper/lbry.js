/**
 * @module
 */
/* eslint-disable require-await */

import { matchPattern } from "../tools/matchpattern.js";

/**
 * L'URL de l'API de LBRY.
 *
 * @type {string}
 */
const API_URL = "https://api.lbry.tv/api/v1";

/**
 * Extrait les informations nécessaire pour lire une vidéo sur Kodi.
 *
 * @param {URL} url L'URL d'une vidéo LBRY.
 * @returns {Promise<?string>} Une promesse contenant le lien du
 *                             <em>fichier</em> ou <code>null</code>.
 */
const action = async function ({ href, pathname }) {
    const uri = "lbry://" + (href.startsWith("https://lbry.tv/$/embed/")
                                      ? pathname.slice(9).replace("/", "#")
                                      : pathname.slice(1).replaceAll(":", "#"));

    const response = await fetch(`${API_URL}/proxy?m=get`, {
        method:  "POST",
        headers: { "Content-Type": "application/json-rpc" },
        body:    JSON.stringify({
            jsonrpc: "2.0",
            method:  "get",
            // eslint-disable-next-line camelcase
            params:  { uri, save_file: false },
            id:      Date.now(),
        }),
    });
    const json = await response.json();
    return json.result?.streaming_url ?? null;
};
export const extract = matchPattern(action,
    "https://lbry.tv/*",
    "https://open.lbry.com/*");
