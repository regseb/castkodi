/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { afterEach, describe, it, mock } from "node:test";
import * as scraper from "../../../../src/core/scraper/videopress.js";
import "../../setup.js";

describe("core/scraper/videopress.js", () => {
    afterEach(() => {
        mock.reset();
    });

    describe("extract()", () => {
        it("shouldn't handle when it's a unsupported URL", async () => {
            const url = new URL("https://videopress.com/");

            const file = await scraper.extract(url);
            assert.equal(file, undefined);
        });

        it("should return video URL", async () => {
            const fetch = mock.method(globalThis, "fetch", () =>
                Promise.resolve(
                    Response.json({ original: "https://foo.com/bar.avi" }),
                ),
            );

            const url = new URL("https://videopress.com/v/baz");

            const file = await scraper.extract(url);
            assert.equal(file, "https://foo.com/bar.avi");

            assert.equal(fetch.mock.callCount(), 1);
            assert.deepEqual(fetch.mock.calls[0].arguments, [
                "https://public-api.wordpress.com/rest/v1.1/videos/baz",
            ]);
        });

        it("should return video URL from embed", async () => {
            const fetch = mock.method(globalThis, "fetch", () =>
                Promise.resolve(
                    Response.json({ original: "https://foo.com/bar.avi" }),
                ),
            );

            const url = new URL("https://videopress.com/embed/baz?qux=quux");

            const file = await scraper.extract(url);
            assert.equal(file, "https://foo.com/bar.avi");

            assert.equal(fetch.mock.callCount(), 1);
            assert.deepEqual(fetch.mock.calls[0].arguments, [
                "https://public-api.wordpress.com/rest/v1.1/videos/baz",
            ]);
        });

        it("should return undefined when video not found", async () => {
            const fetch = mock.method(globalThis, "fetch", () =>
                Promise.resolve(new Response("", { status: 404 })),
            );

            const url = new URL("https://videopress.com/v/foo");

            const file = await scraper.extract(url);
            assert.equal(file, undefined);

            assert.equal(fetch.mock.callCount(), 1);
            assert.deepEqual(fetch.mock.calls[0].arguments, [
                "https://public-api.wordpress.com/rest/v1.1/videos/foo",
            ]);
        });
    });
});
