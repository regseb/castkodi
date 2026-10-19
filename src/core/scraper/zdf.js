/**
 * @module
 * @license MIT
 * @see https://www.zdf.de/
 * @author Sébastien Règne
 */

import { matchURLPattern } from "../tools/urlmatch.js";

/**
 * @import { URLMatch } from "../tools/urlmatch.js"
 */

/**
 * L'URL de l'API de ZDF.
 *
 * @type {string}
 */
const API_URL = "https://api.zdf.de";

/**
 * L'expression rationnelle pour extraire le jeton de l'API.
 *
 * @type {RegExp}
 */
const API_TOKEN_REGEXP =
    /\{\\"videoToken\\":\{\\"apiToken\\":\\"(?<apiToken>\w+)\\"/v;

/**
 * Extrait les informations nécessaires pour lire une vidéo sur Kodi.
 *
 * @param {URLMatch} _url          L'URL d'une vidéo de ZDF.
 * @param {Object}   metadata      Les métadonnées de l'URL.
 * @param {Function} metadata.html La fonction retournant la promesse contenant
 *                                 le document HTML.
 * @returns {Promise<string | undefined>} Une promesse contenant le lien du
 *                                        _fichier_ ou `undefined`.
 */
const action = async ({ pathname }, metadata) => {
    const doc = await metadata.html();
    for (const script of doc.querySelectorAll("script:not([src])")) {
        const result = API_TOKEN_REGEXP.exec(script.text);
        if (null === result) {
            continue;
        }

        const apiToken = result.groups.apiToken;
        const response = await fetch(`${API_URL}/graphql`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Api-Auth": `Bearer ${apiToken}`,
            },
            body: JSON.stringify({
                operationName: "VideoByCanonical",
                query:
                    "query VideoByCanonical($canonical: String!) {" +
                    "  videoByCanonical(canonical: $canonical) {" +
                    "    currentMedia { nodes { ptmdTemplate } }" +
                    "  }" +
                    "}",
                variables: {
                    canonical: pathname.slice(pathname.lastIndexOf("/") + 1),
                },
            }),
        });
        const json = await response.json();
        const ptmdTemplate =
            json.data.videoByCanonical?.currentMedia.nodes[0].ptmdTemplate;
        if (undefined === ptmdTemplate) {
            continue;
        }

        const subresponse = await fetch(
            API_URL + ptmdTemplate.replace("{playerId}", "ngplayer_2_5"),
            { headers: { "Api-Auth": `Bearer ${apiToken}` } },
        );
        const subjson = await subresponse.json();
        return subjson.priorityList[0].formitaeten[0].qualities[0].audio
            .tracks[0].uri;
    }
    return undefined;
};
export const extract = matchURLPattern(action, "https://www.zdf.de/*");
