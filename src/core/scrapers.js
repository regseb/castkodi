/**
 * @module
 */

import * as acestream from "./scraper/acestream.js";
import * as allocine from "./scraper/allocine.js";
import * as aparat from "./scraper/aparat.js";
import * as applepodcasts from "./scraper/applepodcasts.js";
import * as ardmediathek from "./scraper/ardmediathek.js";
import * as arte from "./scraper/arte.js";
import * as arteradio from "./scraper/arteradio.js";
import * as bigo from "./scraper/bigo.js";
import * as blogtalkradio from "./scraper/blogtalkradio.js";
import * as devtube from "./scraper/devtube.js";
import * as dumpert from "./scraper/dumpert.js";
import * as dailymotion from "./scraper/dailymotion.js";
import * as dmax from "./scraper/dmax.js";
// eslint-disable-next-line import/no-cycle
import * as embed from "./scraper/embed.js";
import * as flickr from "./scraper/flickr.js";
import * as francetv from "./scraper/francetv.js";
// eslint-disable-next-line import/no-cycle
import * as futurasciences from "./scraper/futurasciences.js";
import * as gamekult from "./scraper/gamekult.js";
import * as goplay from "./scraper/goplay.js";
// eslint-disable-next-line import/no-cycle
import * as iframe from "./scraper/iframe.js";
import * as jv from "./scraper/jv.js";
import * as kcaastreaming from "./scraper/kcaastreaming.js";
// eslint-disable-next-line import/no-cycle
import * as ldjson from "./scraper/ldjson.js";
// eslint-disable-next-line import/no-cycle
import * as lemonde from "./scraper/lemonde.js";
// eslint-disable-next-line import/no-cycle
import * as lepoint from "./scraper/lepoint.js";
import * as media from "./scraper/media.js";
import * as megaphone from "./scraper/megaphone.js";
// eslint-disable-next-line import/no-cycle
import * as melty from "./scraper/melty.js";
import * as mixcloud from "./scraper/mixcloud.js";
// eslint-disable-next-line import/no-cycle
import * as noscript from "./scraper/noscript.js";
// eslint-disable-next-line import/no-cycle
import * as opengraph from "./scraper/opengraph.js";
// eslint-disable-next-line import/no-cycle
import * as ouestfrance from "./scraper/ouestfrance.js";
import * as peertube from "./scraper/peertube.js";
import * as podcloud from "./scraper/podcloud.js";
import * as pokemontv from "./scraper/pokemontv.js";
import * as radio from "./scraper/radio.js";
import * as radioline from "./scraper/radioline.js";
import * as reddit from "./scraper/reddit.js";
import * as soundcloud from "./scraper/soundcloud.js";
import * as srf from "./scraper/srf.js";
// eslint-disable-next-line import/no-cycle
import * as stargr from "./scraper/stargr.js";
import * as steam from "./scraper/steam.js";
import * as tiktok from "./scraper/tiktok.js";
import * as theguardian from "./scraper/theguardian.js";
import * as torrent from "./scraper/torrent.js";
import * as twitch from "./scraper/twitch.js";
import * as ultimedia from "./scraper/ultimedia.js";
import * as veoh from "./scraper/veoh.js";
import * as videopress from "./scraper/videopress.js";
import * as videoshub from "./scraper/videoshub.js";
import * as vidlox from "./scraper/vidlox.js";
import * as vidyard from "./scraper/vidyard.js";
import * as vimeo from "./scraper/vimeo.js";
import * as viously from "./scraper/viously.js";
import * as vrtnu from "./scraper/vrtnu.js";
import * as vtmgo from "./scraper/vtmgo.js";
import * as youtube from "./scraper/youtube.js";
import * as zdf from "./scraper/zdf.js";
import { cacheable } from "./tools/cacheable.js";

/**
 * La liste des extracteurs (retournant le <em>fichier</em> extrait ou
 * <code>undefined</code>).
 *
 * @type {Function[]}
 */
const SCRAPERS = [
    // Lister les scrapers (triés par ordre alphabétique).
    acestream,
    allocine,
    aparat,
    applepodcasts,
    ardmediathek,
    arte,
    arteradio,
    bigo,
    blogtalkradio,
    devtube,
    dumpert,
    dailymotion,
    dmax,
    flickr,
    francetv,
    futurasciences,
    gamekult,
    goplay,
    jv,
    kcaastreaming,
    lemonde,
    lepoint,
    megaphone,
    melty,
    mixcloud,
    ouestfrance,
    peertube,
    podcloud,
    pokemontv,
    radio,
    radioline,
    reddit,
    soundcloud,
    srf,
    stargr,
    steam,
    tiktok,
    theguardian,
    torrent,
    twitch,
    ultimedia,
    veoh,
    videopress,
    videoshub,
    vidlox,
    vidyard,
    vimeo,
    viously,
    vrtnu,
    vtmgo,
    youtube,
    zdf,
    // Utiliser les scrapers génériques en dernier recours.
    media,
    ldjson,
    opengraph,
    iframe,
    embed,
    noscript,
].flatMap((s) => Object.values(s));

/**
 * Extrait le <em>fichier</em> d'une URL.
 *
 * @param {URL}     url               L'URL d'une page Internet.
 * @param {Object}  options           Les options de l'extraction.
 * @param {boolean} options.depth     La marque indiquant si l'extraction est en
 *                                    profondeur.
 * @param {boolean} options.incognito La marque indiquant si l'utilisateur est
 *                                    en navigation privée.
 * @returns {Promise<string|undefined>} Une promesse contenant le lien du
 *                                      <em>fichier</em> ou
 *                                      <code>undefined</code>.
 */
export const extract = async function (url, options) {
    const content = {
        html: cacheable(async () => {
            try {
                const controller = new AbortController();
                const response = await fetch(url, {
                    signal: controller.signal,
                });
                const contentType = response.headers.get("Content-Type");
                if (null !== contentType &&
                        (contentType.startsWith("text/html") ||
                         contentType.startsWith("application/xhtml+xml"))) {
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
        const file = await scraper(url, content, options);
        if (undefined !== file) {
            return file;
        }
    }

    // Si on analyse une sous-page : arrêter maintenant sans faire croire qu'une
    // URL a été trouvée (en ne retournant pas l'URL d'entrée).
    if (options.depth) {
        return undefined;
    }

    // Si l'URL analysée est ouverte dans un onglet : chercher une vidéo ou une
    // musique dans son code source (qui a pu être modifié par du JavaScript).
    try {
        const tabs = await browser.tabs.query({ url: url.href });
        for (const tab of tabs) {
            const files = await browser.tabs.executeScript(tab.id, {
                allFrames: true,
                file:      "/script/extractor.js",
            });
            // Tester aussi avec null car c'est une valeur retournée par
            // Chromium.
            const file = files.find((f) => undefined !== f && null !== f);
            if (undefined !== file) {
                return file;
            }
        }
    } catch (err) {
        // Ignorer les erreurs remontées quand le script de contenu est exécuté
        // sur un domaine bloqué (par exemple dans le Chrome Web Store ou le
        // Firefox Browser Add-ons).
        if ("The extensions gallery cannot be scripted." !== err.message &&
                "Missing host permission for the tab, and any iframes" !==
                                                                  err.message) {
            throw err;
        }
    }

    // Si aucune URL a été trouvée durant l'analyse, retourner l'URL de la page
    // car c'est peut-être un lien direct vers une vidéo ou une musique.
    return url.href;
};
