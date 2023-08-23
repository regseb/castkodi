/**
 * @module
 * @license MIT
 * @see https://watch.pokemon.com/
 * @author Sébastien Règne
 */

import { matchPattern } from "../tools/matchpattern.js";

/**
 * Les codes des régions pour l'API en fonction des langues dans l'URL.
 *
 * @type {Object<string, string>}
 */
const LANGS = {
    "es-xl": "el",
    "da-dk": "dk",
    "es-es": "es",
    "fi-fi": "fi",
    "fr-fr": "fr",
    "de-de": "de",
    "it-it": "it",
    "nl-nl": "nl",
    "nb-no": "no",
    "pt-br": "br",
    "ru-ru": "ru",
    "sv-se": "se",
    "en-gb": "uk",
    "en-us": "us",
};

/**
 * L'URL de l'API des séries Pokémon.
 *
 * @type {string}
 */
const API_URL = "https://www.pokemon.com/api/pokemontv/v2/channels/";

/**
 * Extrait les informations nécessaires pour lire une vidéo sur Kodi.
 *
 * @param {URL} url L'URL d'une vidéo Pokémon TV.
 * @returns {Promise<string|undefined>} Une promesse contenant le lien du
 *                                      <em>fichier</em> ou
 *                                      <code>undefined</code>.
 */
const action = async function ({ pathname, hash }) {
    const searchParams = new URLSearchParams(hash.slice(hash.indexOf("?")));
    if (!searchParams.has("id")) {
        return undefined;
    }
    const id = searchParams.get("id");

    const response = await fetch(API_URL + LANGS[pathname.slice(1, 6)]);
    const channels = await response.json();
    for (const channel of channels) {
        for (const media of channel.media) {
            if (media.id === id) {
                return media.offline_url;
            }
        }
    }

    return undefined;
};
export const extract = matchPattern(
    action,
    "*://watch.pokemon.com/*/#/player?*",
);
