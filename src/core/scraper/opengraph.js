/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

// eslint-disable-next-line import/no-cycle
import { extract as metaExtract } from "../scrapers.js";
import { matchPattern } from "../tools/matchpattern.js";

/**
 * La liste des sélecteur retournant les éléments <code>meta</code> liés aux
 * vidéos et audio d'Open Graph.
 *
 * @type {Object<string, string[]>}
 * @see https://ogp.me/
 */
const SELECTORS = {
    VIDEO: [
        'meta[property="og:video:secure_url"]',
        'meta[property="og:video:url"]',
        'meta[property="og:video"]',
    ],
    AUDIO: [
        'meta[property="og:audio:secure_url"]',
        'meta[property="og:audio:url"]',
        'meta[property="og:audio"]',
    ],
};

/**
 * Extrait les informations nécessaire pour lire une vidéo sur Kodi.
 *
 * @param {URL}      _url              L'URL d'une page quelconque.
 * @param {Object}   content           Le contenu de l'URL.
 * @param {Function} content.html      La fonction retournant la promesse
 *                                     contenant le document HTML ou
 *                                     <code>undefined</code>.
 * @param {Object}   options           Les options de l'extraction.
 * @param {boolean}  options.depth     La marque indiquant si l'extraction est
 *                                     en profondeur.
 * @param {boolean}  options.incognito La marque indiquant si l'utilisateur est
 *                                     en navigation privée.
 * @returns {Promise<string|undefined>} Une promesse contenant le lien du
 *                                      <em>fichier</em> ou
 *                                      <code>undefined</code>.
 */
const actionVideo = async function (_url, content, options) {
    const doc = await content.html();
    if (undefined === doc) {
        return undefined;
    }

    const type = doc.querySelector('meta[property="og:video:type"]');
    const meta = SELECTORS.VIDEO.map((s) => doc.querySelector(s)).find(
        (m) => null !== m && "" !== m.content,
    );
    if (undefined === meta) {
        return undefined;
    }

    if (null === type || type.content.startsWith("video/")) {
        return meta.content;
    }
    if ("text/html" === type.content && !options.depth) {
        return metaExtract(new URL(meta.content), { ...options, depth: true });
    }
    return undefined;
};
export const extractVideo = matchPattern(actionVideo, "*://*/*");

/**
 * Extrait les informations nécessaire pour lire un son sur Kodi.
 *
 * @param {URL}      _url              L'URL d'une page quelconque avec
 *                                     peut-être des données Open Graph.
 * @param {Object}   content           Le contenu de l'URL.
 * @param {Function} content.html      La fonction retournant la promesse
 *                                     contenant le document HTML ou
 *                                     <code>undefined</code>.
 * @param {Object}   options           Les options de l'extraction.
 * @param {boolean}  options.depth     La marque indiquant si l'extraction est
 *                                     en profondeur.
 * @param {boolean}  options.incognito La marque indiquant si l'utilisateur est
 *                                     en navigation privée.
 * @returns {Promise<string|undefined>} Une promesse contenant le lien du
 *                                      <em>fichier</em> ou
 *                                      <code>undefined</code>.
 */
const actionAudio = async function (_url, content, options) {
    const doc = await content.html();
    if (undefined === doc) {
        return undefined;
    }

    const type = doc.querySelector('meta[property="og:audio:type"]');
    const meta = SELECTORS.AUDIO.map((s) => doc.querySelector(s)).find(
        (m) => null !== m && "" !== m.content,
    );
    if (undefined === meta) {
        return undefined;
    }

    if (null === type || type.content.startsWith("audio/")) {
        return meta.content;
    }
    if ("text/html" === type.content && !options.depth) {
        return metaExtract(new URL(meta.content), { ...options, depth: true });
    }
    return undefined;
};
export const extractAudio = matchPattern(actionAudio, "*://*/*");

/**
 * Extrait les informations nécessaire pour lire une vidéo ou un son sur Kodi.
 *
 * @param {URL}      _url         L'URL d'une page quelconque avec peut-être des
 *                                données Open Graph « à la Twitter ».
 * @param {Object}   content      Le contenu de l'URL.
 * @param {Function} content.html La fonction retournant la promesse contenant
 *                                le document HTML ou <code>undefined</code>.
 * @returns {Promise<string|undefined>} Une promesse contenant le lien du
 *                                      <em>fichier</em> ou
 *                                      <code>undefined</code>.
 * @see https://developer.twitter.com/docs/twitter-for-websites/cards/overview
 */
const actionTwitter = async function (_url, content) {
    const doc = await content.html();
    if (undefined === doc) {
        return undefined;
    }

    const meta = doc.querySelector('meta[property="twitter:player:stream"]');
    return meta?.content;
};
export const extractTwitter = matchPattern(actionTwitter, "*://*/*");

/**
 * Extrait les informations nécessaire pour lire une vidéo ou un son sur Kodi.
 *
 * @param {URL}      _url         L'URL d'une page quelconque avec peut-être des
 *                                données Open Graph « à la Yandex ».
 * @param {Object}   content      Le contenu de l'URL.
 * @param {Function} content.html La fonction retournant la promesse contenant
 *                                le document HTML ou <code>undefined</code>.
 * @returns {Promise<string|undefined>} Une promesse contenant le lien du
 *                                      <em>fichier</em> ou
 *                                      <code>undefined</code>.
 * @see https://yandex.com/support/video/partners/open-graph.html
 */
const actionYandex = async function (_url, content) {
    const doc = await content.html();
    if (undefined === doc) {
        return undefined;
    }

    const meta = doc.querySelector('meta[property="ya:ovs:content_url"]');
    return meta?.content;
};
export const extractYandex = matchPattern(actionYandex, "*://*/*");
