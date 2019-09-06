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
import { rules as mycloudplayers } from "./scraper/mycloudplayers.js";
import { rules as onetv }          from "./scraper/onetv.js";
import { rules as peertube }       from "./scraper/peertube.js";
import { rules as pippa }          from "./scraper/pippa.js";
import { rules as podcloud }       from "./scraper/podcloud.js";
import { rules as radioline }      from "./scraper/radioline.js";
import { rules as rutube }         from "./scraper/rutube.js";
import { rules as soundcloud }     from "./scraper/soundcloud.js";
import { rules as steampowered }   from "./scraper/steampowered.js";
import { rules as stormotv }       from "./scraper/stormotv.js";
import { rules as torrent }        from "./scraper/torrent.js";
import { rules as twitch }         from "./scraper/twitch.js";
import { rules as vimeo }          from "./scraper/vimeo.js";
import { rules as vrtnu }          from "./scraper/vrtnu.js";
import { rules as youtube }        from "./scraper/youtube.js";

/**
 * La liste des scrapers.
 *
 * @constant {Array.<object>}
 */
const scrapers = [
    allocine, applepodcasts, arte, arteradio, blogtalkradio, devtube, dumpert,
    dailymotion, facebook, flickr, full30, gamekult, instagram, jamendo,
    jeuxvideocom, kcaastreaming, mixcloud, mycloudplayers, onetv, peertube,
    pippa, podcloud, radioline, rutube, soundcloud, steampowered, stormotv,
    twitch, vimeo, vrtnu, youtube, torrent, acestream, generics
];

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
 * Convertis un modèle de correspondance en expression rationnelle.
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
 * Les patrons (sous forme d'expression rationnelle) des URLs gérées ainsi que
 * leur action.
 *
 * @constant {Array.<object.<string,*>>}
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
    return SCRAPERS.filter((s) => s.pattern.test(url))
                   .reduce((result, scraper) => {
        return result.then((file) => {
            // Si aucun fichier n'a encore été trouvé : continuer d'analyser
            // avec les autres scrapers.
            return null === file ? scraper.action(new URL(url))
                                 : file;
        });
    }, Promise.resolve(null));
};

/**
 * Fouille la page (si c'est du HTML) pour en extraire des éléments
 * <code>iframe</code>.
 *
 * @function rummage
 * @param {string} url L'URL d'une page Internet.
 * @returns {Promise} L'URL du <em>fichier</em> ou l'URL de la page Internet si
 *                    aucun élément n'est présent.
 */
const rummage = function (url) {
    return fetch(url).then((response) => {
        const contentType = response.headers.get("Content-Type");
        if (null !== contentType &&
                (contentType.startsWith("text/html") ||
                 contentType.startsWith("application/xhtml+xml"))) {
            return response.text();
        }
        // Si ce n'est pas une page HTML : simuler une page vide.
        return "";
    }).then((data) => {
        const doc = new DOMParser().parseFromString(data, "text/html");

        return Array.from(doc.querySelectorAll("iframe[src]"))
                    .reduce((result, element) => {
            return result.then((file) => {
                // Si aucun fichier n'a encore été trouvé : continuer d'analyser
                // les iframes de la page.
                return null === file
                      ? dispatch(new URL(element.getAttribute("src"), url).href)
                      : file;
            });
        }, Promise.resolve(null)).then((file) => {
            // Si aucun fichier n'a été trouvé : retourner le lien d'origine.
            return null === file ? url
                                 : file;
        });
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
    return dispatch(url).then((file) => {
        return null === file ? rummage(url)
                             : file;
    });
};

for (const scraper of scrapers) {
    for (const [patterns, action] of scraper) {
        if (Array.isArray(patterns)) {
            for (const pattern of patterns) {
                SCRAPERS.push({
                    "pattern": compile(pattern),
                    "action":  action
                });
            }
        } else {
            SCRAPERS.push({
                "pattern": compile(patterns),
                "action":  action
            });
        }
    }
}
