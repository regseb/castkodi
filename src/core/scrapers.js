/**
 * @module
 */

import { rules as acestream }      from "./scraper/acestream.js";
import { rules as allocine }       from "./scraper/allocine.js";
import { rules as applepodcasts }  from "./scraper/applepodcasts.js";
import { rules as arte }           from "./scraper/arte.js";
import { rules as arteradio }      from "./scraper/arteradio.js";
import { rules as blogtalkradio }  from "./scraper/blogtalkradio.js";
import { rules as devtube }        from "./scraper/devtube.js";
import { rules as dumpert }        from "./scraper/dumpert.js";
import { rules as dailymotion }    from "./scraper/dailymotion.js";
import { rules as facebook }       from "./scraper/facebook.js";
import { rules as flickr }         from "./scraper/flickr.js";
import { rules as full30 }         from "./scraper/full30.js";
import { rules as gamekult }       from "./scraper/gamekult.js";
import { rules as generics }       from "./scraper/generics.js";
import { rules as instagram }      from "./scraper/instagram.js";
import { rules as jamendo }        from "./scraper/jamendo.js";
import { rules as jeuxvideocom }   from "./scraper/jeuxvideocom.js";
import { rules as kcaastreaming }  from "./scraper/kcaastreaming.js";
import { rules as mixcloud }       from "./scraper/mixcloud.js";
import { rules as mixer }          from "./scraper/mixer.js";
import { rules as mycloudplayers } from "./scraper/mycloudplayers.js";
import { rules as onetv }          from "./scraper/onetv.js";
import { rules as peertube }       from "./scraper/peertube.js";
import { rules as pippa }          from "./scraper/pippa.js";
import { rules as podcloud }       from "./scraper/podcloud.js";
import { rules as radio }          from "./scraper/radio.js";
import { rules as radioline }      from "./scraper/radioline.js";
import { rules as rutube }         from "./scraper/rutube.js";
import { rules as soundcloud }     from "./scraper/soundcloud.js";
import { rules as steam }          from "./scraper/steam.js";
import { rules as stormotv }       from "./scraper/stormotv.js";
import { rules as tiktok }         from "./scraper/tiktok.js";
import { rules as torrent }        from "./scraper/torrent.js";
import { rules as twitch }         from "./scraper/twitch.js";
import { rules as vimeo }          from "./scraper/vimeo.js";
import { rules as vrtnu }          from "./scraper/vrtnu.js";
import { rules as youtube }        from "./scraper/youtube.js";

/**
 * Protège les caractères spéciaux pour les expressions rationnelles.
 *
 * @function sanitize
 * @param {string} pattern Une chaine de caractères.
 * @returns {string} La chaine de caractères avec les caractères spéciaux
 *                   protégés.
 */
export const sanitize = function (pattern) {
    return pattern.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&");
};

/**
 * Convertis un modèle de correspondance en expression rationnelle.
 *
 * @function compile
 * @param {string} pattern Un modèle de correspondance.
 * @returns {RegExp} L'expression rationnelle issue du modèle.
 */
export const compile = function (pattern) {
    if (pattern.startsWith("magnet:") || pattern.startsWith("acestream:")) {
        return new RegExp("^" + sanitize(pattern).replace(/\\\*/gu, ".*") + "$",
                          "iu");
    }

    const RE = /^(\*|https?):\/\/(\*|(?:\*\.)?[^/*]+|)\/(.*)$/iu;
    const [, scheme, host, path] = RE.exec(pattern);
    return new RegExp("^" +
        ("*" === scheme ? "https?"
                        : sanitize(scheme)) + "://" +
        ("*" === host ? "[^/]+"
                      : sanitize(host).replace(/^\\\*/gu, "[^./]+")) +
        "/" + sanitize(path).replace(/\\\*/gu, ".*") + "$", "iu");
};

/**
 * Normalise un scraper.
 *
 * @param {Map} scraper Le scraper (avec ses modèles de correspondance et ses
 *                      actions).
 * @returns {Array.<object>} Les patrons URLs gérées ainsi que leur action.
 */
export const normalize = function (scraper) {
    return Array.from(scraper.entries(), ([patterns, action]) => {
        return Array.isArray(patterns) ? [patterns, action]
                                       : [Array.of(patterns), action];
    }).flatMap(([patterns, action]) => {
        return patterns.map((p) => {
            return { "pattern": compile(p), "action": action };
        });
    });
};

/**
 * Les patrons (sous forme d'expression rationnelle) des URLs gérées ainsi que
 * leur action.
 *
 * @constant {Array.<object>}
 */
export const scrapers = [
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
    facebook,
    flickr,
    full30,
    gamekult,
    instagram,
    jamendo,
    jeuxvideocom,
    kcaastreaming,
    mixcloud,
    mixer,
    mycloudplayers,
    onetv,
    peertube,
    pippa,
    podcloud,
    radio,
    radioline,
    rutube,
    soundcloud,
    steam,
    stormotv,
    tiktok,
    torrent,
    twitch,
    vimeo,
    vrtnu,
    youtube,
    // Utiliser les scrapers génériques en dernier recours.
    generics
].flatMap(normalize);
