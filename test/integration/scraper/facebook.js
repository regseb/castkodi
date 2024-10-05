/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { extract } from "../../../src/core/scrapers.js";
import { config } from "../config.js";

describe("Scraper: Facebook", function () {
    it("should return video URL", async function () {
        const url = new URL(
            "https://www.facebook.com/XBMC/videos/10152476888501641/",
        );
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        assert.ok(
            undefined !== file && new URL(file).pathname.endsWith(".mp4"),
            `new URL("${file}").pathname.endsWith(...)`,
        );
    });

    it("should return video URL when protocol is HTTP", async function () {
        const url = new URL(
            "http://www.facebook.com/XBMC/videos/10152476888501641/",
        );
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        assert.ok(
            undefined !== file && new URL(file).pathname.endsWith(".mp4"),
            `new URL("${file}").pathname.endsWith(...)`,
        );
    });

    it("should return video URL when it's mobile version", async function () {
        const url = new URL(
            "https://m.facebook.com/XBMC/videos/10152476888501641/",
        );
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        assert.ok(
            undefined !== file && new URL(file).pathname.endsWith(".mp4"),
            `new URL("${file}").pathname.endsWith(...)`,
        );
    });

    it("should return video URL from watch page", async function () {
        const url = new URL(
            "https://www.facebook.com/watch/?v=315156812365737",
        );
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        assert.ok(
            undefined !== file && new URL(file).pathname.endsWith(".mp4"),
            `new URL("${file}").pathname.endsWith(...)`,
        );
    });

    it("should return video URL from reel page", async function () {
        const url = new URL("https://www.facebook.com/reel/451758037799270");
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        assert.ok(
            undefined !== file && new URL(file).pathname.endsWith(".mp4"),
            `new URL("${file}").pathname.endsWith(...)`,
        );
    });

    it("should return video URL from short link", async function () {
        // Ne pas exécuter ce test aux États-Unis, car la redirection ne
        // fonctionne pas.
        if (undefined !== config.country && "us" === config.country) {
            // eslint-disable-next-line no-invalid-this
            this.skip();
        }
        const url = new URL("https://fb.watch/sRzVMn9tIq/");
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        assert.ok(
            undefined !== file && new URL(file).pathname.endsWith(".mp4"),
            `new URL("${file}").pathname.endsWith(...)`,
        );
    });
});
