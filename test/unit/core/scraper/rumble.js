/**
 * @license MIT
 * @author Sébastien Règne
 */

import assert from "node:assert/strict";
import sinon from "sinon";
import * as scraper from "../../../../src/core/scraper/rumble.js";

describe("core/scraper/rumble.js", function () {
    describe("extract()", function () {
        it("shouldn't handle when it's a unsupported URL", async function () {
            const url = new URL("https://help.rumble.com/");

            const file = await scraper.extract(url);
            assert.equal(file, undefined);
        });

        it("should return undefined when id is invalid", async function () {
            const stub = sinon
                .stub(globalThis, "fetch")
                .resolves(Response.json(false));

            const url = new URL("https://rumble.com/embed/foo");

            const file = await scraper.extract(url);
            assert.equal(file, undefined);

            assert.equal(stub.callCount, 1);
            assert.deepEqual(stub.firstCall.args, [
                "https://rumble.com/embedJS/u3/?request=video&v=foo",
            ]);
        });

        it("should return video URL", async function () {
            const stub = sinon.stub(globalThis, "fetch").resolves(
                Response.json({
                    ua: {
                        360: ["https://foo.com/bar_360.mp4", 0],
                        480: ["https://foo.com/bar_480.mp4", 0],
                        720: ["https://foo.com/bar_720.mp4", 0],
                        1080: ["https://foo.com/bar_1080.mp4", 0],
                    },
                }),
            );

            const url = new URL("https://rumble.com/embed/baz");

            const file = await scraper.extract(url);
            assert.equal(file, "https://foo.com/bar_1080.mp4");

            assert.equal(stub.callCount, 1);
            assert.deepEqual(stub.firstCall.args, [
                "https://rumble.com/embedJS/u3/?request=video&v=baz",
            ]);
        });
    });
});
