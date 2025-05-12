/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import { matchPattern } from "../tools/matchpattern.js";

/**
 * Appelle l'API de Twitch.
 *
 * @param {string} operationName Le nom de l'opération.
 * @param {Object} variables     Les paramètres de l'opération.
 * @param {string} sha256Hash    Le hash de l'opération.
 * @returns {Promise<Record<string, any>>} Une promesse contenant la réponse de
 *                                         l'API.
 */
const requestApi = async (operationName, variables, sha256Hash) => {
    const response = await fetch("https://gql.twitch.tv/gql", {
        headers: { "Client-Id": "kimne78kx3ncx6brgo4mv6wki5h1ko" },
        body: JSON.stringify([
            {
                operationName,
                variables,
                extensions: { persistedQuery: { version: 1, sha256Hash } },
            },
        ]),
        method: "POST",
    });
    const json = await response.json();
    return json[0];
};

/**
 * Récupère le titre d'un clip Twitch.
 *
 * @param {string} slug L'identifiant du clip Twitch.
 * @returns {Promise<string>} Une promesse contenant le titre.
 */
const getClipTitle = async (slug) => {
    const json = await requestApi(
        "ShareClipRenderStatus",
        { slug },
        "f130048a462a0ac86bb54d653c968c514e9ab9ca94db52368c1179e97b0f16eb",
    );
    return json.data.clip.title;
};

/**
 * Récupère le titre d'une vidéo Twitch.
 *
 * @param {string} videoId L'identifiant de la vidéo Twitch.
 * @returns {Promise<string>} Une promesse contenant le titre.
 */
const getVideoTitle = async (videoId) => {
    const json = await requestApi(
        "AdRequestHandling",
        {
            isLive: false,
            login: "",
            isVOD: true,
            vodID: videoId,
            isCollection: false,
            collectionID: "",
        },
        "61a5ecca6da3d924efa9dbde811e051b8a10cb6bd0fe22c372c2f4401f3e88d1",
    );
    return json.data.video.title;
};

/**
 * Récupère le titre d'un _live_ Twitch.
 *
 * @param {string} channelName L'identifiant du _live_ Twitch.
 * @returns {Promise<string>} Une promesse contenant le titre.
 */
const getLiveTitle = async (channelName) => {
    const json = await requestApi(
        "ChannelShell",
        { login: channelName },
        "580ab410bcd0c1ad194224957ae2241e5d252b2c5173d8e0cce9d32d5bb14efe",
    );
    return json.data.userOrError.displayName;
};

/**
 * Extrait le titre d'un clip Twitch.
 *
 * @param {URL} url L'URL du clip Twitch.
 * @returns {Promise<string>} Une promesse contenant le titre.
 */
const actionClip = ({ pathname, searchParams }) => {
    if ("/embed" === pathname) {
        return searchParams.has("clip")
            ? getClipTitle(searchParams.get("clip"))
            : Promise.resolve(undefined);
    }
    return getClipTitle(pathname.slice(1));
};
export const extractClip = matchPattern(actionClip, "*://clips.twitch.tv/*");

/**
 * Extrait le titre d'une vidéo, d'un clip ou d'un  _live_ Twitch.
 *
 * @param {URL} url L'URL de la vidéo, du clip ou du _live_ Twitch.
 * @returns {Promise<string>} Une promesse contenant le titre.
 */
const action = ({ pathname }) => {
    if (pathname.startsWith("/videos/")) {
        return getVideoTitle(pathname.slice(8));
    }
    if (pathname.includes("/clip/")) {
        return getClipTitle(pathname.slice(pathname.lastIndexOf("/") + 1));
    }
    return getLiveTitle(pathname.slice(1));
};
export const extract = matchPattern(action, "*://www.twitch.tv/*");
