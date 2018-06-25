/**
 * @module core/scrapers
 */

import { PebkacError }           from "./pebkac.js";
import { rules as airmozilla }   from "./scraper/airmozilla.js";
import { rules as allocine }     from "./scraper/allocine.js";
import { rules as arteradio }    from "./scraper/arteradio.js";
import { rules as dumpert }      from "./scraper/dumpert.js";
import { rules as collegehumor } from "./scraper/collegehumor.js";
import { rules as dailymotion }  from "./scraper/dailymotion.js";
import { rules as facebook }     from "./scraper/facebook.js";
import { rules as jeuxvideocom } from "./scraper/jeuxvideocom.js";
import { rules as mixcloud }     from "./scraper/mixcloud.js";
import { rules as peertube }     from "./scraper/peertube.js";
import { rules as rutube }       from "./scraper/rutube.js";
import { rules as soundcloud }   from "./scraper/soundcloud.js";
import { rules as twitch }       from "./scraper/twitch.js";
import { rules as vimeo }        from "./scraper/vimeo.js";
import { rules as youtube }      from "./scraper/youtube.js";
import { rules as video }        from "./scraper/video.js";
import { rules as audio }        from "./scraper/audio.js";

const scrapers = [
    airmozilla, allocine, arteradio, dumpert, collegehumor, dailymotion,
    facebook, jeuxvideocom, mixcloud, peertube, rutube, soundcloud, twitch,
    vimeo, youtube, video, audio
];

const sanitize = function (pattern) {
    return pattern.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

const compile = function (pattern) {
    const RE = /^(\*|https?):\/\/(\*|(?:\*\.)?[^/*]+|)\/(.*)$/i;
    const [, scheme, host, path] = RE.exec(pattern);
    return new RegExp("^" +
        ("*" === scheme ? "https?"
                        : sanitize(scheme)) + "://" +
        ("*" === host ? "[^/]+"
                      : sanitize(host).replace(/^\\\*/g, "[^./]+")) +
        "/" + sanitize(path).replace(/\\\*/g, ".*") + "$", "i");
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
