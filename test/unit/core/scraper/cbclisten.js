/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { mock } from "node:test";
import * as scraper from "../../../../src/core/scraper/cbclisten.js";

describe("core/scraper/cbclisten.js", function () {
    afterEach(function () {
        mock.reset();
    });

    describe("extractClip()", function () {
        it("shouldn't handle when it's a unsupported URL", async function () {
            const url = new URL(
                "https://www.cbc.ca/listen/live-radio/1-42-foo",
            );

            const file = await scraper.extractClip(url);
            assert.equal(file, undefined);
        });

        it("should return undefined when ids not found", async function () {
            const url = new URL(
                "https://www.cbc.ca/listen/live-radio/foo/clip/bar",
            );

            const file = await scraper.extractClip(url);
            assert.equal(file, undefined);
        });

        it("should return undefined when show not found", async function () {
            const fetch = mock.method(globalThis, "fetch", () =>
                Promise.resolve(Response.json({})),
            );

            const url = new URL(
                "https://www.cbc.ca/listen/live-radio/1-42-foo/clip/43-bar",
            );

            const file = await scraper.extractClip(url);
            assert.equal(file, undefined);

            assert.equal(fetch.mock.callCount(), 1);
            assert.deepEqual(fetch.mock.calls[0].arguments, [
                "https://www.cbc.ca/listen/api/v1/shows/1/42/clips" +
                    "?pageSize=2147483647",
            ]);
        });

        it("should return undefined when clip not found", async function () {
            const fetch = mock.method(globalThis, "fetch", () =>
                Promise.resolve(
                    Response.json({
                        data: {
                            clips: [
                                {
                                    clipID: 42,
                                    src: "https://foo.com/bar.mp3",
                                },
                            ],
                        },
                    }),
                ),
            );

            const url = new URL(
                "https://www.cbc.ca/listen/live-radio/1-43-baz/clip/44-qux",
            );

            const file = await scraper.extractClip(url);
            assert.equal(file, undefined);

            assert.equal(fetch.mock.callCount(), 1);
            assert.deepEqual(fetch.mock.calls[0].arguments, [
                "https://www.cbc.ca/listen/api/v1/shows/1/43/clips" +
                    "?pageSize=2147483647",
            ]);
        });

        it("should return audio URL", async function () {
            const fetch = mock.method(globalThis, "fetch", () =>
                Promise.resolve(
                    Response.json({
                        data: {
                            clips: [
                                {
                                    clipID: 42,
                                    src: "https://foo.com/bar.mp3",
                                },
                            ],
                        },
                    }),
                ),
            );

            const url = new URL(
                "https://www.cbc.ca/listen/live-radio/1-43-baz/clip/42-qux",
            );

            const file = await scraper.extractClip(url);
            assert.equal(file, "https://foo.com/bar.mp3");

            assert.equal(fetch.mock.callCount(), 1);
            assert.deepEqual(fetch.mock.calls[0].arguments, [
                "https://www.cbc.ca/listen/api/v1/shows/1/43/clips" +
                    "?pageSize=2147483647",
            ]);
        });
    });

    describe("extractPodcast()", function () {
        it("shouldn't handle when it's a unsupported URL", async function () {
            const url = new URL(
                "https://www.cbc.ca/listen/cbc-podcasts/42-foo",
            );

            const file = await scraper.extractPodcast(url);
            assert.equal(file, undefined);
        });

        it("should return undefined when ids not found", async function () {
            const url = new URL(
                "https://www.cbc.ca/listen/cbc-podcasts/foo/episode/bar",
            );

            const file = await scraper.extractPodcast(url);
            assert.equal(file, undefined);
        });

        it("should return undefined when podcast not found", async function () {
            const fetch = mock.method(globalThis, "fetch", () =>
                Promise.resolve(Response.json({})),
            );

            const url = new URL(
                "https://www.cbc.ca/listen/cbc-podcasts/42-foo/episode/43-bar",
            );

            const file = await scraper.extractPodcast(url);
            assert.equal(file, undefined);

            assert.equal(fetch.mock.callCount(), 1);
            assert.deepEqual(fetch.mock.calls[0].arguments, [
                "https://www.cbc.ca/listen/api/v1/podcasts/42",
            ]);
        });

        it("should return undefined when episode not found", async function () {
            const fetch = mock.method(globalThis, "fetch", () =>
                Promise.resolve(
                    Response.json({
                        data: {
                            episodes: [
                                {
                                    clipID: 42,
                                    mediaURL: "https://foo.com/bar.mp3",
                                },
                            ],
                        },
                    }),
                ),
            );

            const url = new URL(
                "https://www.cbc.ca/listen/cbc-podcasts/43-baz/episode/44-qux",
            );

            const file = await scraper.extractPodcast(url);
            assert.equal(file, undefined);

            assert.equal(fetch.mock.callCount(), 1);
            assert.deepEqual(fetch.mock.calls[0].arguments, [
                "https://www.cbc.ca/listen/api/v1/podcasts/43",
            ]);
        });

        it("should return audio URL", async function () {
            const fetch = mock.method(globalThis, "fetch", () =>
                Promise.resolve(
                    Response.json({
                        data: {
                            episodes: [
                                {
                                    clipID: 42,
                                    mediaURL: "https://foo.com/bar.mp3",
                                },
                            ],
                        },
                    }),
                ),
            );

            const url = new URL(
                "https://www.cbc.ca/listen/cbc-podcasts/43-baz/episode/42-qux",
            );

            const file = await scraper.extractPodcast(url);
            assert.equal(file, "https://foo.com/bar.mp3");

            assert.equal(fetch.mock.callCount(), 1);
            assert.deepEqual(fetch.mock.calls[0].arguments, [
                "https://www.cbc.ca/listen/api/v1/podcasts/43",
            ]);
        });
    });
});
