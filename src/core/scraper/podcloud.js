/**
 * @module
 * @license MIT
 * @see https://podcloud.fr/
 * @author Sébastien Règne
 */

import { matchPattern } from "../tools/matchpattern.js";

/**
 * Extrait les informations nécessaires pour lire un son sur Kodi.
 *
 * @param {URL} url L'URL d'un son podCloud.
 * @returns {Promise<string>} Une promesse contenant le lien du
 *                            <em>fichier</em>.
 */
const action = function ({ pathname }) {
    const parts = pathname.split("/");
    const podcast = parts[2];
    const episode = parts[4];
    return Promise.resolve(
        `https://podcloud.fr/ext/${podcast}/${episode}/enclosure.mp3`,
    );
};
export const extract = matchPattern(
    action,
    "*://podcloud.fr/podcast/*/episode/*",
);
