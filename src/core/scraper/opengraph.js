/**
 * @module
 * @license MIT
 * @see https://ogp.me/
 * @author Sébastien Règne
 */

// eslint-disable-next-line import/no-cycle
import { extract as metaExtract } from "../scrapers.js";
import { matchPattern } from "../tools/matchpattern.js";

/**
 * La liste des sélecteurs retournant les éléments `meta` liés aux vidéos et
 * audio d'Open Graph.
 *
 * @type {Object<string, string[]>}
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
 * Extrait les informations nécessaires pour lire une vidéo sur Kodi.
 *
 * @param {URL}      _url              L'URL d'une page quelconque.
 * @param {Object}   metadata          Les métadonnées de l'URL.
 * @param {Function} metadata.html     La fonction retournant la promesse
 *                                     contenant le document HTML ou
 *                                     `undefined`.
 * @param {Object}   context           Le contexte de l'extraction.
 * @param {boolean}  context.depth     La marque indiquant si l'extraction est
 *                                     en profondeur.
 * @param {boolean}  context.incognito La marque indiquant si l'utilisateur est
 *                                     en navigation privée.
 * @returns {Promise<string|undefined>} Une promesse contenant le lien du
 *                                      _fichier_ ou `undefined`.
 */
const actionVideo = async function (_url, metadata, context) {
    const doc = await metadata.html();
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
    if ("text/html" === type.content && !context.depth) {
        return await metaExtract(new URL(meta.content), {
            ...context,
            depth: true,
        });
    }
    return undefined;
};
export const extractVideo = matchPattern(actionVideo, "*://*/*");

/**
 * Extrait les informations nécessaires pour lire un son sur Kodi.
 *
 * @param {URL}      _url              L'URL d'une page quelconque avec
 *                                     peut-être des données Open Graph.
 * @param {Object}   metadata          Les métadonnées de l'URL.
 * @param {Function} metadata.html     La fonction retournant la promesse
 *                                     contenant le document HTML ou
 *                                     _undefined_.
 * @param {Object}   context           Le contexte de l'extraction.
 * @param {boolean}  context.depth     La marque indiquant si l'extraction est
 *                                     en profondeur.
 * @param {boolean}  context.incognito La marque indiquant si l'utilisateur est
 *                                     en navigation privée.
 * @returns {Promise<string|undefined>} Une promesse contenant le lien du
 *                                      _fichier_ ou `undefined`.
 */
const actionAudio = async function (_url, metadata, context) {
    const doc = await metadata.html();
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
    if ("text/html" === type.content && !context.depth) {
        return metaExtract(new URL(meta.content), { ...context, depth: true });
    }
    return undefined;
};
export const extractAudio = matchPattern(actionAudio, "*://*/*");

/**
 * Extrait les informations nécessaires pour lire une vidéo ou un son sur Kodi.
 *
 * @param {URL}      _url              L'URL d'une page quelconque avec
 *                                     peut-être des données Open Graph « à la
 *                                     Twitter ».
 * @param {Object}   metadata          Les métadonnées de l'URL.
 * @param {Function} metadata.html     La fonction retournant la promesse
 *                                     contenant le document HTML ou
 *                                     `undefined`.
 * @param {Object}   context           Le contexte de l'extraction.
 * @param {boolean}  context.depth     La marque indiquant si l'extraction est
 *                                     en profondeur.
 * @param {boolean}  context.incognito La marque indiquant si l'utilisateur est
 *                                     en navigation privée.
 * @returns {Promise<string|undefined>} Une promesse contenant le lien du
 *                                      _fichier_ ou `undefined`.
 * @see https://developer.x.com/en/docs/twitter-for-websites/cards/overview/markup
 */
const actionTwitter = async function (_url, metadata, context) {
    const doc = await metadata.html();
    if (undefined === doc) {
        return undefined;
    }

    const meta = doc.querySelector('meta[property="twitter:player"]');
    if (null !== meta && !context.depth) {
        return await metaExtract(new URL(meta.content), {
            ...context,
            depth: true,
        });
    }

    return undefined;
};
export const extractTwitter = matchPattern(actionTwitter, "*://*/*");

/**
 * Extrait les informations nécessaires pour lire une vidéo ou un son sur Kodi.
 *
 * @param {URL}      _url          L'URL d'une page quelconque avec peut-être
 *                                 des données Open Graph « à la Twitter ».
 * @param {Object}   metadata      Les métadonnées de l'URL.
 * @param {Function} metadata.html La fonction retournant la promesse contenant
 *                                 le document HTML ou `undefined`.
 * @returns {Promise<string|undefined>} Une promesse contenant le lien du
 *                                      _fichier_ ou `undefined`.
 * @see https://developer.x.com/en/docs/twitter-for-websites/cards/overview/markup
 */
const actionTwitterStream = async function (_url, metadata) {
    const doc = await metadata.html();
    if (undefined === doc) {
        return undefined;
    }

    const meta = doc.querySelector('meta[property="twitter:player:stream"]');
    return meta?.content;
};
export const extractTwitterStream = matchPattern(
    actionTwitterStream,
    "*://*/*",
);

/**
 * Extrait les informations nécessaires pour lire une vidéo ou un son sur Kodi.
 *
 * @param {URL}      _url          L'URL d'une page quelconque avec peut-être
 *                                 des données Open Graph « à la Yandex ».
 * @param {Object}   metadata      Les métadonnées de l'URL.
 * @param {Function} metadata.html La fonction retournant la promesse contenant
 *                                 le document HTML ou `undefined`.
 * @returns {Promise<string|undefined>} Une promesse contenant le lien du
 *                                      _fichier_ ou `undefined`.
 * @see https://yandex.com/support/video/partners/open-graph.html
 */
const actionYandex = async function (_url, metadata) {
    const doc = await metadata.html();
    if (undefined === doc) {
        return undefined;
    }

    const meta = doc.querySelector('meta[property="ya:ovs:content_url"]');
    return meta?.content;
};
export const extractYandex = matchPattern(actionYandex, "*://*/*");
