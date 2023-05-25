/**
 * @module
 * @license MIT
 * @see https://vtm.be/vtmgo
 * @author Sébastien Règne
 */
/* eslint-disable require-await */

import { kodi } from "../jsonrpc/kodi.js";
import * as sendtokodiPlugin from "../plugin/sendtokodi.js";
import * as vtmgoPlugin from "../plugin/vtmgo.js";
import { matchPattern } from "../tools/matchpattern.js";

/**
 * Répartit un épisode VTM GO à un plugin de Kodi.
 *
 * @param {string} episodeUuid L'UUID de l'épisode VTM GO.
 * @returns {Promise<string>} Une promesse contenant le lien du
 *                            <em>fichier</em>.
 */
const dispatchEpisode = async function (episodeUuid) {
    const addons = new Set(await kodi.addons.getAddons("video"));
    if (addons.has("plugin.video.vtm.go")) {
        return vtmgoPlugin.generateEpisodeUrl(episodeUuid);
    }
    if (addons.has("plugin.video.sendtokodi")) {
        return sendtokodiPlugin.generateUrl(
            new URL(`https://www.vtm.be/vtmgo/afspelen/e${episodeUuid}`),
        );
    }
    // Envoyer par défaut au plugin VTM GO.
    return vtmgoPlugin.generateEpisodeUrl(episodeUuid);
};

/**
 * Répartit un film VTM GO à un plugin de Kodi.
 *
 * @param {string} movieUuid L'UUID du film VTM GO.
 * @returns {Promise<string>} Une promesse contenant le lien du
 *                            <em>fichier</em>.
 */
const dispatchMovie = async function (movieUuid) {
    const addons = new Set(await kodi.addons.getAddons("video"));
    if (addons.has("plugin.video.vtm.go")) {
        return vtmgoPlugin.generateMovieUrl(movieUuid);
    }
    if (addons.has("plugin.video.sendtokodi")) {
        return sendtokodiPlugin.generateUrl(
            new URL(`https://www.vtm.be/vtmgo/afspelen/m${movieUuid}`),
        );
    }
    // Envoyer par défaut au plugin VTM GO.
    return vtmgoPlugin.generateMovieUrl(movieUuid);
};

/**
 * Répartit une chaine VTM GO à un plugin de Kodi.
 *
 * @param {string} channelUuid L'UUID de la chaine VTM GO.
 * @returns {Promise<string>} Une promesse contenant le lien du
 *                            <em>fichier</em>.
 */
const dispatchChannel = async function (channelUuid) {
    const addons = new Set(await kodi.addons.getAddons("video"));
    if (addons.has("plugin.video.vtm.go")) {
        return vtmgoPlugin.generateChannelUrl(channelUuid);
    }
    if (addons.has("plugin.video.sendtokodi")) {
        return sendtokodiPlugin.generateUrl(
            new URL(`https://www.vtm.be/vtmgo/live-kijken/${channelUuid}`),
        );
    }
    // Envoyer par défaut au plugin VTM GO.
    return vtmgoPlugin.generateChannelUrl(channelUuid);
};

/**
 * Extrait les informations nécessaire pour lire un épisode sur Kodi.
 *
 * @param {URL} url L'URL d'un épisode de VTM GO.
 * @returns {Promise<string>} Une promesse contenant le lien du
 *                            <em>fichier</em>.
 */
const actionEpisode = async function ({ pathname }) {
    return dispatchEpisode(pathname.slice(17));
};

export const extractEpisode = matchPattern(
    actionEpisode,
    "*://vtm.be/vtmgo/afspelen/e*",
    "*://www.vtm.be/vtmgo/afspelen/e*",
);

/**
 * Extrait les informations nécessaire pour lire un film sur Kodi.
 *
 * @param {URL} url L'URL d'un film de VTM GO.
 * @returns {Promise<string>} Une promesse contenant le lien du
 *                            <em>fichier</em>.
 */
const actionMovie = async function ({ pathname }) {
    return dispatchMovie(pathname.slice(17));
};

export const extractMovie = matchPattern(
    actionMovie,
    "*://vtm.be/vtmgo/afspelen/m*",
    "*://www.vtm.be/vtmgo/afspelen/m*",
);

/**
 * Extrait les informations nécessaire pour lire un film sur Kodi.
 *
 * @param {URL} url L'URL d'une page d'un film de VTM GO.
 * @returns {Promise<string>} Une promesse contenant le lien du
 *                            <em>fichier</em>.
 */
const actionMoviePage = async function ({ pathname }) {
    return dispatchMovie(pathname.slice(pathname.indexOf("~m") + 2));
};

export const extractMoviePage = matchPattern(
    actionMoviePage,
    "*://vtm.be/vtmgo/*~m*",
    "*://www.vtm.be/vtmgo/*~m*",
);

/**
 * Extrait les informations nécessaire pour lire une chaine sur Kodi.
 *
 * @param {URL}      _url         L'URL d'une chaine VTM GO.
 * @param {Object}   content      Le contenu de l'URL.
 * @param {Function} content.html La fonction retournant la promesse contenant
 *                                le document HTML.
 * @returns {Promise<string|undefined>} Une promesse contenant le lien du
 *                                      <em>fichier</em> ou
 *                                      <code>undefined</code>.
 */
const actionChannel = async function (_url, content) {
    const doc = await content.html();
    const div = doc.querySelector("div.fjs-player[data-id]");
    return null === div ? undefined : dispatchChannel(div.dataset.id);
};
export const extractChannel = matchPattern(
    actionChannel,
    "*://vtm.be/vtmgo/live-kijken/*",
    "*://www.vtm.be/vtmgo/live-kijken/*",
);
