/**
 * @module
 */
/* eslint-disable require-await */

import { matchPattern } from "../../tools/matchpattern.js";

/**
 * L'URL de l'API de Arte.
 *
 * @constant {string}
 */
const API_URL = "https://api.arte.tv/api/player/v1/config";

/**
 * Extrait les informations nécessaire pour lire une vidéo sur Kodi.
 *
 * @param {URL} url L'URL d'une vidéo Arte.
 * @returns {Promise<?string>} Une promesse contenant le lien du
 *                            <em>fichier</em> ou <code>null</code>.
 */
const action = async function ({ pathname }) {
    const [, lang, , id] = pathname.split("/");
    const response = await fetch(`${API_URL}/${lang}/${id}`);
    const json = await response.json();

    const files = Object.values(json.videoJsonPlayer.VSR)
                        // Garder les vidéos dans la langue courante.
                        .filter((f) => f.id.endsWith("_1"));
    return 0 === files.length
                         ? null
                         : files.reduce((b, f) => (b.height < f.height ? f : b))
                                .url;
};
export const extract = matchPattern(action, "*://www.arte.tv/*/videos/*/*");
