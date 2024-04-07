/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import * as dailymotion from "./labeler/dailymotion.js";
import * as pluginDailymotion from "./labeler/plugin/dailymotion.js";
import * as pluginPrimeVideo from "./labeler/plugin/primevideo.js";
import * as pluginSendtokodi from "./labeler/plugin/sendtokodi.js";
import * as pluginSoundcloud from "./labeler/plugin/soundcloud.js";
import * as pluginTubed from "./labeler/plugin/tubed.js";
import * as pluginTwitch from "./labeler/plugin/twitch.js";
import * as pluginVimeo from "./labeler/plugin/vimeo.js";
import * as pluginVtmgo from "./labeler/plugin/vtmgo.js";
import * as pluginYoutube from "./labeler/plugin/youtube.js";
import * as soundcloud from "./labeler/soundcloud.js";
import * as twitch from "./labeler/twitch.js";
import * as vimeo from "./labeler/vimeo.js";
import * as vtmgo from "./labeler/vtmgo.js";
import * as youtube from "./labeler/youtube.js";
import { strip } from "./tools/sanitizer.js";

/**
 * La liste des fonctions des labellisateurs (retournant le label d'une URL ou
 * <code>undefined</code>).
 *
 * @type {Function[]}
 */
const LABELERS = [
    // Lister les labellisateurs des plugins (triées par ordre alphabétique).
    pluginDailymotion,
    pluginPrimeVideo,
    pluginSendtokodi,
    pluginSoundcloud,
    pluginTubed,
    pluginTwitch,
    pluginVimeo,
    pluginVtmgo,
    pluginYoutube,
    // Lister les labellisateurs (triées par ordre alphabétique).
    dailymotion,
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
    for (const labeler of LABELERS) {
        const label = await labeler(url, { metaExtract: extract });
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
