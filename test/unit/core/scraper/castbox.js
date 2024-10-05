/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import sinon from "sinon";
import * as scraper from "../../../../src/core/scraper/castbox.js";

describe("core/scraper/castbox.js", function () {
    describe("extract()", function () {
        it("shouldn't handle when it's a unsupported URL", async function () {
            const url = new URL("https://castbox.fm/home?country=fr");

            const file = await scraper.extract(url);
            assert.equal(file, undefined);
        });

        it("should return audio URL", async function () {
            const stub = sinon.stub(globalThis, "fetch").resolves(
                Response.json({
                    data: { url: "https://foo.tv/bar.mp3" },
                }),
            );

            const url = new URL("https://castbox.fm/episode/foo-id123-id456");

            const file = await scraper.extract(url);
            assert.equal(file, "https://foo.tv/bar.mp3");

            assert.equal(stub.callCount, 1);
            assert.deepEqual(stub.firstCall.args, [
                "https://everest.castbox.fm/data/episode/v4?eid=456",
            ]);
        });
    });
});
