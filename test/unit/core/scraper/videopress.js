/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import sinon from "sinon";
import * as scraper from "../../../../src/core/scraper/videopress.js";

describe("core/scraper/videopress.js", function () {
    describe("extract()", function () {
        it("shouldn't handle when it's a unsupported URL", async function () {
            const url = new URL("https://videopress.com/");

            const file = await scraper.extract(url);
            assert.equal(file, undefined);
        });

        it("should return video URL", async function () {
            const stub = sinon
                .stub(globalThis, "fetch")
                .resolves(
                    Response.json({ original: "https://foo.com/bar.avi" }),
                );

            const url = new URL("https://videopress.com/v/baz");

            const file = await scraper.extract(url);
            assert.equal(file, "https://foo.com/bar.avi");

            assert.equal(stub.callCount, 1);
            assert.deepEqual(stub.firstCall.args, [
                "https://public-api.wordpress.com/rest/v1.1/videos/baz",
            ]);
        });

        it("should return video URL from embed", async function () {
            const stub = sinon
                .stub(globalThis, "fetch")
                .resolves(
                    Response.json({ original: "https://foo.com/bar.avi" }),
                );

            const url = new URL("https://videopress.com/embed/baz?qux=quux");

            const file = await scraper.extract(url);
            assert.equal(file, "https://foo.com/bar.avi");

            assert.equal(stub.callCount, 1);
            assert.deepEqual(stub.firstCall.args, [
                "https://public-api.wordpress.com/rest/v1.1/videos/baz",
            ]);
        });

        it("should return undefined when video not found", async function () {
            const stub = sinon
                .stub(globalThis, "fetch")
                .resolves(new Response("", { status: 404 }));

            const url = new URL("https://videopress.com/v/foo");

            const file = await scraper.extract(url);
            assert.equal(file, undefined);

            assert.equal(stub.callCount, 1);
            assert.deepEqual(stub.firstCall.args, [
                "https://public-api.wordpress.com/rest/v1.1/videos/foo",
            ]);
        });
    });
});
