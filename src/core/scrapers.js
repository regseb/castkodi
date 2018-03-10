"use strict";

const SCRAPERS = [
    "airmozilla", "arteradio", "dumpert", "collegehumor", "dailymotion",
    "facebook", "mixcloud", "rutube", "soundcloud", "twitch", "vimeo",
    "youtube", "video", "audio"
].map((s) => "scraper/" + s);

/**
 * @module core/scrapers
 */
define(["pebkac", ...SCRAPERS], function (PebkacError, ...scrapers) {

    const sanitize = function (pattern) {
        return pattern.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    };

    const compile = function (pattern) {
        const RE = /^(\*|https?|file|ftp):\/\/(\*|(?:\*\.)?[^/*]+|)\/(.*)$/i;
        const [, scheme, host, path] = RE.exec(pattern);
        return new RegExp("^" +
            ("*" === scheme ? "https?"
                            : sanitize(scheme)) + "://" +
            ("*" === host ? "[^/]+"
                          : sanitize(host).replace(/^\\\*/g, "[^./]+")) +
            "/" + sanitize(path).replace(/\\\*/g, ".*") + "$", "i");
    };

    /**
     * Les patrons (sous formes de modèles de correspondance) des URLs gérées.
     *
     * @const PATTERNS
     */
    const PATTERNS = [];

    /**
     * Les patrons (sous formes d'expressions rationnelles) des URLs gérées.
     *
     * @const REGEXPS
     */
    const REGEXPS = [];

    const RULES = new Map();

    const extract = function (input) {
        try {
            const url = new URL(input);
            const prefix = url.protocol + "//" + url.hostname + url.pathname;
            for (const [pattern, action] of RULES) {
                if (pattern.test(prefix)) {
                    return action(url);
                }
            }
            // Si l'URL n'est pas gérée par les scrapers : envoyer directement
            // l'URL à Kodi.
            return Promise.resolve(input);
        } catch (_) {
            // Ignorer l'erreur (provenant d'une URL invalide), puis retourner
            // une promesse rejetée.
            return Promise.reject(new PebkacError("nolink"));
        }
    };

    for (const scraper of scrapers) {
        for (const [patterns, action] of scraper.entries()) {
            for (const pattern of patterns) {
                PATTERNS.push(pattern);
                const regexp = compile(pattern);
                REGEXPS.push(regexp);
                RULES.set(regexp, action);
            }
        }
    }

    return { "patterns": PATTERNS, "regexps": REGEXPS, extract };
});
