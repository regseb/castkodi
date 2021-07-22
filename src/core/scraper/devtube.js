/**
 * @module
 */
/* eslint-disable require-await */

import { matchPattern } from "../../tools/matchpattern.js";
import * as plugin from "../plugin/youtube.js";

/**
 * Extrait les informations nécessaire pour lire la vidéo sur Kodi.
 *
 * @param {URL}     url               L'URL d'une vidéo DevTube.
 * @param {Object}  _content          Le contenu de l'URL.
 * @param {Object}  options           Les options de l'extraction.
 * @param {boolean} options.incognito La marque indiquant si l'utilisateur est
 *                                    en navigation privée.
 * @returns {Promise<string>} Une promesse contenant le lien du
 *                            <em>fichier</em>.
 */
const action = async function ({ pathname }, _content, { incognito }) {
    return plugin.generateVideoUrl(pathname.slice(7), incognito);
};
export const extract = matchPattern(action, "*://dev.tube/video/*");
