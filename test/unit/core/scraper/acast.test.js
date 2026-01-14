/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { afterEach, describe, it, mock } from "node:test";
import * as scraper from "../../../../src/core/scraper/acast.js";
import "../../setup.js";

describe("core/scraper/acast.js", () => {
    afterEach(() => {
        mock.reset();
    });

    describe("extract()", () => {
        it("shouldn't handle when it's a unsupported URL", async () => {
            const url = new URL("https://play.acast.com/foo/bar");

            const file = await scraper.extract(url);
            assert.equal(file, undefined);
        });

        it("should return audio URL", async () => {
            const fetch = mock.method(globalThis, "fetch", () =>
                Promise.resolve(
                    Response.json({ url: "https://foo.com/bar.mp3" }),
                ),
            );

            const url = new URL("https://shows.acast.com/baz/episodes/qux");

            const file = await scraper.extract(url);
            assert.equal(file, "https://foo.com/bar.mp3");

            assert.equal(fetch.mock.callCount(), 1);
            assert.deepEqual(fetch.mock.calls[0].arguments, [
                "https://feeder.acast.com/api/v1/shows/baz/episodes/qux",
            ]);
        });

        it("should return audio URL embed", async () => {
            const fetch = mock.method(globalThis, "fetch", () =>
                Promise.resolve(
                    Response.json({ url: "https://foo.com/bar.mp3" }),
                ),
            );

            const url = new URL("https://embed.acast.com/$/baz/qux");

            const file = await scraper.extract(url);
            assert.equal(file, "https://foo.com/bar.mp3");

            assert.equal(fetch.mock.callCount(), 1);
            assert.deepEqual(fetch.mock.calls[0].arguments, [
                "https://feeder.acast.com/api/v1/shows/baz/episodes/qux",
            ]);
        });
    });
});
