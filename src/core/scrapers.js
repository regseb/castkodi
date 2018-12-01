/**
 * @module core/scrapers
 */

import { PebkacError }           from "./pebkac.js";
import { rules as allocine }     from "./scraper/allocine.js";
import { rules as arteradio }    from "./scraper/arteradio.js";
import { rules as devtube }      from "./scraper/devtube.js";
import { rules as dumpert }      from "./scraper/dumpert.js";
import { rules as dailymotion }  from "./scraper/dailymotion.js";
import { rules as facebook }     from "./scraper/facebook.js";
import { rules as flickr }       from "./scraper/flickr.js";
import { rules as full30 }       from "./scraper/full30.js";
import { rules as instagram }    from "./scraper/instagram.js";
import { rules as jeuxvideocom } from "./scraper/jeuxvideocom.js";
import { rules as mixcloud }     from "./scraper/mixcloud.js";
import { rules as peertube }     from "./scraper/peertube.js";
import { rules as radioline }    from "./scraper/radioline.js";
import { rules as rutube }       from "./scraper/rutube.js";
import { rules as soundcloud }   from "./scraper/soundcloud.js";
import { rules as stormotv }     from "./scraper/stormotv.js";
import { rules as twitch }       from "./scraper/twitch.js";
import { rules as vimeo }        from "./scraper/vimeo.js";
import { rules as youtube }      from "./scraper/youtube.js";
import { rules as torrent }      from "./scraper/torrent.js";
import { rules as acestream }    from "./scraper/acestream.js";

/**
 * La liste des scrapers.
 *
 * @constant {Array.<Object>} scrapers
 */
const scrapers = [
    allocine, arteradio, devtube, dumpert, dailymotion, facebook, flickr,
    full30, instagram, jeuxvideocom, mixcloud, peertube, radioline, rutube,
    soundcloud, stormotv, twitch, vimeo, youtube, torrent, acestream
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
    } catch {
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

/**
 * Convertit un modèle de correspondance en expression rationnelle.
 *
 * @function compile
 * @param {string} pattern Un modèle de correspondance.
 * @returns {RegExp} L'expression rationnelle issue du modèle.
 */
const compile = function (pattern) {
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
 * Les patrons (sous forme de d'expression rationnelle) des URLs gérées ainsi
 * que leur action.
 *
 * @constant {Array.<Object.<string,*>>} SCRAPERS
 */
const SCRAPERS = [];

/**
 * Appelle le bon scraper selon l'URL d'une page Internet.
 *
 * @function dispatch
 * @param {string} url L'URL d'une page Internet.
 * @returns {Promise} L'URL du <em>fichier</em> ou <code>null</code> si aucun
 *                    scraper ne gère cette URL.
 */
const dispatch = function (url) {
    const scraper = SCRAPERS.find((s) => s.pattern.test(url));
    return undefined === scraper ? null
                                 : scraper.action(new URL(url));
};

/**
 * Fouille la page (si c'est du HTML) pour en extraire des éléments
 * <code>video</code>, <code>audio</code> ou <code>iframe</code>.
 *
 * @function dispatch
 * @param {string} url L'URL d'une page Internet.
 * @returns {Promise} L'URL du fichier.
 */
const rummage = function (url) {
    return fetch(url).then(function (response) {
        const type = response.headers.get("Content-Type");
        if (type.startsWith("text/html") ||
                type.startsWith("application/xhtml+xml")) {
            return response.text();
        }
        // Si ce n'est pas une page HTML : simuler une page vide.
        return "";
    }).then(function (data) {
        const doc = new DOMParser().parseFromString(data, "text/html");

        const selector = "video source, video, audio source, audio, iframe";
        for (const element of doc.querySelectorAll(selector)) {
            if (element.hasAttribute("src") &&
                    isUrl(element.getAttribute("src"))) {
                if ("IFRAME" === element.tagName) {
                    const file = dispatch(element.getAttribute("src"));
                    if (null !== file) {
                        return file;
                    }
                } else {
                    return element.getAttribute("src");
                }
            }
        }

        return url;
    });
};

/**
 * Extrait le <em>fichier</em> d'une URL.
 *
 * @function extract
 * @param {string} url L'URL d'une page Internet.
 * @returns {Promise} L'URL du <em>fichier</em>.
 */
export const extract = function (url) {
    if (!isUrl(url)) {
        return Promise.reject(new PebkacError("noLink"));
    }

    const file = dispatch(url);
    return null === file ? rummage(url)
                         : file;
};

for (const scraper of scrapers) {
    for (const [patterns, action] of scraper) {
        for (const pattern of patterns) {
            SCRAPERS.push({
                "pattern": compile(pattern),
                "action":  action
            });
        }
    }
}
