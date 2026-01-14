/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { afterEach, describe, it, mock } from "node:test";
import * as scraper from "../../../../src/core/scraper/kick.js";
import "../../setup.js";

describe("core/scraper/kick.js", () => {
    afterEach(() => {
        mock.reset();
    });

    describe("extractLive()", () => {
        it("shouldn't handle when it's a unsupported URL", async () => {
            const url = new URL("https://kick.com/foo/videos/bar");

            const file = await scraper.extractLive(url);
            assert.equal(file, undefined);
        });

        it("should return undefined with legal page", async () => {
            const fetch = mock.method(globalThis, "fetch", () =>
                Promise.resolve(
                    Response.json({
                        error: "Not Found",
                        message: "Channel not found.",
                        status: 404,
                    }),
                ),
            );

            const url = new URL("https://kick.com/bar");

            const file = await scraper.extractLive(url);
            assert.equal(file, undefined);

            assert.equal(fetch.mock.callCount(), 1);
            assert.deepEqual(fetch.mock.calls[0].arguments, [
                "https://kick.com/api/v2/channels/bar",
            ]);
        });

        it("should return live URL", async () => {
            const fetch = mock.method(globalThis, "fetch", () =>
                Promise.resolve(
                    // eslint-disable-next-line camelcase
                    Response.json({ playback_url: "https://foo.com/bar.m3u8" }),
                ),
            );

            const url = new URL("https://kick.com/baz");

            const file = await scraper.extractLive(url);
            assert.equal(file, "https://foo.com/bar.m3u8");

            assert.equal(fetch.mock.callCount(), 1);
            assert.deepEqual(fetch.mock.calls[0].arguments, [
                "https://kick.com/api/v2/channels/baz",
            ]);
        });

        it("should return undefined when it isn't a live", async () => {
            const fetch = mock.method(globalThis, "fetch", () =>
                // eslint-disable-next-line camelcase
                Promise.resolve(Response.json({ playback_url: "?foo=bar" })),
            );

            const url = new URL("https://kick.com/baz");

            const file = await scraper.extractLive(url);
            assert.equal(file, undefined);

            assert.equal(fetch.mock.callCount(), 1);
            assert.deepEqual(fetch.mock.calls[0].arguments, [
                "https://kick.com/api/v2/channels/baz",
            ]);
        });
    });

    describe("extractVideo()", () => {
        it("shouldn't handle when it's a unsupported URL", async () => {
            const url = new URL("https://kick.com/foo");

            const file = await scraper.extractVideo(url);
            assert.equal(file, undefined);
        });

        it("should return undefined when it isn't a video", async () => {
            const url = new URL("https://kick.com/foo/videos/bar");
            const metadata = {
                html: () =>
                    Promise.resolve(
                        new DOMParser().parseFromString(
                            `<html lang="en"><body>
                               <script></script>
                             </body></html>`,
                            "text/html",
                        ),
                    ),
            };

            const file = await scraper.extractVideo(url, metadata);
            assert.equal(file, undefined);
        });

        it("should return video URL", async () => {
            const url = new URL("https://kick.com/foo/videos/bar");
            const metadata = {
                html: () =>
                    Promise.resolve(
                        new DOMParser().parseFromString(
                            String.raw`<html lang="en"><body>
                               <script>self.__next_f.push({
                                   \"source\":\"https://stream.kick.com/baz/qux/master.m3u8\",
                                 })
                               </script>
                             </body></html>`,
                            "text/html",
                        ),
                    ),
            };

            const file = await scraper.extractVideo(url, metadata);
            assert.equal(file, "https://stream.kick.com/baz/qux/master.m3u8");
        });
    });
});
