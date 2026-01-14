/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { afterEach, describe, it, mock } from "node:test";
import * as scraper from "../../../../src/core/scraper/steam.js";
import "../../setup.js";

describe("core/scraper/steam.js", () => {
    afterEach(() => {
        mock.reset();
    });

    describe("extractGame()", () => {
        it("shouldn't handle when it's a unsupported URL", async () => {
            const url = new URL("https://store.steampowered.com/stats/");

            const file = await scraper.extractGame(url);
            assert.equal(file, undefined);
        });

        it("should return undefined when it isn't a video", async () => {
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

        it("should return undefined when there isn't trailer", async () => {
            const url = new URL("https://store.steampowered.com/app/foo");
            const metadata = {
                html: () =>
                    Promise.resolve(
                        new DOMParser().parseFromString(
                            `<html lang="en"><body>
                               <div
                                 class="gamehighlight_desktopcarousel"
                                 data-props="${JSON.stringify({
                                     trailers: [],
                                 }).replaceAll('"', "&quot;")}"
                               ></div>
                             </body></html>`,
                            "text/html",
                        ),
                    ),
            };

            const file = await scraper.extractGame(url, metadata);
            assert.equal(file, undefined);
        });

        it("should return video URL", async () => {
            const url = new URL("https://store.steampowered.com/app/foo");
            const metadata = {
                html: () =>
                    Promise.resolve(
                        new DOMParser().parseFromString(
                            `<html lang="en"><body>
                               <div
                                 class="gamehighlight_desktopcarousel"
                             data-props="${JSON.stringify({
                                 trailers: [
                                     {
                                         hlsManifest:
                                             "https://bar.com/baz.m3u8",
                                     },
                                 ],
                             }).replaceAll('"', "&quot;")}"
                               ></div>
                             </body></html>`,
                            "text/html",
                        ),
                    ),
            };

            const file = await scraper.extractGame(url, metadata);
            assert.equal(file, "https://bar.com/baz.m3u8");
        });
    });

    describe("extractBroadcast()", () => {
        it("should return undefined when it isn't a video", async () => {
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

        it("should return video URL", async () => {
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
