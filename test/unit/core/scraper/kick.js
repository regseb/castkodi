/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { mock } from "node:test";
import * as scraper from "../../../../src/core/scraper/kick.js";

describe("core/scraper/kick.js", function () {
    afterEach(function () {
        mock.reset();
    });

    describe("extract()", function () {
        it("shouldn't handle when it's a unsupported URL", async function () {
            const url = new URL("https://help.kick.com/");

            const file = await scraper.extract(url);
            assert.equal(file, undefined);
        });

        it("should return undefined with legal page", async function () {
            const fetch = mock.method(globalThis, "fetch", () =>
                Promise.resolve(new Response("foo")),
            );

            const url = new URL("https://kick.com/bar");

            const file = await scraper.extract(url);
            assert.equal(file, undefined);

            assert.equal(fetch.mock.callCount(), 1);
            assert.deepEqual(fetch.mock.calls[0].arguments, [
                "https://kick.com/api/v2/channels/bar",
            ]);
        });

        it("should return live URL", async function () {
            const fetch = mock.method(globalThis, "fetch", () =>
                Promise.resolve(
                    // eslint-disable-next-line camelcase
                    Response.json({ playback_url: "https://foo.com/bar.m3u8" }),
                ),
            );

            const url = new URL("https://kick.com/baz");

            const file = await scraper.extract(url);
            assert.equal(file, "https://foo.com/bar.m3u8");

            assert.equal(fetch.mock.callCount(), 1);
            assert.deepEqual(fetch.mock.calls[0].arguments, [
                "https://kick.com/api/v2/channels/baz",
            ]);
        });

        it("should return undefined when it isn't a live", async function () {
            const fetch = mock.method(globalThis, "fetch", () =>
                // eslint-disable-next-line camelcase
                Promise.resolve(Response.json({ playback_url: "?foo=bar" })),
            );

            const url = new URL("https://kick.com/baz");

            const file = await scraper.extract(url);
            assert.equal(file, undefined);

            assert.equal(fetch.mock.callCount(), 1);
            assert.deepEqual(fetch.mock.calls[0].arguments, [
                "https://kick.com/api/v2/channels/baz",
            ]);
        });
    });
});
