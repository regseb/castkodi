/**
 * @module
 */
/* eslint-disable require-await */

import { matchPattern } from "../../tools/matchpattern.js";
import * as plugin from "../plugin/ardmediathek.js";

/**
 * Extrait les informations nécessaire pour lire une vidéo sur Kodi.
 *
 * @param {URL} url L'URL d'une vidéo ARD Mediathek.
 * @returns {Promise<string>} Une promesse contenant le lien du
 *                            <em>fichier</em>.
 */
const action = async function ({ pathname }) {
    const id = pathname.slice(
        pathname.lastIndexOf("/", pathname.length - 2) + 1,
        -1,
    );
    return plugin.generateUrl(id);
};
export const extract = matchPattern(action,
    "*://www.ardmediathek.de/video/*/*/*/*/");
