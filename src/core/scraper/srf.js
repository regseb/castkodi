/**
 * @module
 * @license MIT
 * @see https://www.srf.ch/
 * @author Sébastien Règne
 */
/* eslint-disable require-await */

import { matchPattern } from "../tools/matchpattern.js";

/**
 * L'URL de l'API de Play SRF pour obtenir des informations sur la vidéo.
 *
 * @type {string}
 */
const API_URL =
    "https://il.srgssr.ch/integrationlayer/2.0/mediaComposition/byUrn/";

/**
 * Appelle l'API de Play SRF pour en récupérer l'URL de la vidéo.
 *
 * @param {string} urn L'URN (Uniform Resource Name) d'une vidéo de Play SRF.
 * @returns {Promise<string|undefined>} Une promesse contenant le lien du
 *                                      <em>fichier</em> ou
 *                                      <code>undefined</code>.
 */
const getVideoUrl = async function (urn) {
    const response = await fetch(API_URL + urn);
    const json = await response.json();
    return json.chapterList?.[0].resourceList[0].analyticsMetadata.media_url;
};

/**
 * Extrait les informations nécessaire pour lire une vidéo sur Kodi.
 *
 * @param {URL} url L'URL d'une vidéo de Play SRF.
 * @returns {Promise<string|undefined>} Une promesse contenant le lien du
 *                                      <em>fichier</em> ou
 *                                      <code>undefined</code>.
 */
const actionVideo = async function ({ searchParams }) {
    if (!searchParams.has("urn")) {
        return undefined;
    }

    return getVideoUrl(searchParams.get("urn"));
};
export const extractVideo = matchPattern(
    actionVideo,
    "*://www.srf.ch/play/tv/*/video/*",
);

/**
 * Extrait les informations nécessaire pour lire une vidéo sur Kodi.
 *
 * @param {URL} url L'URL d'une page de redirection vers une vidéo de Play SRF.
 * @returns {Promise<string|undefined>} Une promesse contenant le lien du
 *                                      <em>fichier</em> ou
 *                                      <code>undefined</code>.
 */
const actionRedirect = async function ({ pathname }) {
    return getVideoUrl("urn:srf:video:" + pathname.slice(25));
};
export const extractRedirect = matchPattern(
    actionRedirect,
    "*://www.srf.ch/play/tv/redirect/detail/*",
);
