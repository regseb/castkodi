/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import { afterEach, describe, it, mock } from "node:test";
import * as scraper from "../../../../src/core/scraper/bitchute.js";
import "../../setup.js";

describe("core/scraper/bitchute.js", () => {
    afterEach(() => {
        mock.reset();
    });

    describe("extract()", () => {
        it("shouldn't handle when it's a unsupported URL", async () => {
            const url = new URL("https://status.bitchute.com/");

            const file = await scraper.extract(url);
            assert.equal(file, undefined);
        });

        it("should return video URL", async () => {
            const fetch = mock.method(globalThis, "fetch", () =>
                Promise.resolve(
                    // eslint-disable-next-line camelcase
                    Response.json({ media_url: "https://foo.com/bar.mp4" }),
                ),
            );

            const url = new URL("https://www.bitchute.com/video/baz");

            const file = await scraper.extract(url);
            assert.equal(file, "https://foo.com/bar.mp4");

            assert.equal(fetch.mock.callCount(), 1);
            assert.deepEqual(fetch.mock.calls[0].arguments, [
                "https://api.bitchute.com/api/beta/video/media",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    // eslint-disable-next-line camelcase
                    body: JSON.stringify({ video_id: "baz" }),
                },
            ]);
        });
    });
});
