/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { mock } from "node:test";
import * as scraper from "../../../../src/core/scraper/bigo.js";

describe("core/scraper/bigo.js", function () {
    afterEach(function () {
        mock.reset();
    });

    describe("extract()", function () {
        it("shouldn't handle when it's a unsupported URL", async function () {
            const url = new URL("https://www.bigo.sg/");

            const file = await scraper.extract(url);
            assert.equal(file, undefined);
        });

        it("should return undefined when it isn't an id", async function () {
            const url = new URL("https://www.bigo.tv/foo");

            const file = await scraper.extract(url);
            assert.equal(file, undefined);
        });

        it("should return undefined when pathname is invalid", async function () {
            const url = new URL("https://www.bigo.tv/foo/123");

            const file = await scraper.extract(url);
            assert.equal(file, undefined);
        });

        it("should return undefined when id is invalid", async function () {
            const url = new URL("https://www.bigo.tv/123foo");

            const file = await scraper.extract(url);
            assert.equal(file, undefined);
        });

        it("should return undefined when it isn't a video", async function () {
            const fetch = mock.method(globalThis, "fetch", () =>
                Promise.resolve(Response.json({ data: [] })),
            );

            const url = new URL("https://www.bigo.tv/123");

            const file = await scraper.extract(url);
            assert.equal(file, undefined);

            assert.equal(fetch.mock.callCount(), 1);
            assert.deepEqual(fetch.mock.calls[0].arguments, [
                "https://ta.bigo.tv/official_website/studio" +
                    "/getInternalStudioInfo",
                { method: "POST", body: new URLSearchParams("siteId=123") },
            ]);
        });

        it("should return video URL", async function () {
            const fetch = mock.method(globalThis, "fetch", () =>
                Promise.resolve(
                    Response.json({
                        // eslint-disable-next-line camelcase
                        data: { hls_src: "https://foo.tv/bar.m3u8" },
                    }),
                ),
            );

            const url = new URL("https://www.bigo.tv/123");

            const file = await scraper.extract(url);
            assert.equal(file, "https://foo.tv/bar.m3u8");

            assert.equal(fetch.mock.callCount(), 1);
            assert.deepEqual(fetch.mock.calls[0].arguments, [
                "https://ta.bigo.tv/official_website/studio" +
                    "/getInternalStudioInfo",
                { method: "POST", body: new URLSearchParams("siteId=123") },
            ]);
        });

        it("should return video URL from other language", async function () {
            const fetch = mock.method(globalThis, "fetch", () =>
                Promise.resolve(
                    Response.json({
                        // eslint-disable-next-line camelcase
                        data: { hls_src: "https://foo.tv/bar.m3u8" },
                    }),
                ),
            );

            const url = new URL("https://www.bigo.tv/ab/123");

            const file = await scraper.extract(url);
            assert.equal(file, "https://foo.tv/bar.m3u8");

            assert.equal(fetch.mock.callCount(), 1);
            assert.deepEqual(fetch.mock.calls[0].arguments, [
                "https://ta.bigo.tv/official_website/studio" +
                    "/getInternalStudioInfo",
                { method: "POST", body: new URLSearchParams("siteId=123") },
            ]);
        });

        it("should return undefined when it's offline", async function () {
            const fetch = mock.method(globalThis, "fetch", () =>
                // eslint-disable-next-line camelcase
                Promise.resolve(Response.json({ data: { hls_src: "" } })),
            );

            const url = new URL("https://www.bigo.tv/ab/123");

            const file = await scraper.extract(url);
            assert.equal(file, undefined);

            assert.equal(fetch.mock.callCount(), 1);
            assert.deepEqual(fetch.mock.calls[0].arguments, [
                "https://ta.bigo.tv/official_website/studio" +
                    "/getInternalStudioInfo",
                { method: "POST", body: new URLSearchParams("siteId=123") },
            ]);
        });

        it("should return undefined when it isn't a channel", async function () {
            const fetch = mock.method(globalThis, "fetch", () =>
                // eslint-disable-next-line camelcase
                Promise.resolve(Response.json({ data: { hls_src: null } })),
            );

            const url = new URL("https://www.bigo.tv/ab/123");

            const file = await scraper.extract(url);
            assert.equal(file, undefined);

            assert.equal(fetch.mock.callCount(), 1);
            assert.deepEqual(fetch.mock.calls[0].arguments, [
                "https://ta.bigo.tv/official_website/studio" +
                    "/getInternalStudioInfo",
                { method: "POST", body: new URLSearchParams("siteId=123") },
            ]);
        });
    });
});
