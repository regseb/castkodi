/**
 * @module
 */
/* eslint-disable require-await */

import { matchPattern } from "../../tools/matchpattern.js";

/**
 * L'URL de l'API de Bigo Live pour obtenir des informations sur la vidéo.
 *
 * @type {string}
 */
const API_URL = "https://www.bigo.tv/studio/getInternalStudioInfo";

/**
 * Extrait les informations nécessaire pour lire une vidéo sur Kodi.
 *
 * @param {URL} url L'URL d'une vidéo de Bigo Live.
 * @returns {Promise<?string>} Une promesse contenant le lien du
 *                             <em>fichier</em> ou <code>null</code>.
 */
const action = async function ({ pathname }) {
    // Ne pas vérifier l'expression rationnelle car il y un faux-positif avec
    // "(...{2})?". https://github.com/davisjam/safe-regex/issues/10
    // eslint-disable-next-line unicorn/no-unsafe-regex
    const result = (/^\/([a-z]{2}\/)?(?<id>\d+)$/ui).exec(pathname);
    if (undefined === result?.groups) {
        return null;
    }
    const response = await fetch(API_URL, {
        method: "POST",
        body:   new URLSearchParams({ siteId: result.groups.id }),
    });
    const json = await response.json();
    return json.data.hls_src ?? null;
};
export const extract = matchPattern(action, "*://www.bigo.tv/*");
