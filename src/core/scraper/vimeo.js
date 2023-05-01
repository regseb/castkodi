/**
 * @module
 * @license MIT
 * @see https://vimeo.com/
 * @author Sébastien Règne
 */
/* eslint-disable require-await */

import * as plugin from "../plugin/vimeo.js";
import { matchPattern } from "../tools/matchpattern.js";

/**
 * Extrait les informations nécessaire pour lire une vidéo sur Kodi. Seul les
 * URLs des vidéos intégrées sont gérées car pour les URLs vers les vidéos : le
 * scraper <em>opengraph</em> va extrait l'URL de la vidéo intégrée depuis la
 * méta-donnée <code>og:video:secure_url</code>.
 *
 * @param {URL} url L'URL d'une vidéo Vimeo intégrée.
 * @returns {Promise<string>} Une promesse contenant le lien du
 *                            <em>fichier</em>.
 */
const action = async function ({ pathname, searchParams }) {
    return plugin.generateUrl(
        pathname.slice(7),
        searchParams.get("h") ?? undefined,
    );
};
export const extract = matchPattern(action, "*://player.vimeo.com/video/*");
