/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { extract } from "../../../src/core/scrapers.js";
import { config } from "../config.js";
import "../setup.js";

describe("Scraper: Facebook", () => {
    it("should return video URL", async () => {
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

    it("should return video URL when it's mobile version", async () => {
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

    it("should return video URL from watch page", async () => {
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

    it("should return video URL from reel page", async () => {
        const url = new URL("https://www.facebook.com/reel/451758037799270");
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        assert.ok(
            undefined !== file && new URL(file).pathname.endsWith(".mp4"),
            `new URL("${file}").pathname.endsWith(...)`,
        );
    });

    it("should return video URL from short link", async (t) => {
        // Ne pas exécuter ce test aux États-Unis, car la redirection ne
        // fonctionne pas.
        if (undefined !== config.country && "us" === config.country) {
            t.skip();
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
