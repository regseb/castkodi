/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { mock } from "node:test";
import * as scraper from "../../../../src/core/scraper/acast.js";

describe("core/scraper/acast.js", function () {
    afterEach(function () {
        mock.reset();
    });

    describe("extract()", function () {
        it("shouldn't handle when it's a unsupported URL", async function () {
            const url = new URL("https://play.acast.com/foo/bar");

            const file = await scraper.extract(url);
            assert.equal(file, undefined);
        });

        it("should return undefined when id is invalid", async function () {
            const fetch = mock.method(globalThis, "fetch", () =>
                Promise.resolve(Response.json({})),
            );

            const url = new URL("https://play.acast.com/s/foo/bar");

            const file = await scraper.extract(url);
            assert.equal(file, undefined);

            assert.equal(fetch.mock.callCount(), 1);
            assert.deepEqual(fetch.mock.calls[0].arguments, [
                "https://feeder.acast.com/api/v1/shows/foo/episodes/bar",
            ]);
        });

        it("should return audio URL", async function () {
            const fetch = mock.method(globalThis, "fetch", () =>
                Promise.resolve(
                    Response.json({ url: "https://foo.com/bar.mp3" }),
                ),
            );

            const url = new URL("https://play.acast.com/s/baz/qux?quux=corge");

            const file = await scraper.extract(url);
            assert.equal(file, "https://foo.com/bar.mp3");

            assert.equal(fetch.mock.callCount(), 1);
            assert.deepEqual(fetch.mock.calls[0].arguments, [
                "https://feeder.acast.com/api/v1/shows/baz/episodes/qux",
            ]);
        });

        it("should return audio URL embed", async function () {
            const fetch = mock.method(globalThis, "fetch", () =>
                Promise.resolve(
                    Response.json({ url: "https://foo.com/bar.mp3" }),
                ),
            );

            const url = new URL("https://embed.acast.com/baz/qux?quux=corge");

            const file = await scraper.extract(url);
            assert.equal(file, "https://foo.com/bar.mp3");

            assert.equal(fetch.mock.callCount(), 1);
            assert.deepEqual(fetch.mock.calls[0].arguments, [
                "https://feeder.acast.com/api/v1/shows/baz/episodes/qux",
            ]);
        });
    });
});
