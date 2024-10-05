/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { extract } from "../../../src/core/scrapers.js";
import { config } from "../config.js";

describe("Scraper: Ultimedia [fr]", function () {
    before(function () {
        // Désactiver les tests d'Ultimedia en dehors de la France, car les
        // pages sont en "maintenance" dans les autres pays.
        if (undefined !== config.country && "fr" !== config.country) {
            // eslint-disable-next-line no-invalid-this
            this.skip();
        }
    });

    it("should return undefined when it isn't a video", async function () {
        const url = new URL(
            "https://www.ultimedia.com/default/presentation/cgu",
        );
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        assert.equal(file, undefined);
    });

    it("should return video URL", async function () {
        const url = new URL(
            "https://www.ultimedia.com/default/index/videogeneric/id/mvlx0f",
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
            "http://www.ultimedia.com/default/index/videogeneric/id/83vr0l",
        );
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        assert.ok(
            undefined !== file && new URL(file).pathname.endsWith(".mp4"),
            `new URL("${file}").pathname.endsWith(...)`,
        );
    });

    it("should return video URL from embed", async function () {
        const url = new URL(
            "https://www.ultimedia.com/deliver/generic/iframe/mdtk/01836272" +
                "/src/pzmpzr/zone/1/showtitle/1/",
        );
        const context = { depth: false, incognito: false };

        const file = await extract(url, context);
        assert.ok(
            undefined !== file && new URL(file).pathname.endsWith(".mp4"),
            `new URL("${file}").pathname.endsWith(...)`,
        );
    });
});
