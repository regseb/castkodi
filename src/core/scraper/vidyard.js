/**
 * @module
 */
/* eslint-disable require-await */

import { matchPattern } from "../tools/matchpattern.js";

/**
 * Extrait les informations nécessaire pour lire une vidéo sur Kodi.
 *
 * @param {URL} url L'URL d'une vidéo de Vidyard.
 * @returns {Promise<string>} Une promesse contenant le lien du
 *                            <em>fichier</em>.
 */
const action = async function ({ pathname }) {
    // Enlever la première barre oblique et éventuellement l'extension ".html".
    const id = pathname.slice(1)
                       .replace(/\.html$/u, "");
    const response = await fetch(`https://play.vidyard.com/player/${id}.json`);
    const { payload } = await response.json();

    if ("vyContext" in payload) {
        for (const file of payload.vyContext.chapterAttributes[0].video_files) {
            if ("stream_master" === file.profile) {
                return file.url + "|Referer=https://play.vidyard.com/";
            }
        }
    }

    return payload.chapters[0].sources.hls[0].url +
                                           "|Referer=https://play.vidyard.com/";
};
export const extract = matchPattern(action, "*://play.vidyard.com/*");
