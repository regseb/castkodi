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
 * @constant {Array.<string>}
 * @see {@link https://ogp.me/}
 * @see {@link https://yandex.com/support/video/partners/open-graph.html}
 */
const SELECTORS = {
    "VIDEO": [
        `meta[property="og:video:secure_url"]`,
        `meta[property="og:video:url"]`,
        `meta[property="og:video"]`
    ],
    "AUDIO": [
        `meta[property="og:audio:secure_url"]`,
        `meta[property="og:audio:url"]`,
        `meta[property="og:audio"]`
    ]
};

/**
 * Extrait les informations nécessaire pour lire une vidéo ou un son sur Kodi.
 *
 * @param {URL}          _url    L'URL d'une page quelconque.
 * @param {HTMLDocument} doc     Le contenu HTML de la page.
 * @param {object}       options Les options de l'extraction.
 * @returns {Promise.<?string>} Une promesse contenant le lien du
 *                              <em>fichier</em> ou <code>null</code>.
 */
const actionVideo = async function (_url, doc, options) {
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
    if ("text/html" === type.content && 0 === options.depth) {
        return metaExtract(new URL(meta.content),
                           { ...options, "depth": options.depth + 1 });
    }
    return null;
};
export const extractVideo = matchPattern(actionVideo, "*://*/*");

/**
 * Extrait les informations nécessaire pour lire une vidéo ou un son sur Kodi.
 *
 * @param {URL}          _url    L'URL d'une page quelconque.
 * @param {HTMLDocument} doc     Le contenu HTML de la page.
 * @param {object}       options Les options de l'extraction.
 * @returns {Promise.<?string>} Une promesse contenant le lien du
 *                              <em>fichier</em> ou <code>null</code>.
 */
const actionAudio = async function (_url, doc, options) {
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
    if ("text/html" === type.content && 0 === options.depth) {
        return metaExtract(new URL(meta.content),
                           { ...options, "depth": options.depth + 1 });
    }
    return null;
};
export const extractAudio = matchPattern(actionAudio, "*://*/*");

/**
 * Extrait les informations nécessaire pour lire une vidéo ou un son sur Kodi.
 *
 * @param {URL}          _url L'URL d'une page quelconque.
 * @param {HTMLDocument} doc  Le contenu HTML de la page.
 * @returns {Promise.<?string>} Une promesse contenant le lien du
 *                              <em>fichier</em> ou <code>null</code>.
 */
const actionYandex = async function (_url, doc) {
    if (null === doc) {
        return null;
    }

    const meta = doc.querySelector(`meta[property="ya:ovs:content_url"]`);
    return null === meta ? null
                         : meta.content;
};
export const extractYandex = matchPattern(actionYandex, "*://*/*");
