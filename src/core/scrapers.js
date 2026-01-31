/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import * as acast from "./scraper/acast.js";
import * as aceStream from "./scraper/acestream.js";
// eslint-disable-next-line import/no-cycle
import * as alloCine from "./scraper/allocine.js";
import * as aparat from "./scraper/aparat.js";
import * as applePodcasts from "./scraper/applepodcasts.js";
import * as arte from "./scraper/arte.js";
import * as arteRadio from "./scraper/arteradio.js";
import * as ausha from "./scraper/ausha.js";
import * as bigo from "./scraper/bigo.js";
import * as bitChute from "./scraper/bitchute.js";
import * as castbox from "./scraper/castbox.js";
import * as cbcListen from "./scraper/cbclisten.js";
import * as dailymotion from "./scraper/dailymotion.js";
import * as dmax from "./scraper/dmax.js";
import * as dumpert from "./scraper/dumpert.js";
// eslint-disable-next-line import/no-cycle
import * as embed from "./scraper/embed.js";
import * as facebook from "./scraper/facebook.js";
import * as flickr from "./scraper/flickr.js";
import * as franceTv from "./scraper/francetv.js";
// eslint-disable-next-line import/no-cycle
import * as gamekult from "./scraper/gamekult.js";
import * as goplay from "./scraper/goplay.js";
// eslint-disable-next-line import/no-cycle
import * as iframe from "./scraper/iframe.js";
// eslint-disable-next-line import/no-cycle
import * as invidious from "./scraper/invidious.js";
// eslint-disable-next-line import/no-cycle
import * as jv from "./scraper/jv.js";
import * as kcaaStreaming from "./scraper/kcaastreaming.js";
import * as kick from "./scraper/kick.js";
// eslint-disable-next-line import/no-cycle
import * as ldJson from "./scraper/ldjson.js";
// eslint-disable-next-line import/no-cycle
import * as leMonde from "./scraper/lemonde.js";
// eslint-disable-next-line import/no-cycle
import * as lePoint from "./scraper/lepoint.js";
import * as media from "./scraper/media.js";
import * as megaphone from "./scraper/megaphone.js";
import * as microdata from "./scraper/microdata.js";
import * as mixcloud from "./scraper/mixcloud.js";
import * as noscript from "./scraper/noscript.js";
// eslint-disable-next-line import/no-cycle
import * as ok from "./scraper/ok.js";
// eslint-disable-next-line import/no-cycle
import * as openGraph from "./scraper/opengraph.js";
// eslint-disable-next-line import/no-cycle
import * as ouestFrance from "./scraper/ouestfrance.js";
import * as peerTube from "./scraper/peertube.js";
import * as podCloud from "./scraper/podcloud.js";
import * as primeVideo from "./scraper/primevideo.js";
import * as reddit from "./scraper/reddit.js";
import * as rumble from "./scraper/rumble.js";
import * as soundCloud from "./scraper/soundcloud.js";
import * as srf from "./scraper/srf.js";
// eslint-disable-next-line import/no-cycle
import * as starGr from "./scraper/stargr.js";
import * as steam from "./scraper/steam.js";
import * as template from "./scraper/template.js";
// eslint-disable-next-line import/no-cycle
import * as theGuardian from "./scraper/theguardian.js";
import * as tikTok from "./scraper/tiktok.js";
import * as torrent from "./scraper/torrent.js";
import * as twitch from "./scraper/twitch.js";
import * as ultimedia from "./scraper/ultimedia.js";
import * as unknown from "./scraper/unknown.js";
import * as uqload from "./scraper/uqload.js";
import * as videoPress from "./scraper/videopress.js";
import * as vidlox from "./scraper/vidlox.js";
import * as vidyard from "./scraper/vidyard.js";
import * as vimeo from "./scraper/vimeo.js";
// eslint-disable-next-line import/no-cycle
import * as vingtMinutes from "./scraper/vingtminutes.js";
import * as viously from "./scraper/viously.js";
import * as vrtNu from "./scraper/vrtnu.js";
import * as vtmGo from "./scraper/vtmgo.js";
import * as youTube from "./scraper/youtube.js";
import * as zdf from "./scraper/zdf.js";
import { cacheable } from "./tools/cacheable.js";

/**
 * La liste des fonctions des extracteurs (retournant le _fichier_ extrait ou
 * `undefined`).
 *
 * @type {Function[]}
 */
const SCRAPERS = [
    // Lister les extracteurs (triés par ordre alphabétique).
    acast,
    aceStream,
    alloCine,
    aparat,
    applePodcasts,
    arte,
    arteRadio,
    ausha,
    bigo,
    bitChute,
    castbox,
    cbcListen,
    dmax,
    dumpert,
    facebook,
    flickr,
    franceTv,
    gamekult,
    goplay,
    jv,
    kcaaStreaming,
    kick,
    leMonde,
    lePoint,
    megaphone,
    mixcloud,
    ok,
    ouestFrance,
    podCloud,
    primeVideo,
    reddit,
    rumble,
    soundCloud,
    srf,
    starGr,
    steam,
    theGuardian,
    tikTok,
    torrent,
    twitch,
    ultimedia,
    uqload,
    videoPress,
    vidlox,
    vidyard,
    vimeo,
    vingtMinutes,
    vrtNu,
    vtmGo,
    youTube,
    zdf,
    // Mettre les extracteurs qui analysent toutes les pages à la fin.
    dailymotion,
    invidious,
    peerTube,
    viously,
    // Utiliser les extracteurs génériques en dernier recours.
    media,
    ldJson,
    microdata,
    openGraph,
    iframe,
    embed,
    // Chercher récursivement dans les éléments inertes.
    noscript,
    template,
    // Utiliser des plugins de Kodi qui chercheront des vidéos / musiques dans
    // les pages.
    unknown,
].flatMap((s) => Object.values(s));

/**
 * Extrait le _fichier_ d'une URL.
 *
 * @param {URL}     url               L'URL d'une page Internet.
 * @param {Object}  context           Le contexte de l'extraction.
 * @param {boolean} context.depth     La marque indiquant si l'extraction est en
 *                                    profondeur.
 * @param {boolean} context.incognito La marque indiquant si l'utilisateur est
 *                                    en navigation privée.
 * @returns {Promise<string|undefined>} Une promesse contenant le lien du
 *                                      _fichier_ ou `undefined`.
 */
export const extract = async (url, context) => {
    const metadata = {
        html: cacheable(async (options) => {
            try {
                const controller = new AbortController();
                const response = await fetch(url, {
                    signal: controller.signal,
                    ...options,
                });
                const contentType = response.headers.get("Content-Type");
                if (
                    contentType?.startsWith("text/html") ||
                    contentType?.startsWith("application/xhtml+xml")
                ) {
                    const text = await response.text();
                    return new DOMParser().parseFromString(text, "text/html");
                }
                // Si ce n'est pas du HTML : annuler la requête.
                controller.abort();
            } catch {
                // Ignorer le cas où l'URL n'est pas accessible.
            }
            return undefined;
        }),
    };

    for (const scraper of SCRAPERS) {
        const file = await scraper(url, metadata, context);
        if (undefined !== file) {
            return file;
        }
    }
    return undefined;
};
