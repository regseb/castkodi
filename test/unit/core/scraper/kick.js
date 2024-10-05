/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import sinon from "sinon";
import * as scraper from "../../../../src/core/scraper/kick.js";

describe("core/scraper/kick.js", function () {
    describe("extract()", function () {
        it("shouldn't handle when it's a unsupported URL", async function () {
            const url = new URL("https://help.kick.com/");

            const file = await scraper.extract(url);
            assert.equal(file, undefined);
        });

        it("should return undefined with legal page", async function () {
            const stub = sinon
                .stub(globalThis, "fetch")
                .resolves(new Response("foo"));

            const url = new URL("https://kick.com/bar");

            const file = await scraper.extract(url);
            assert.equal(file, undefined);

            assert.equal(stub.callCount, 1);
            assert.deepEqual(stub.firstCall.args, [
                "https://kick.com/api/v1/channels/bar",
            ]);
        });

        it("should return live URL", async function () {
            const stub = sinon.stub(globalThis, "fetch").resolves(
                // eslint-disable-next-line camelcase
                Response.json({ playback_url: "https://foo.com/bar.m3u8" }),
            );

            const url = new URL("https://kick.com/baz");

            const file = await scraper.extract(url);
            assert.equal(file, "https://foo.com/bar.m3u8");

            assert.equal(stub.callCount, 1);
            assert.deepEqual(stub.firstCall.args, [
                "https://kick.com/api/v1/channels/baz",
            ]);
        });

        it("should return undefined when it isn't a live", async function () {
            const stub = sinon
                .stub(globalThis, "fetch")
                // eslint-disable-next-line camelcase
                .resolves(Response.json({ playback_url: "?foo=bar" }));

            const url = new URL("https://kick.com/baz");

            const file = await scraper.extract(url);
            assert.equal(file, undefined);

            assert.equal(stub.callCount, 1);
            assert.deepEqual(stub.firstCall.args, [
                "https://kick.com/api/v1/channels/baz",
            ]);
        });
    });
});
