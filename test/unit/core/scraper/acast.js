/**
 * @module
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import sinon from "sinon";
import * as scraper from "../../../../src/core/scraper/acast.js";

describe("core/scraper/acast.js", function () {
    describe("extract()", function () {
        it("shouldn't handle when it's a unsupported URL", async function () {
            const url = new URL("https://play.acast.com/foo/bar");

            const file = await scraper.extract(url);
            assert.equal(file, undefined);
        });

        it("should return undefined when id is invalid", async function () {
            const stub = sinon
                .stub(globalThis, "fetch")
                .resolves(Response.json({}));

            const url = new URL("https://play.acast.com/s/foo/bar");

            const file = await scraper.extract(url);
            assert.equal(file, undefined);

            assert.equal(stub.callCount, 1);
            assert.deepEqual(stub.firstCall.args, [
                "https://feeder.acast.com/api/v1/shows/foo/episodes/bar",
            ]);
        });

        it("should return audio URL", async function () {
            const stub = sinon
                .stub(globalThis, "fetch")
                .resolves(Response.json({ url: "https://foo.com/bar.mp3" }));

            const url = new URL("https://play.acast.com/s/baz/qux?quux=corge");

            const file = await scraper.extract(url);
            assert.equal(file, "https://foo.com/bar.mp3");

            assert.equal(stub.callCount, 1);
            assert.deepEqual(stub.firstCall.args, [
                "https://feeder.acast.com/api/v1/shows/baz/episodes/qux",
            ]);
        });

        it("should return audio URL embed", async function () {
            const stub = sinon
                .stub(globalThis, "fetch")
                .resolves(Response.json({ url: "https://foo.com/bar.mp3" }));

            const url = new URL("https://embed.acast.com/baz/qux?quux=corge");

            const file = await scraper.extract(url);
            assert.equal(file, "https://foo.com/bar.mp3");

            assert.equal(stub.callCount, 1);
            assert.deepEqual(stub.firstCall.args, [
                "https://feeder.acast.com/api/v1/shows/baz/episodes/qux",
            ]);
        });
    });
});
