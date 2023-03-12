/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import sinon from "sinon";
import * as scraper from "../../../../src/core/scraper/veoh.js";

describe("core/scraper/veoh.js", function () {
    describe("extract()", function () {
        it("shouldn't handle when it's a unsupported URL", async function () {
            const url = new URL("https://www.veoh.com/list-c/foo");

            const file = await scraper.extract(url);
            assert.equal(file, undefined);
        });

        it("should return undefined when there isn't video", async function () {
            const stub = sinon
                .stub(globalThis, "fetch")
                .resolves(Response.json({ video: { src: { HQ: "" } } }));

            const url = new URL("https://www.veoh.com/watch/foo");

            const file = await scraper.extract(url);
            assert.equal(file, undefined);

            assert.equal(stub.callCount, 1);
            assert.deepEqual(stub.firstCall.args, [
                "https://www.veoh.com/watch/getVideo/foo",
            ]);
        });

        it("should return undefined when page doesn't exist", async function () {
            const stub = sinon
                .stub(globalThis, "fetch")
                .resolves(Response.json({}));

            const url = new URL("https://www.veoh.com/watch/foo");

            const file = await scraper.extract(url);
            assert.equal(file, undefined);

            assert.equal(stub.callCount, 1);
            assert.deepEqual(stub.firstCall.args, [
                "https://www.veoh.com/watch/getVideo/foo",
            ]);
        });

        it("should return video URL", async function () {
            const stub = sinon.stub(globalThis, "fetch").resolves(
                Response.json({
                    video: { src: { HQ: "https://foo.com/bar.mp4" } },
                }),
            );

            const url = new URL("https://www.veoh.com/watch/baz");

            const file = await scraper.extract(url);
            assert.equal(file, "https://foo.com/bar.mp4");

            assert.equal(stub.callCount, 1);
            assert.deepEqual(stub.firstCall.args, [
                "https://www.veoh.com/watch/getVideo/baz",
            ]);
        });
    });
});
