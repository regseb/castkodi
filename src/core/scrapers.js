"use strict";

const SCRAPERS = [
    "airmozilla", "arteradio", "dumpert", "collegehumor", "dailymotion",
    "facebook", "mixcloud", "soundcloud", "twitch", "vimeo", "youtube", "video",
    "audio"
].map((s) => "scraper/" + s);

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

    const PATTERNS = [];

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
        } catch (_) {
            // Ignorer l'erreur, puis retourner une promesse rejetée.
        }
        return Promise.reject(new PebkacError("unsupported"));
    };

    for (const scraper of scrapers) {
        for (const [patterns, action] of scraper.entries()) {
            for (const pattern of patterns) {
                PATTERNS.push(pattern);
                RULES.set(compile(pattern), action);
            }
        }
    }

    return { "patterns": PATTERNS, extract };
});
