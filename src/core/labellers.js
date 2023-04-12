/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import * as dailymotion from "./labeller/dailymotion.js";
import * as dumpert from "./labeller/dumpert.js";
import * as pluginDailymotion from "./labeller/plugin/dailymotion.js";
import * as pluginDumpert from "./labeller/plugin/dumpert.js";
import * as pluginSendtokodi from "./labeller/plugin/sendtokodi.js";
import * as pluginSoundcloud from "./labeller/plugin/soundcloud.js";
import * as pluginTubed from "./labeller/plugin/tubed.js";
import * as pluginTwitch from "./labeller/plugin/twitch.js";
import * as pluginVimeo from "./labeller/plugin/vimeo.js";
import * as pluginVtmgo from "./labeller/plugin/vtmgo.js";
import * as pluginYoutube from "./labeller/plugin/youtube.js";
import * as soundcloud from "./labeller/soundcloud.js";
import * as twitch from "./labeller/twitch.js";
import * as vimeo from "./labeller/vimeo.js";
import * as vtmgo from "./labeller/vtmgo.js";
import * as youtube from "./labeller/youtube.js";
import { strip } from "./tools/sanitizer.js";

/**
 * La liste des fonctions des labellisateurs retournant le label d'une URL.
 *
 * @type {Function[]}
 */
const LABELLERS = [
    // Lister les labellisateurs des plugins (triées par ordre alphabétique).
    pluginDailymotion,
    pluginDumpert,
    pluginSendtokodi,
    pluginSoundcloud,
    pluginTubed,
    pluginTwitch,
    pluginVimeo,
    pluginVtmgo,
    pluginYoutube,
    // Lister les labellisateurs (triées par ordre alphabétique).
    dailymotion,
    dumpert,
    soundcloud,
    twitch,
    vimeo,
    vtmgo,
    youtube,
].flatMap((l) => Object.values(l));

/**
 * Extrait le label d'une URL.
 *
 * @param {URL} url L'URL du <em>fichier</em> lu dans Kodi.
 * @returns {Promise<string|undefined>} Une promesse contenant le label ou
 *                                      <code>undefined</code>.
 */
export const extract = async function (url) {
    for (const labeller of LABELLERS) {
        const label = await labeller(url, { metaExtract: extract });
        if (undefined !== label) {
            return label;
        }
    }
    return undefined;
};

/**
 * Complète un élément de la liste de lecture avec un label.
 *
 * @param {Object} item          L'élément de la liste de lecture.
 * @param {string} item.file     Le fichier de l'élément.
 * @param {string} item.label    Le label de l'élément.
 * @param {number} item.position La position de l'élément.
 * @param {string} item.title    Le titre de l'élément.
 * @param {string} item.type     Le type de l'élément.
 * @returns {Promise<Object>} Une promesse contenant l'élément complété de la
 *                            liste de lecture.
 */
export const complete = async function (item) {
    if ("" !== item.title) {
        return { ...item, label: strip(item.title) };
    }

    const url = new URL(
        item.file.startsWith("/") ? `file:/${item.file}` : item.file,
    );
    const label = await extract(url);
    if (undefined !== label) {
        return { ...item, label };
    }

    return {
        ...item,
        label: "" === item.label ? item.file : strip(item.label),
    };
};
