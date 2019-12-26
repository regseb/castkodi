/**
 * @module
 */
/* eslint-disable import/no-namespace */

import * as acestream      from "./scraper/acestream.js";
import * as allocine       from "./scraper/allocine.js";
import * as applepodcasts  from "./scraper/applepodcasts.js";
import * as arte           from "./scraper/arte.js";
import * as arteradio      from "./scraper/arteradio.js";
import * as audio          from "./scraper/audio.js";
import * as blogtalkradio  from "./scraper/blogtalkradio.js";
import * as devtube        from "./scraper/devtube.js";
import * as dumpert        from "./scraper/dumpert.js";
import * as dailymotion    from "./scraper/dailymotion.js";
import * as flickr         from "./scraper/flickr.js";
import * as full30         from "./scraper/full30.js";
import * as gamekult       from "./scraper/gamekult.js";
// eslint-disable-next-line import/no-cycle
import * as iframe         from "./scraper/iframe.js";
import * as kcaastreaming  from "./scraper/kcaastreaming.js";
import * as ldjson         from "./scraper/ldjson.js";
import * as mixcloud       from "./scraper/mixcloud.js";
import * as mixer          from "./scraper/mixer.js";
import * as mycloudplayers from "./scraper/mycloudplayers.js";
import * as onetv          from "./scraper/onetv.js";
// eslint-disable-next-line import/no-cycle
import * as opengraph      from "./scraper/opengraph.js";
import * as peertube       from "./scraper/peertube.js";
import * as podcloud       from "./scraper/podcloud.js";
import * as radio          from "./scraper/radio.js";
import * as radioline      from "./scraper/radioline.js";
import * as rutube         from "./scraper/rutube.js";
import * as soundcloud     from "./scraper/soundcloud.js";
import * as steam          from "./scraper/steam.js";
import * as torrent        from "./scraper/torrent.js";
import * as twitch         from "./scraper/twitch.js";
import * as video          from "./scraper/video.js";
import * as vimeo          from "./scraper/vimeo.js";
import * as vrtnu          from "./scraper/vrtnu.js";
import * as youtube        from "./scraper/youtube.js";

/**
 * La liste des extracteurs (retournant le <em>fichier</em> extrait ou
 * <code>null</code>).
 *
 * @constant {Array.<Function>}
 */
const SCRAPERS = [
    // Lister les scrapers (triés par ordre alphabétique).
    acestream,
    allocine,
    applepodcasts,
    arte,
    arteradio,
    blogtalkradio,
    devtube,
    dumpert,
    dailymotion,
    flickr,
    full30,
    gamekult,
    kcaastreaming,
    mixcloud,
    mixer,
    mycloudplayers,
    onetv,
    peertube,
    podcloud,
    radio,
    radioline,
    rutube,
    soundcloud,
    steam,
    torrent,
    twitch,
    vimeo,
    vrtnu,
    youtube,
    // Utiliser les scrapers génériques en dernier recours.
    video,
    audio,
    ldjson,
    opengraph,
    iframe
].flatMap((s) => Object.values(s));

/**
 * Extrait le <em>fichier</em> d'une URL.
 *
 * @function
 * @param {URL}    url     L'URL d'une page Internet.
 * @param {object} options Les options de l'extraction.
 * @returns {Promise.<?string>} Une promesse contenant le lien du
 *                              <em>fichier</em> ou <code>null</code>.
 */
export const extract = async function (url, options) {
    let doc = null;
    try {
        const response = await fetch(url.href);
        const contentType = response.headers.get("Content-Type");
        if (null !== contentType &&
                (contentType.startsWith("text/html") ||
                 contentType.startsWith("application/xhtml+xml"))) {
            const text = await response.text();
            doc = new DOMParser().parseFromString(text, "text/html");
        }
    } catch {
        // Ignorer le cas où l'URL n'est pas accessible.
    }

    for (const scraper of SCRAPERS) {
        const file = await scraper(url, doc, options);
        if (null !== file) {
            return file;
        }
    }
    return 0 < options.depth ? null
                             : url.href;
};
