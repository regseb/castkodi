/**
 * @module
 */

import * as dailymotion from "./labeller/dailymotion.js";
import * as dumpert  from "./labeller/dumpert.js";
import * as soundcloud from "./labeller/soundcloud.js";
import * as twitch from "./labeller/twitch.js";
import * as vimeo from "./labeller/vimeo.js";
import * as vtmgo from "./labeller/vtmgo.js";
import * as youtube from "./labeller/youtube.js";
import { strip } from "./sanitizer.js";

/**
 * La liste des étiqueteuses (retournant le label extrait ou <code>null</code>).
 *
 * @type {Function[]}
 */
const LABELLERS = [
    // Lister les étiqueteuses (triées par ordre alphabétique).
    dailymotion,
    dumpert,
    soundcloud,
    twitch,
    vimeo,
    vtmgo,
    youtube,
].flatMap((l) => Object.values(l));

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
    for (const labeller of LABELLERS) {
        const label = await labeller(url);
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
