/**
 * @module core/scrapers
 */

import { PebkacError }           from "./pebkac.js";
import { rules as allocine }     from "./scraper/allocine.js";
import { rules as arteradio }    from "./scraper/arteradio.js";
import { rules as devtube }      from "./scraper/devtube.js";
import { rules as dumpert }      from "./scraper/dumpert.js";
import { rules as collegehumor } from "./scraper/collegehumor.js";
import { rules as dailymotion }  from "./scraper/dailymotion.js";
import { rules as facebook }     from "./scraper/facebook.js";
import { rules as full30 }       from "./scraper/full30.js";
import { rules as jeuxvideocom } from "./scraper/jeuxvideocom.js";
import { rules as liveleak }     from "./scraper/liveleak.js";
import { rules as mixcloud }     from "./scraper/mixcloud.js";
import { rules as peertube }     from "./scraper/peertube.js";
import { rules as rutube }       from "./scraper/rutube.js";
import { rules as soundcloud }   from "./scraper/soundcloud.js";
import { rules as stormotv }     from "./scraper/stormotv.js";
import { rules as twitch }       from "./scraper/twitch.js";
import { rules as vimeo }        from "./scraper/vimeo.js";
import { rules as youtube }      from "./scraper/youtube.js";
import { rules as torrent }      from "./scraper/torrent.js";
import { rules as acestream }    from "./scraper/acestream.js";
import { rules as video }        from "./scraper/video.js";
import { rules as audio }        from "./scraper/audio.js";

const scrapers = [
    allocine, arteradio, devtube, dumpert, collegehumor, dailymotion, facebook,
    full30, jeuxvideocom, mixcloud, peertube, rutube, soundcloud, stormotv,
    twitch, vimeo, youtube, torrent, acestream, video, audio, generic
];

/**
 * Teste si une chaine de caractères est une URL.
 *
 * @param {string} url La chaine de caractères pouvant contenir une URL.
 * @returns {boolean} <code>true</code> c'est une URL ; sinon
 *                    <code>false</code>.
 */
const isUrl = function (url) {
    try {
        return Boolean(new URL(url)) && (
               (/^https?:\/\/[^/]+\/.*$/iu).test(url) ||
               (/^magnet:.*$/iu).test(url) ||
               (/^acestream:.*$/iu).test(url));
    } catch (_) {
        // Ignorer l'erreur provenant d'une URL invalide.
        return false;
    }
};

/**
 * Protège les caractères spéciaux pour les expressions rationnelles.
 *
 * @function sanitize
 * @param {string} pattern Une chaine de caractères.
 * @returns {string} La chaine de caractères avec les caractères spéciaux
 *                   protégés.
 */
const sanitize = function (pattern) {
    return pattern.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&");
};

const compile = function (pattern) {
    if (pattern.startsWith("magnet:") || pattern.startsWith("acestream")) {
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
 * Les patrons (sous formes de modèles de correspondance et d'expressons
 * rationnelles) des URLs gérées ainsi que leur action.
 *
 * @constant {Array.<Object.<string,*>>} SCRAPERS
 */
export const SCRAPERS = [];

/**
 * Extrait le <em>fichier</em> d'une URL.
 *
 * @param {string} url L'URL d'une page Internet.
 * @returns {Promse} L'URL du <em>fichier</em>.
 */
export const extract = function (url) {
    const scraper = SCRAPERS.find((s) => s.regexp.test(url));
    // Si l'URL n'est pas gérée par les scrapers : envoyer directement l'URL.
    if (undefined === scraper) {
        return Promise.resolve(url);
    }

    try {
        return scraper.action(new URL(url));
    } catch (_) {
        // Ignorer l'erreur (provenant d'une URL invalide), puis rejeter une
        // promesse.
        return Promise.reject(new PebkacError("noLink"));
    }
};

for (const scraper of scrapers) {
    for (const [patterns, action] of scraper) {
        for (const pattern of patterns) {
            SCRAPERS.push({
                "pattern": pattern,
                "regexp":  compile(pattern),
                "action":  action
            });
        }
    }
}
