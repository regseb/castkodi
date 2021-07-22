/**
 * @module
 */

import * as dailymotion from "./plugin/dailymotion.js";
import * as dumpert  from "./plugin/dumpert.js";
import * as soundcloud from "./plugin/soundcloud.js";
import * as twitch from "./plugin/twitch.js";
import * as vimeo from "./plugin/vimeo.js";
import * as vtmgo from "./plugin/vtmgo.js";
import * as youtube from "./plugin/youtube.js";
import { strip } from "./sanitizer.js";

/**
 * La liste des fonctions des extensions de Kodi retournant le label d'une URL.
 *
 * @type {Function[]}
 */
const PLUGINS = [
    // Lister les extensions de Kodi (triées par ordre alphabétique).
    dailymotion,
    dumpert,
    soundcloud,
    twitch,
    vimeo,
    vtmgo,
    youtube,
].flatMap((p) => Object.entries(p)
                       .filter(([n]) => n.startsWith("extract"))
                       .map(([_, f]) => f));

/**
 * Complète un élément de la liste de lecture avec un label.
 *
 * @param {Object} item       L'élément de la liste de lecture.
 * @param {string} item.file  Le fichier de l'élément.
 * @param {string} item.label Le label de l'élément.
 * @returns {Promise<Object>} Une promesse contenant l'élément complété de la
 *                            liste de lecture.
 */
export const complete = async function (item) {
    const url = new URL(item.file.startsWith("/") ? "file:/" + item.file
                                                  : item.file);
    for (const extract of PLUGINS) {
        const label = await extract(url);
        if (null !== label) {
            return { ...item, label };
        }
    }
    return {
        ...item,
        label: "" === item.label ? item.file
                                 : strip(item.label),
    };
};
