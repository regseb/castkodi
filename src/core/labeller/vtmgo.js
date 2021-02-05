/**
 * @module
 */
/* eslint-disable require-await */

import { matchPattern } from "../../tools/matchpattern.js";

/**
 * Extrait le titre d'un épisode ou d'un film de VTM GO.
 *
 * @param {URL} url L'URL utilisant le plugin de VTM GO.
 * @returns {Promise<?string>} Une promesse contenant le titre ou
 *                             <code>null</code>.
 */
const actionVideo = async function ({ pathname }) {
    // Enlever le nom de domaine car un bogue dans Firefox le déplace dans le
    // chemin. https://bugzilla.mozilla.org/show_bug.cgi?id=1374505
    const [type, uuid] = pathname.replace("//plugin.video.vtm.go", "")
                                 .slice(14).split("/");
    const response = await fetch("https://vtm.be/vtmgo/afspelen/" +
                                                         type.charAt(0) + uuid);
    const text = await response.text();
    const doc = new DOMParser().parseFromString(text, "text/html");
    return doc.querySelector("h1.player__title")?.textContent ?? null;
};
export const extractVideo = matchPattern(actionVideo,
    "plugin://plugin.video.vtm.go/play/catalog/episodes/*",
    "plugin://plugin.video.vtm.go/play/catalog/movies/*");

/**
 * Extrait le titre d'une chaine de VTM GO.
 *
 * @param {URL} url L'URL utilisant le plugin de VTM GO.
 * @returns {Promise<?string>} Une promesse contenant le titre ou
 *                             <code>null</code>.
 */
const actionChannel = async function ({ pathname }) {
    // Enlever le nom de domaine car un bogue dans Firefox le déplace dans le
    // chemin. https://bugzilla.mozilla.org/show_bug.cgi?id=1374505
    const uuid = pathname.replace("//plugin.video.vtm.go", "").slice(23);
    const response = await fetch("https://vtm.be/vtmgo/live-kijken/vtm");
    const text = await response.text();
    const doc = new DOMParser().parseFromString(text, "text/html");
    const a = doc.querySelector(`a[data-gtm*="/${uuid}/"]`);
    if (null === a) {
        return null;
    }
    return a.dataset.gtm.slice(a.dataset.gtm.lastIndexOf("/") + 1);
};
export const extractChannel = matchPattern(actionChannel,
    "plugin://plugin.video.vtm.go/play/catalog/channels/*");
