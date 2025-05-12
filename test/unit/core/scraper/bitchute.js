/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import sinon from "sinon";
import * as scraper from "../../../../src/core/scraper/bitchute.js";

describe("core/scraper/bitchute.js", function () {
    describe("extract()", function () {
        it("shouldn't handle when it's a unsupported URL", async function () {
            const url = new URL("https://status.bitchute.com/");

            const file = await scraper.extract(url);
            assert.equal(file, undefined);
        });

        it("should return video URL", async function () {
            const stub = sinon.stub(globalThis, "fetch").resolves(
                // eslint-disable-next-line camelcase
                Response.json({ media_url: "https://foo.com/bar.mp4" }),
            );

            const url = new URL("https://www.bitchute.com/video/baz");

            const file = await scraper.extract(url);
            assert.equal(file, "https://foo.com/bar.mp4");

            assert.equal(stub.callCount, 1);
            assert.deepEqual(stub.firstCall.args, [
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
