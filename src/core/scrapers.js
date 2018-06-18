/**
 * @module core/scrapers
 */

import { PebkacError }           from "./pebkac.js";
import { rules as airmozilla }   from "./scraper/airmozilla.js";
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

const SCRAPERS = [
    airmozilla, arteradio, dumpert, collegehumor, dailymotion, facebook,
    jeuxvideocom, mixcloud, peertube, rutube, soundcloud, twitch, vimeo,
    youtube, video, audio
];

const sanitize = function (pattern) {
    return pattern.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

const compile = function (pattern) {
    const RE = /^\*:\/\/(\*|(?:\*\.)?[^/*]+|)\/(.*)$/i;
    const [, host, path] = RE.exec(pattern);
    return new RegExp("^https?://" +
        ("*" === host ? "[^/]+"
                      : sanitize(host).replace(/^\\\*/g, "[^./]+")) +
        "/" + sanitize(path).replace(/\\\*/g, ".*") + "$", "i");
};

/**
 * Les patrons (sous formes de modèles de correspondance) des URLs gérées.
 *
 * @const PATTERNS
 */
export const PATTERNS = [];

/**
 * Les patrons (sous formes d'expressions rationnelles) des URLs gérées.
 *
 * @const REGEXPS
 */
export const REGEXPS = [];

const RULES = new Map();

export const extract = function (url) {
    try {
        for (const [regexps, action] of RULES) {
            for (const regexp of regexps) {
                if (regexp.test(url)) {
                    return action(new URL(url));
                }
            }
        }
        // Si l'URL n'est pas gérée par les scrapers : envoyer directement l'URL
        // à Kodi.
        return Promise.resolve(url);
    } catch (_) {
        // Ignorer l'erreur (provenant d'une URL invalide), puis rejeter une
        // promesse.
        return Promise.reject(new PebkacError("noLink"));
    }
};

for (const scraper of SCRAPERS) {
    for (const [patterns, action] of scraper) {
        PATTERNS.push(...patterns);
        const regexps = patterns.map(compile);
        REGEXPS.push(...regexps);
        RULES.set(regexps, action);
    }
}
