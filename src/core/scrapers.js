/**
 * @module
 */

import { cacheable }       from "../tools/cacheable.js";
import * as acestream      from "./scraper/acestream.js";
import * as allocine       from "./scraper/allocine.js";
import * as applepodcasts  from "./scraper/applepodcasts.js";
import * as arte           from "./scraper/arte.js";
import * as arteradio      from "./scraper/arteradio.js";
import * as audio          from "./scraper/audio.js";
import * as bigo           from "./scraper/bigo.js";
import * as blogtalkradio  from "./scraper/blogtalkradio.js";
import * as devtube        from "./scraper/devtube.js";
import * as dumpert        from "./scraper/dumpert.js";
import * as dailymotion    from "./scraper/dailymotion.js";
import * as flickr         from "./scraper/flickr.js";
import * as francetv       from "./scraper/francetv.js";
// eslint-disable-next-line import/no-cycle
import * as futurasciences from "./scraper/futurasciences.js";
import * as gamekult       from "./scraper/gamekult.js";
// eslint-disable-next-line import/no-cycle
import * as iframe         from "./scraper/iframe.js";
import * as kcaastreaming  from "./scraper/kcaastreaming.js";
// eslint-disable-next-line import/no-cycle
import * as konbini        from "./scraper/konbini.js";
import * as lbry           from "./scraper/lbry.js";
// eslint-disable-next-line import/no-cycle
import * as ldjson         from "./scraper/ldjson.js";
// eslint-disable-next-line import/no-cycle
import * as lemonde        from "./scraper/lemonde.js";
// eslint-disable-next-line import/no-cycle
import * as lepoint        from "./scraper/lepoint.js";
import * as megaphone      from "./scraper/megaphone.js";
import * as melty          from "./scraper/melty.js";
import * as metacafe       from "./scraper/metacafe.js";
import * as mixcloud       from "./scraper/mixcloud.js";
import * as mycloudplayers from "./scraper/mycloudplayers.js";
// eslint-disable-next-line import/no-cycle
import * as noscript       from "./scraper/noscript.js";
import * as onetv          from "./scraper/onetv.js";
// eslint-disable-next-line import/no-cycle
import * as opengraph      from "./scraper/opengraph.js";
// eslint-disable-next-line import/no-cycle
import * as ouestfrance    from "./scraper/ouestfrance.js";
import * as peertube       from "./scraper/peertube.js";
import * as podcloud       from "./scraper/podcloud.js";
import * as pokemontv      from "./scraper/pokemontv.js";
import * as radio          from "./scraper/radio.js";
import * as radioline      from "./scraper/radioline.js";
import * as soundcloud     from "./scraper/soundcloud.js";
// eslint-disable-next-line import/no-cycle
import * as stargr         from "./scraper/stargr.js";
import * as steam          from "./scraper/steam.js";
import * as tiktok         from "./scraper/tiktok.js";
import * as theguardian    from "./scraper/theguardian.js";
import * as torrent        from "./scraper/torrent.js";
import * as twitch         from "./scraper/twitch.js";
import * as ultimedia      from "./scraper/ultimedia.js";
import * as veoh           from "./scraper/veoh.js";
import * as video          from "./scraper/video.js";
import * as videopress     from "./scraper/videopress.js";
import * as vidlox         from "./scraper/vidlox.js";
import * as vimeo          from "./scraper/vimeo.js";
import * as viously        from "./scraper/viously.js";
import * as vrtnu          from "./scraper/vrtnu.js";
import * as vtmgo          from "./scraper/vtmgo.js";
import * as youtube        from "./scraper/youtube.js";

/**
 * La liste des extracteurs (retournant le <em>fichier</em> extrait ou
 * <code>null</code>).
 *
 * @constant {Function[]}
 */
const SCRAPERS = [
    // Lister les scrapers (triés par ordre alphabétique).
    acestream,
    allocine,
    applepodcasts,
    arte,
    arteradio,
    bigo,
    blogtalkradio,
    devtube,
    dumpert,
    dailymotion,
    flickr,
    francetv,
    futurasciences,
    gamekult,
    kcaastreaming,
    konbini,
    lbry,
    lemonde,
    lepoint,
    megaphone,
    melty,
    metacafe,
    mixcloud,
    mycloudplayers,
    onetv,
    ouestfrance,
    peertube,
    podcloud,
    pokemontv,
    radio,
    radioline,
    soundcloud,
    stargr,
    steam,
    tiktok,
    theguardian,
    torrent,
    twitch,
    ultimedia,
    veoh,
    videopress,
    vidlox,
    vimeo,
    viously,
    vrtnu,
    vtmgo,
    youtube,
    // Utiliser les scrapers génériques en dernier recours.
    video,
    audio,
    ldjson,
    opengraph,
    iframe,
    noscript,
].flatMap((s) => Object.values(s));

/**
 * Extrait le <em>fichier</em> d'une URL.
 *
 * @function
 * @param {URL}     url               L'URL d'une page Internet.
 * @param {Object}  options           Les options de l'extraction.
 * @param {boolean} options.depth     La marque indiquant si l'extraction est en
 *                                    profondeur.
 * @param {boolean} options.incognito La marque indiquant si l'utilisateur est
 *                                    en navigation privée.
 * @returns {Promise<?string>} Une promesse contenant le lien du
 *                             <em>fichier</em> ou <code>null</code>.
 */
export const extract = async function (url, options) {
    const content = {
        html: cacheable(async () => {
            try {
                const controller = new AbortController();
                const response = await fetch(url.href, {
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
            return null;
        }),
    };

    for (const scraper of SCRAPERS) {
        const file = await scraper(url, content, options);
        if (null !== file) {
            return file;
        }
    }
    return options.depth ? null
                         : url.href;
};
