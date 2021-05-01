/**
 * @module
 */
/* eslint-disable require-await */

import { matchPattern }           from "../../tools/matchpattern.js";
// eslint-disable-next-line import/no-cycle
import { extract as metaExtract } from "../scrapers.js";

/**
 * La liste des sélecteur retournant les éléments <code>meta</code> liés aux
 * vidéos et audio d'Open Graph.
 *
 * @type {Object<string, string[]>}
 * @see https://ogp.me/
 */
const SELECTORS = {
    VIDEO: [
        `meta[property="og:video:secure_url"]`,
        `meta[property="og:video:url"]`,
        `meta[property="og:video"]`,
    ],
    AUDIO: [
        `meta[property="og:audio:secure_url"]`,
        `meta[property="og:audio:url"]`,
        `meta[property="og:audio"]`,
    ],
};

/**
 * Extrait les informations nécessaire pour lire une vidéo sur Kodi.
 *
 * @param {URL}      _url              L'URL d'une page quelconque.
 * @param {Object}   content           Le contenu de l'URL.
 * @param {Function} content.html      La fonction retournant la promesse
 *                                     contenant le document HTML ou
 *                                     <code>null</code>.
 * @param {Object}   options           Les options de l'extraction.
 * @param {boolean}  options.depth     La marque indiquant si l'extraction est
 *                                     en profondeur.
 * @param {boolean}  options.incognito La marque indiquant si l'utilisateur est
 *                                     en navigation privée.
 * @returns {Promise<?string>} Une promesse contenant le lien du
 *                             <em>fichier</em> ou <code>null</code>.
 */
const actionVideo = async function (_url, content, options) {
    const doc = await content.html();
    if (null === doc) {
        return null;
    }

    const type = doc.querySelector(`meta[property="og:video:type"]`);
    if (null === type) {
        return null;
    }

    const meta = SELECTORS.VIDEO.map((s) => doc.querySelector(s))
                                .find((m) => null !== m && "" !== m.content);
    if (undefined === meta) {
        return null;
    }

    if (type.content.startsWith("video/")) {
        return meta.content;
    }
    if ("text/html" === type.content && !options.depth) {
        return metaExtract(new URL(meta.content), { ...options, depth: true });
    }
    return null;
};
export const extractVideo = matchPattern(actionVideo, "*://*/*");

/**
 * Extrait les informations nécessaire pour lire un son sur Kodi.
 *
 * @param {URL}      _url              L'URL d'une page quelconque.
 * @param {Object}   content           Le contenu de l'URL.
 * @param {Function} content.html      La fonction retournant la promesse
 *                                     contenant le document HTML ou
 *                                     <code>null</code>.
 * @param {Object}   options           Les options de l'extraction.
 * @param {boolean}  options.depth     La marque indiquant si l'extraction est
 *                                     en profondeur.
 * @param {boolean}  options.incognito La marque indiquant si l'utilisateur est
 *                                     en navigation privée.
 * @returns {Promise<?string>} Une promesse contenant le lien du
 *                             <em>fichier</em> ou <code>null</code>.
 */
const actionAudio = async function (_url, content, options) {
    const doc = await content.html();
    if (null === doc) {
        return null;
    }

    const type = doc.querySelector(`meta[property="og:audio:type"]`);
    if (null === type) {
        return null;
    }

    const meta = SELECTORS.AUDIO.map((s) => doc.querySelector(s))
                                .find((m) => null !== m && "" !== m.content);
    if (undefined === meta) {
        return null;
    }

    if (type.content.startsWith("audio/")) {
        return meta.content;
    }
    if ("text/html" === type.content && !options.depth) {
        return metaExtract(new URL(meta.content), { ...options, depth: true });
    }
    return null;
};
export const extractAudio = matchPattern(actionAudio, "*://*/*");

/**
 * Extrait les informations nécessaire pour lire une vidéo ou un son sur Kodi.
 *
 * @param {URL}      _url         L'URL d'une page quelconque.
 * @param {Object}   content      Le contenu de l'URL.
 * @param {Function} content.html La fonction retournant la promesse contenant
 *                                le document HTML ou <code>null</code>.
 * @returns {Promise<?string>} Une promesse contenant le lien du
 *                             <em>fichier</em> ou <code>null</code>.
 * @see https://yandex.com/support/video/partners/open-graph.html
 */
const actionYandex = async function (_url, content) {
    const doc = await content.html();
    if (null === doc) {
        return null;
    }

    const meta = doc.querySelector(`meta[property="ya:ovs:content_url"]`);
    return meta?.content ?? null;
};
export const extractYandex = matchPattern(actionYandex, "*://*/*");
