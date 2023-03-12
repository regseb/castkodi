/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import { PebkacError } from "./tools/pebkac.js";

/**
 * Vérifie que l'extension peut requêter les sites Internet.
 *
 * @returns {Promise<boolean>} Une promesse contenant <code>true</code> si
 *                             l'extension a les accès ; sinon une promesse
 *                             rompue.
 */
export const checkHosts = async function () {
    const granted = await browser.permissions.contains({
        origins: ["<all_urls>"],
    });
    if (granted) {
        return true;
    }
    throw new PebkacError("notGranted");
};
