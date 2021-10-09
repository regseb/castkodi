/**
 * @module
 */

import { Kodi } from "./jsonrpc/kodi.js";

/**
 * Le client JSON-RPC pour contacter Kodi.
 *
 * @type {Kodi}
 */
export const kodi = new Kodi();

/**
 * Ferme la connexion avec Kodi pour forcer la reconnexion avec la nouvelle
 * configuration.
 *
 * @param {browser.storage.StorageChange} changes Les paramètres modifiés dans
 *                                                la configuration.
 */
const handleChange = function (changes) {
    // Garder seulement les changements liés au serveur.
    if (Object.keys(changes).some((k) => k.startsWith("server-"))) {
        kodi.close();
    }
};

browser.storage.onChanged.addListener(handleChange);
