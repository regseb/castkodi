/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { afterEach, describe, it, mock } from "node:test";
import * as scraper from "../../../../src/core/scraper/srf.js";
import "../../setup.js";

describe("core/scraper/srf.js", () => {
    afterEach(() => {
        mock.reset();
    });

    describe("extractVideo()", () => {
        it("shouldn't handle when it's a unsupported URL", async () => {
            const url = new URL("https://www.srf.ch/foo");

            const file = await scraper.extractVideo(url);
            assert.equal(file, undefined);
        });

        it("should return undefined when there isn't urn", async () => {
            const url = new URL("https://www.srf.ch/play/tv/foo/video/bar");

            const file = await scraper.extractVideo(url);
            assert.equal(file, undefined);
        });

        it("should return undefined when urn is invalid", async () => {
            const fetch = mock.method(globalThis, "fetch", () =>
                Promise.resolve(Response.json({ status: "foo" })),
            );

            const url = new URL(
                "https://www.srf.ch/play/tv/bar/video/baz?urn=qux",
            );

            const file = await scraper.extractVideo(url);
            assert.equal(file, undefined);

            assert.equal(fetch.mock.callCount(), 1);
            assert.deepEqual(fetch.mock.calls[0].arguments, [
                "https://il.srgssr.ch/integrationlayer/2.0/mediaComposition" +
                    "/byUrn/qux",
            ]);
        });

        it("should return video URL", async () => {
            const fetch = mock.method(globalThis, "fetch", () =>
                Promise.resolve(
                    Response.json({
                        chapterList: [
                            {
                                resourceList: [
                                    {
                                        analyticsMetadata: {
                                            // eslint-disable-next-line camelcase
                                            media_url:
                                                "https://foo.ch/bar.m3u8",
                                        },
                                    },
                                ],
                            },
                        ],
                    }),
                ),
            );

            const url = new URL(
                "https://www.srf.ch/play/tv/baz/video/qux?urn=quux",
            );

            const file = await scraper.extractVideo(url);
            assert.equal(file, "https://foo.ch/bar.m3u8");

            assert.equal(fetch.mock.callCount(), 1);
            assert.deepEqual(fetch.mock.calls[0].arguments, [
                "https://il.srgssr.ch/integrationlayer/2.0/mediaComposition" +
                    "/byUrn/quux",
            ]);
        });
    });

    describe("extractRedirect()", () => {
        it("shouldn't handle when it's a unsupported URL", async () => {
            const url = new URL("https://www.srf.ch/play/tv/redirect/foo");

            const file = await scraper.extractRedirect(url);
            assert.equal(file, undefined);
        });

        it("should return undefined when urn is invalid", async () => {
            const fetch = mock.method(globalThis, "fetch", () =>
                Promise.resolve(Response.json({ status: "foo" })),
            );

            const url = new URL(
                "https://www.srf.ch/play/tv/redirect/detail/bar",
            );

            const file = await scraper.extractRedirect(url);
            assert.equal(file, undefined);

            assert.equal(fetch.mock.callCount(), 1);
            assert.deepEqual(fetch.mock.calls[0].arguments, [
                "https://il.srgssr.ch/integrationlayer/2.0/mediaComposition" +
                    "/byUrn/urn:srf:video:bar",
            ]);
        });

        it("should return video URL", async () => {
            const fetch = mock.method(globalThis, "fetch", () =>
                Promise.resolve(
                    Response.json({
                        chapterList: [
                            {
                                resourceList: [
                                    {
                                        analyticsMetadata: {
                                            // eslint-disable-next-line camelcase
                                            media_url:
                                                "https://foo.ch/bar.m3u8",
                                        },
                                    },
                                ],
                            },
                        ],
                    }),
                ),
            );

            const url = new URL(
                "https://www.srf.ch/play/tv/redirect/detail/baz",
            );

            const file = await scraper.extractRedirect(url);
            assert.equal(file, "https://foo.ch/bar.m3u8");

            assert.equal(fetch.mock.callCount(), 1);
            assert.deepEqual(fetch.mock.calls[0].arguments, [
                "https://il.srgssr.ch/integrationlayer/2.0/mediaComposition" +
                    "/byUrn/urn:srf:video:baz",
            ]);
        });
    });
});
