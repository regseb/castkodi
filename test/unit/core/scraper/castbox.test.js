/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { mock } from "node:test";
import * as scraper from "../../../../src/core/scraper/castbox.js";

describe("core/scraper/castbox.js", function () {
    afterEach(function () {
        mock.reset();
    });

    describe("extract()", function () {
        it("shouldn't handle when it's a unsupported URL", async function () {
            const url = new URL("https://castbox.fm/home?country=fr");

            const file = await scraper.extract(url);
            assert.equal(file, undefined);
        });

        it("should return audio URL", async function () {
            const fetch = mock.method(globalThis, "fetch", () =>
                Promise.resolve(
                    Response.json({ data: { url: "https://foo.tv/bar.mp3" } }),
                ),
            );

            const url = new URL("https://castbox.fm/episode/foo-id123-id456");

            const file = await scraper.extract(url);
            assert.equal(file, "https://foo.tv/bar.mp3");

            assert.equal(fetch.mock.callCount(), 1);
            assert.deepEqual(fetch.mock.calls[0].arguments, [
                "https://everest.castbox.fm/data/episode/v4?eid=456",
            ]);
        });
    });
});
