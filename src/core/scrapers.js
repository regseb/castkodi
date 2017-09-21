"use strict";

const SCRAPERS = [
    "collegehumor", "dailymotion", "facebook", "soundcloud", "twitch", "vimeo",
    "youtube", "video", "audio"
].map((s) => "scraper/" + s);

define(["pebkac", ...SCRAPERS], function (PebkacError, ...scrapers) {

    const sanitize = function (pattern) {
        return pattern.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    }; // sanitize()

    const compile = function (pattern) {
        const RE = /^(\*|https?|file|ftp):\/\/(\*|(?:\*\.)?[^/*]+|)\/(.*)$/i;
        const [, scheme, host, path] = RE.exec(pattern);
        return new RegExp("^" +
            ("*" === scheme ? "https?"
                            : sanitize(scheme)) + "://" +
            ("*" === host ? "[^/]+"
                          : sanitize(host).replace(/^\\\*/g, "[^./]+")) +
            "/" + sanitize(path).replace(/\\\*/g, ".*") + "$", "i");
    }; // compile()

    const PATTERNS = [];

    const RULES = scrapers.reduce(function (rules, scraper) {
        for (const [patterns, action] of scraper.entries()) {
            for (const pattern of patterns) {
                PATTERNS.push(pattern);
                rules.set(compile(pattern), action);
            }
        }
        return rules;
    }, new Map());

    const extract = function (url) {
        for (const [pattern, action] of RULES) {
            if (pattern.test(url.toString())) {
                return action(url);
            }
        }
        return Promise.reject(new PebkacError("unsupported"));
    }; // extract()

    return { "patterns": PATTERNS, extract };
});

