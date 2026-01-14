/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { afterEach, describe, it, mock } from "node:test";
import * as scraper from "../../../../src/core/scraper/peertube.js";
import "../../setup.js";

describe("core/scraper/peertube.js", () => {
    afterEach(() => {
        mock.reset();
    });

    describe("extract()", () => {
        it("shouldn't handle when it's a unsupported URL", async () => {
            const url = new URL("https://joinpeertube.org/fr/faq/");

            const file = await scraper.extract(url);
            assert.equal(file, undefined);
        });

        it("should return undefined when it isn't a video", async () => {
            const fetch = mock.method(globalThis, "fetch", () =>
                Promise.resolve(Response.json({})),
            );

            const url = new URL("https://foo.com/w/bar");

            const file = await scraper.extract(url);
            assert.equal(file, undefined);

            assert.equal(fetch.mock.callCount(), 1);
            assert.deepEqual(fetch.mock.calls[0].arguments, [
                "https://foo.com/api/v1/videos/bar",
            ]);
        });

        it("should return video URL", async () => {
            const fetch = mock.method(globalThis, "fetch", () =>
                Promise.resolve(
                    Response.json({
                        streamingPlaylists: [
                            {
                                playlistUrl: "https://foo.fr/bar.avi",
                                files: [],
                            },
                        ],
                    }),
                ),
            );

            const url = new URL("https://baz.com/w/qux");

            const file = await scraper.extract(url);
            assert.equal(file, "https://foo.fr/bar.avi");

            assert.equal(fetch.mock.callCount(), 1);
            assert.deepEqual(fetch.mock.calls[0].arguments, [
                "https://baz.com/api/v1/videos/qux",
            ]);
        });

        it("should return video URL from watch page", async () => {
            const fetch = mock.method(globalThis, "fetch", () =>
                Promise.resolve(
                    Response.json({
                        streamingPlaylists: [],
                        files: [{ fileUrl: "https://foo.io/bar.avi" }],
                    }),
                ),
            );

            const url = new URL("https://baz.com/videos/watch/qux");

            const file = await scraper.extract(url);
            assert.equal(file, "https://foo.io/bar.avi");

            assert.equal(fetch.mock.callCount(), 1);
            assert.deepEqual(fetch.mock.calls[0].arguments, [
                "https://baz.com/api/v1/videos/qux",
            ]);
        });

        it("should return video URL from embed page", async () => {
            const fetch = mock.method(globalThis, "fetch", () =>
                Promise.resolve(
                    Response.json({
                        streamingPlaylists: [],
                        files: [{ fileUrl: "https://foo.fr/bar.avi" }],
                    }),
                ),
            );

            const url = new URL("https://baz.com/videos/embed/qux");

            const file = await scraper.extract(url);
            assert.equal(file, "https://foo.fr/bar.avi");

            assert.equal(fetch.mock.callCount(), 1);
            assert.deepEqual(fetch.mock.calls[0].arguments, [
                "https://baz.com/api/v1/videos/qux",
            ]);
        });

        it("should return undefined when it isn't a PeerTube website", async () => {
            const fetch = mock.method(globalThis, "fetch", () =>
                Promise.reject(new Error("foo")),
            );

            const url = new URL("https://bar.com/w/baz");

            const file = await scraper.extract(url);
            assert.equal(file, undefined);

            assert.equal(fetch.mock.callCount(), 1);
            assert.deepEqual(fetch.mock.calls[0].arguments, [
                "https://bar.com/api/v1/videos/baz",
            ]);
        });
    });
});
