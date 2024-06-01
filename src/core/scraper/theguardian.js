/**
 * @module
 * @license MIT
 * @see https://www.theguardian.com/
 * @author Sébastien Règne
 */

// eslint-disable-next-line import/no-cycle
import { extract as metaExtract } from "../scrapers.js";
import { matchPattern } from "../tools/matchpattern.js";

/**
 * Extrait les informations nécessaires pour lire une vidéo sur Kodi.
 *
 * @param {URL}      _url              L'URL d'un article du Guardian.
 * @param {Object}   metadata          Les métadonnées de l'URL.
 * @param {Function} metadata.html     La fonction retournant la promesse
 *                                     contenant le document HTML.
 * @param {Object}   context           Le contexte de l'extraction.
 * @param {boolean}  context.depth     La marque indiquant si l'extraction est
 *                                     en profondeur.
 * @param {boolean}  context.incognito La marque indiquant si l'utilisateur est
 *                                     en navigation privée.
 * @returns {Promise<string|undefined>} Une promesse contenant le lien du
 *                                      <em>fichier</em> ou
 *                                      <code>undefined</code>.
 */
const actionVideo = async function (_url, metadata, context) {
    if (context.depth) {
        return undefined;
    }

    const doc = await metadata.html();
    const div = doc.querySelector(
        'div[data-testid^="youtube-sticky-"][data-testid$="-server"]',
    );
    if (null === div) {
        return undefined;
    }

    return await metaExtract(
        new URL(
            `https://www.youtube.com/embed/${div.dataset.testid.slice(15, -7)}`,
        ),
        { ...context, depth: true },
    );
};
export const extractVideo = matchPattern(
    actionVideo,
    "*://www.theguardian.com/*",
);

/**
 * Extrait les informations nécessaires pour lire un son sur Kodi.
 *
 * @param {URL}      _url          L'URL d'un article du Guardian.
 * @param {Object}   metadata      Les métadonnées de l'URL.
 * @param {Function} metadata.html La fonction retournant la promesse contenant
 *                                 le document HTML.
 * @returns {Promise<string|undefined>} Une promesse contenant le lien du
 *                                      <em>fichier</em> ou
 *                                      <code>undefined</code>.
 */
const actionAudio = async function (_url, metadata) {
    const doc = await metadata.html();
    const figure = doc.querySelector("figure#audio-component-container");
    return figure?.dataset.source;
};
export const extractAudio = matchPattern(
    actionAudio,
    "*://www.theguardian.com/*",
);
