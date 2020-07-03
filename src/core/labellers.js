/**
 * @module
 */

/* eslint-disable import/no-namespace */
import * as dailymotion from "./labeller/dailymotion.js";
import * as dumpert     from "./labeller/dumpert.js";
import * as soundcloud  from "./labeller/soundcloud.js";
import * as twitch      from "./labeller/twitch.js";
import * as vimeo       from "./labeller/vimeo.js";
import * as youtube     from "./labeller/youtube.js";
/* eslint-enable import/no-namespace */

/**
 * La liste des étiqueteuses (retournant le label extrait ou <code>null</code>).
 *
 * @constant {Array.<Function>}
 */
const LABELLERS = [
    // Lister les étiqueteuses (triées par ordre alphabétique).
    dailymotion,
    dumpert,
    soundcloud,
    twitch,
    vimeo,
    youtube,
].flatMap((l) => Object.values(l));

/**
 * Extrait un titre d'une URL.
 *
 * @function
 * @param {object} item       L'élément de la liste de lecture.
 * @param {string} item.file  Le fichier de l'élément.
 * @param {string} item.label Le label de l'élément.
 * @returns {Promise.<string>} Une promesse contenant le titre.
 */
export const extract = async function (item) {
    const url = new URL(item.file.startsWith("/") ? "file:/" + item.file
                                                  : item.file);
    for (const labeller of LABELLERS) {
        const label = await labeller(url);
        if (null !== label) {
            return label;
        }
    }
    return "" === item.label ? item.file
                             : item.label;
};
