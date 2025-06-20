/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { mock } from "node:test";
import * as scraper from "../../../../src/core/scraper/steam.js";

describe("core/scraper/steam.js", function () {
    afterEach(function () {
        mock.reset();
    });

    describe("extractGame()", function () {
        it("shouldn't handle when it's a unsupported URL", async function () {
            const url = new URL("https://store.steampowered.com/stats/");

            const file = await scraper.extractGame(url);
            assert.equal(file, undefined);
        });

        it("should return undefined when it isn't a video", async function () {
            const url = new URL("https://store.steampowered.com/app/foo");
            const metadata = {
                html: () =>
                    Promise.resolve(
                        new DOMParser().parseFromString(
                            '<html lang="en"><body></body></html>',
                            "text/html",
                        ),
                    ),
            };

            const file = await scraper.extractGame(url, metadata);
            assert.equal(file, undefined);
        });

        it("should return video URL", async function () {
            const url = new URL("https://store.steampowered.com/app/foo");
            const metadata = {
                html: () =>
                    Promise.resolve(
                        new DOMParser().parseFromString(
                            `<html lang="en"><body>
                               <div
                                 class="highlight_movie"
                                 data-mp4-hd-source="https://bar.com/baz.mp4"
                               ></div>
                             </body></html>`,
                            "text/html",
                        ),
                    ),
            };

            const file = await scraper.extractGame(url, metadata);
            assert.equal(file, "https://bar.com/baz.mp4");
        });
    });

    describe("extractBroadcast()", function () {
        it("should return undefined when it isn't a video", async function () {
            const fetch = mock.method(globalThis, "fetch", () =>
                Promise.resolve(Response.json({})),
            );

            const url = new URL(
                "https://steamcommunity.com/broadcast/watch/foo",
            );

            const file = await scraper.extractBroadcast(url);
            assert.equal(file, undefined);

            assert.equal(fetch.mock.callCount(), 1);
            assert.deepEqual(fetch.mock.calls[0].arguments, [
                "https://steamcommunity.com/broadcast/getbroadcastmpd/" +
                    "?steamid=foo",
            ]);
        });

        it("should return video URL", async function () {
            const fetch = mock.method(globalThis, "fetch", () =>
                Promise.resolve(
                    // eslint-disable-next-line camelcase
                    Response.json({ hls_url: "https://foo.com/bar.mp4" }),
                ),
            );

            const url = new URL(
                "https://steamcommunity.com/broadcast/watch/baz",
            );

            const file = await scraper.extractBroadcast(url);
            assert.equal(file, "https://foo.com/bar.mp4");

            assert.equal(fetch.mock.callCount(), 1);
            assert.deepEqual(fetch.mock.calls[0].arguments, [
                "https://steamcommunity.com/broadcast/getbroadcastmpd/" +
                    "?steamid=baz",
            ]);
        });
    });
});
